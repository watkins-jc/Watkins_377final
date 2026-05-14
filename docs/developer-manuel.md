# Developer Manual

[Click to go back to the REAMDE file](../README.md)

## Application Structure

The application contains:
- Frontend HTML/CSS/JavaScript pages
- Node.js + Express backend server
- Supabase database integration
- OpenFoodFacts API integration

Main project folders:
- `/public` → Frontend pages, CSS, and JS
- `/docs` → Documentation
- `index.js` → Express server and API routes

---

# Installation Instructions

## Clone Repository

```bash
git clone https://github.com/watkins-jc/Watkins_377final.git
```

---

## Install Dependencies

Run:

```bash
npm install
```

Required packages include:
- express
- cors
- dotenv
- body-parser
- @supabase/supabase-js

---

## Environment Variables

Create a `.env` file in the root project folder.

Add:

```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_KEY=YOUR_SUPABASE_KEY
```

---

# Running the Application

Start the server using:

```bash
node index.js
```

Server runs on:

```txt
http://localhost:3000
```

---

# Frontend Pages

## Home Page
- Search functionality
- Navigation to all pages

## Results Page
- Displays food search results
- Shows healthier alternatives using Nutri-Score

## Details Page
- Displays full nutrition information
- Generates Chart.js nutrition chart
- Allows users to save products

## Compare Page
- Compares two foods side-by-side
- Displays nutrition comparison chart

## Saved Page
- Displays saved products from Supabase database

## About Page
- Provides project overview

## 404 Page
- Custom error page for invalid routes

---

# API Endpoints

## GET /api/search

Searches the OpenFoodFacts API for products.

### Example

```txt
/api/search?query=apple
```

### Returns
- Array of matching food products

---

## GET /api/product/:code

Retrieves detailed information for a single product.

### Example

```txt
/api/product/737628064502
```

### Returns
- Single product object

---

## POST /api/save

Saves a product into the Supabase database.

### Request Body Example

```json
{
  "product_name": "Protein Bar",
  "calories": 250,
  "protein": 20,
  "sugar": 5,
  "fat": 8,
  "image_url": "image-link"
}
```

---

## GET /api/saved

Retrieves all saved products from Supabase.

### Returns
- Array of saved products

---

# Database Information

Supabase Table:

## saved_products

Columns:
- id
- product_name
- calories
- protein
- sugar
- fat
- image_url

---

# Libraries Used

## Chart.js
Used to generate nutrition comparison charts.

## Animate.css
Used for page transitions and animations.

---

# Testing

Testing was completed manually using:
- Browser testing
- Console logging
- Insomnia API testing

Browsers tested:
- Chrome
- Edge
- Firefox

---

# Known Bugs

- Some OpenFoodFacts products contain missing nutrition information
- Some images from the API may fail to load
- Search speed depends on external API response times

---

# Future Improvements

Potential future updates include:
- User authentication/login system
- Personalized recommendations
- Barcode scanner integration
- User-created food entries
- Improved filtering and sorting
- Mobile-first redesign
- Better nutrition scoring algorithms

---

# Author

Curtis Watkins

INST377 Final Project
