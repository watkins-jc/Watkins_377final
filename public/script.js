const params = new URLSearchParams(window.location.search);


function goSearch() {
    const term = document.getElementById("searchBar").value;
    window.location.href = `results.html?query=${term}`;
}

function newSearch() {
    const term = document.getElementById("searchBar").value;
    window.location.href = `results.html?query=${term}`;
}


if (window.location.pathname.includes("results.html")) {
    const query = params.get("query");
    if (query) {
        document.getElementById("searchBar").value = query;
        document.getElementById("results").innerHTML =
            "<h2>Loading products...</h2>";
        document.getElementById("healthy").innerHTML =
            "<h2>Finding healthier alternatives...</h2>";
        fetch(`/api/search?query=${query}`)
            .then(res => res.json())
            .then(data => {
                let output = "";
                let healthyOutput = "";
                data.slice(0, 10).forEach(item => {
                    output += `
                    <div class="card">
                        <h3>${item.product_name || "No Name"}</h3>
                        <p>${item.brands || "Unknown Brand"}</p>
                        <img src="${item.image_front_url || ""}">
                        <p>Sugar:${item.nutriments?.sugars_100g || 0}g</p>
                        <p>Protein:${item.nutriments?.proteins_100g || 0}g</p>
                        <br>
                        <a href="details.html?code=${item.code}">View Details</a>
                    </div>
                    `;
                });
                const healthierProducts = data.filter(item => {
                    const grade =
                        item.nutriscore_grade;
                    return (
                        grade === "a" ||
                        grade === "b"
                    );
                });
                const nutriRank = {
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4,
                    e: 5
                };
                healthierProducts.sort((a, b) => {
                    return (
                        nutriRank[a.nutriscore_grade || "e"]
                        -
                        nutriRank[b.nutriscore_grade || "e"]
                    );
                });
                healthierProducts.slice(0, 5).forEach(item => {
                    healthyOutput += `
                    <div class="card">
                        <h3>${item.product_name || "Healthy Option"}</h3>
                        <p>Healthier options</p>
                        <img src="${item.image_front_url || ""}" >
                        <p>Sugar:${item.nutriments?.sugars_100g || 0}g</p>
                        <p>Fat:${item.nutriments?.fat_100g || 0}g</p>
                        <p>Protein:${item.nutriments?.proteins_100g || 0}g</p>
                        <p>Nutri-Score:${item.nutriscore_grade?.toUpperCase()||"N/A"}</p>
                        <br>
                        <a href="details.html?code=${item.code}">View Details</a>
                    </div>
                    `;
                });
                if (healthyOutput === "") {
                    healthyOutput = `
                    <div class="card">
                        <h3>No healthier alternatives found.</h3>
                    </div>
                    `;
                }
                document.getElementById("results").innerHTML =
                    output;
                document.getElementById("healthy").innerHTML =
                    healthyOutput;
            });
    }
}


if (window.location.pathname.includes("details.html")) {
    const code = params.get("code");
    if (code) {
        fetch(`/api/product/${code}`)
            .then(res => res.json())
            .then(item => {
                document.getElementById("details").innerHTML = `
                <div class="card animate__animated animate__fadeIn">
                    <h2>${item.product_name || "Unknown Product"}</h2>
                    <img src="${item.image_front_url || ""}">
                    <p>Calories:${item.nutriments["energy-kcal_100g"] || "N/A"}</p>
                    <p>Protein:${item.nutriments.proteins_100g || "N/A"} g</p>
                    <p>Sugar:${item.nutriments.sugars_100g || "N/A"} g</p>
                    <p>Fat:${item.nutriments.fat_100g || "N/A"} g</p>
                    <p>Nutri-Score:${item.nutriscore_grade?.toUpperCase() || "N/A"}</p>
                    <button
                        class="saveBtn"
                        data-name="${item.product_name || ''}"
                        data-calories="${item.nutriments['energy-kcal_100g'] || 0}"
                        data-protein="${item.nutriments.proteins_100g || 0}"
                        data-sugar="${item.nutriments.sugars_100g || 0}"
                        data-fat="${item.nutriments.fat_100g || 0}"
                        data-image="${item.image_front_url || ''}"
                    >Save Product</button>
                    <canvas id="chart"></canvas>
                </div>
                `;
                document.querySelector(".saveBtn")
                .addEventListener("click", function () {
                    saveProduct(
                        this.dataset.name,
                        this.dataset.calories,
                        this.dataset.protein,
                        this.dataset.sugar,
                        this.dataset.fat,
                        this.dataset.image
                    );
                });
                makeChart(item);
            });
    }
}


function makeChart(item) {
    const ctx = document.getElementById("chart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Calories", "Protein", "Sugar", "Fat"],
            datasets: [{
                label: "Nutrition",
                data: [
                    item.nutriments["energy-kcal_100g"] || 0,
                    item.nutriments.proteins_100g || 0,
                    item.nutriments.sugars_100g || 0,
                    item.nutriments.fat_100g || 0
                ]
            }]
        }
    });
}

function saveProduct(
    name,
    calories,
    protein,
    sugar,
    fat,
    image

) {
    fetch("/api/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            product_name: name,
            calories: calories,
            protein: protein,
            sugar: sugar,
            fat: fat,
            image_url: image
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Product Saved!");
    })
    .catch(err => {
        console.log(err);
        alert("Save failed.");
    });
}

let foodCache = {};
let compareChart = null;
function fetchFood(query) {
    if (foodCache[query]) return Promise.resolve(foodCache[query]);

    return fetch(`/api/search?query=${query}`)
        .then(res => res.json())
        .then(data => {
            foodCache[query] = data;
            return data;
        });
}

function compareFoods() {
    const food1 =
        document.getElementById("food1").value.trim();
    const food2 =
        document.getElementById("food2").value.trim();
    if (!food1 || !food2) {
        document.getElementById("compareResults")
        .innerHTML ="<p>Please enter two foods.</p>";
        return;
    }
    Promise.all([
        fetchFood(food1),
        fetchFood(food2)
    ])
    .then(([data1, data2]) => {
        const item1 = data1?.[0];
        const item2 = data2?.[0];
        if (!item1 || !item2) {
            document.getElementById("compareResults")
            .innerHTML ="<p>Food not found.</p>";
            return;
        }
        document.getElementById("compareResults")
        .innerHTML = `
        <div class="compareContainer">
            <div class="card animate__animated animate__fadeInLeft">
                <h2>${item1.product_name}</h2>
                <img src="${item1.image_front_url || ""}">
                <p>Calories:${item1.nutriments["energy-kcal_100g"] || 0}</p>
                <p>Sugar:${item1.nutriments?.sugars_100g || 0}g</p>
                <p>Fat:${item1.nutriments?.fat_100g || 0}g</p>
                <p>Protein:${item1.nutriments?.proteins_100g || 0}g</p>
                <p>Nutri-Score:${item1.nutriscore_grade?.toUpperCase() || "N/A"}</p>
            </div>


            <div class="card animate__animated animate__fadeInRight">
                <h2>${item2.product_name}</h2>
                <img src="${item2.image_front_url || ""}">
                <p>Calories:${item2.nutriments["energy-kcal_100g"] || 0}</p>
                <p>Sugar:${item2.nutriments?.sugars_100g || 0}g</p>
                <p>Fat:${item2.nutriments?.fat_100g || 0}g</p>
                <p>Protein:${item2.nutriments?.proteins_100g || 0}g</p>
                <p>Nutri-Score:${item2.nutriscore_grade?.toUpperCase() || "N/A"}</p>
            </div>
        </div>
        `;
        const ctx =
            document.getElementById("compareChart");
        if (compareChart) {
            compareChart.destroy();
        }
        compareChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: [
                    "Calories",
                    "Sugar",
                    "Fat",
                    "Protein"
                ],
                datasets: [
                    {
                        label: item1.product_name,
                        data: [
                            item1.nutriments["energy-kcal_100g"] || 0,
                            item1.nutriments?.sugars_100g || 0,
                            item1.nutriments?.fat_100g || 0,
                            item1.nutriments?.proteins_100g || 0
                        ]
                    },
                    {
                        label: item2.product_name,
                        data: [
                            item2.nutriments["energy-kcal_100g"] || 0,
                            item2.nutriments?.sugars_100g || 0,
                            item2.nutriments?.fat_100g || 0,
                            item2.nutriments?.proteins_100g || 0
                        ]
                    }
                ]
            }
        });
    })
    .catch(err => {
        console.log(err);
        document.getElementById("compareResults")
        .innerHTML =
        "<p>Comparison failed.</p>";
    });
}
if(window.location.pathname.includes("saved.html")){
    fetch("/api/saved")
    .then(res=>res.json())
    .then(data=>{
        let output="";
        data.forEach(item=>{
            output+=`
            <div class="card animate__animated animate__fadeIn">
                <h2>${item.product_name}</h2>
                <img src="${item.image_url || ""}">
                <p>Calories:${item.calories}</p>
                <p>Protein:${item.protein}g</p>
                <p>Sugar:${item.sugar}g</p>
                <p>Fat:${item.fat}g</p>
            </div>
            `;
        });
        document.getElementById("savedProducts").innerHTML=output;
    });
}