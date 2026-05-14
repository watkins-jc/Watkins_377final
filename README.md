# Watkins_377final
Final for INST377 project

# Healthy Food Alternatives
This web app helps users, mostly aimed towards college students search for foods,
view nutritional information, compare two foods, and discover healthier alternatives using 
the OpenFoodFacts nutri scores.

## Target Browsers
 - Any workable browsers
    -Chrome
    -Edge
    -FireFox
    -Safari

## Delpoyment
Vercel link here --> https://watkins-377final.vercel.app/

# API Endpoints
GET /api/search
    goes to the OpenFoodFacts API

GET /api/product/:code
    Retrieves specific product details

POST /api/save
    Saves products to Supabase database

GET /api/saved
    Retrieves saved products

# Installation
npm install
Create a .env file containing:
    SUPABASE_URL=
    SUPABASE_KEY=
Run server:
    node app.js

# Future Improvements
Any additional improvements i would make are creating user profiles
personalized reccomendations
Barcode scanning,
Being able to add things into the API from the app
