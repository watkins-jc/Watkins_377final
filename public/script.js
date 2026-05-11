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

        fetch(`/api/search?query=${query}`)
            .then(res => res.json())
            .then(data => {
                let output = "";
                let healthyOutput = "";

                data.forEach(item => {
                    output += `
                    <div class="card">
                        <h3>${item.product_name || "No Name"}</h3>
                        <p>${item.brands || "Unknown Brand"}</p>
                        <img src="${item.image_front_url || ""}">
                        <br><br>
                        <a href="details.html?code=${item.code}">View Details</a>
                    </div>
                    `;

                    if (item.nutriments?.sugars_100g < 5) {
                        healthyOutput += `
                        <div class="card">
                            <h3>${item.product_name}</h3>
                            <p>Low Sugar Option</p>
                        </div>
                        `;
                    }
                });

                document.getElementById("results").innerHTML = output;
                document.getElementById("healthy").innerHTML = healthyOutput;
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
                <div class="card">
                    <h2>${item.product_name}</h2>
                    <img src="${item.image_front_url || ""}">
                    <p>Calories: ${item.nutriments["energy-kcal_100g"] || "N/A"}</p>
                    <p>Protein: ${item.nutriments.proteins_100g || "N/A"} g</p>
                    <p>Sugar: ${item.nutriments.sugars_100g || "N/A"} g</p>
                    <p>Fat: ${item.nutriments.fat_100g || "N/A"} g</p>

                    <button onclick='saveProduct(${JSON.stringify(item)})'>Save</button>

                    <canvas id="chart"></canvas>
                </div>
                `;

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

function saveProduct(item) {
    fetch("/api/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: item.product_name,
            calories: item.nutriments["energy-kcal_100g"],
            protein: item.nutriments.proteins_100g,
            sugar: item.nutriments.sugars_100g,
            fat: item.nutriments.fat_100g
        })
    })
    .then(() => alert("Saved!"));
}

function compareFoods() {
    const food1 = document.getElementById("food1").value;
    const food2 = document.getElementById("food2").value;

    Promise.all([
        fetch(`/api/search?query=${food1}`).then(res => res.json()),
        fetch(`/api/search?query=${food2}`).then(res => res.json())
    ])
    .then(([data1, data2]) => {
        const item1 = data1[0];
        const item2 = data2[0];

        document.getElementById("compareResults").innerHTML = `
        <div class="card">
            <h3>${item1.product_name}</h3>
            <p>Sugar: ${item1.nutriments.sugars_100g || 0}</p>
        </div>
        <div class="card">
            <h3>${item2.product_name}</h3>
            <p>Sugar: ${item2.nutriments.sugars_100g || 0}</p>
        </div>
        `;

        const ctx = document.getElementById("compareChart");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Sugar", "Fat", "Protein"],
                datasets: [
                    {
                        label: item1.product_name,
                        data: [
                            item1.nutriments.sugars_100g || 0,
                            item1.nutriments.fat_100g || 0,
                            item1.nutriments.proteins_100g || 0
                        ]
                    },
                    {
                        label: item2.product_name,
                        data: [
                            item2.nutriments.sugars_100g || 0,
                            item2.nutriments.fat_100g || 0,
                            item2.nutriments.proteins_100g || 0
                        ]
                    }
                ]
            }
        });
    });
}