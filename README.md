## API Description

This API was a final project for my CS 493 (Cloud Application Development) course at Oregon State University. This API acts as service for information related to beers and breweries. Specifically, what breweries are “currently” serving what beer, and what that beer is all about. Beer data fields can be as broad as beer name and type, or go as explicit as the International Bitterness Units (ibu) and Alcohol by Volume (abv) value. This project was a chance for me to explore, and implement, a variety of cutting-edge technologies and concepts that are standard in cloud application development including:
* Docker and Docker-compose containerization
* JSON Web Tokens
* Redis as data store
* Multi-container applications
* Shifting MySQL schemas -> MongoDB schemas with [mongoose.js](http://mongoosejs.com/)
* [Token-bucket algorithm](https://en.wikipedia.org/wiki/Token_bucket) for rate limiting with Redis
* [Wait-for-it.sh](https://github.com/vishnubob/wait-for-it) style container start-up management
* Regex expressions for search queries
* Using mongoose.js to convert NoSQL-style databases into relational entities.
* JavaScript module/exports modularization

It is known that this API contains security concerns.

[![Build Status](https://travis-ci.org/DSchroederOSU/Brewery_API.svg?branch=master)](https://travis-ci.org/DSchroederOSU/Brewery_API)
# Table of Contents 

<!--ts-->
  * [API Description](#api-description)
  * [Team Members](#team-members)
  * [Nouns](#nouns)
    * [Brewery](#brewery)
    * [Beer](#beer)
    * [Style](#style)
    * [User](#user)
  * [API Endpoints](#api-endpoints)
    * [Breweries](#breweries)
      * [Get all breweries](#get-all-breweries) 
      * [Create new brewery](#create-brewery)
      * [Get brewery by ID](#get-brewery-by-id) 
      * [Update brewery by ID](#update-brewery-by-id)
      * [Delete brewery by ID](#delete-brewery-by-id)      
      * [Get brewery styles](#get-brewery-styles) 
      * [Get brewery beers by style](#get-brewery-beers-by-style)     
      * [Get beers for specific brewery](#get-beers-for-specific-brewery) 
    * [Beers](#beers)
      * [Get all beers](#get-all-beers) 
      * [Create new beer](#create-beer)
      * [Get beer by ID](#get-beer-by-id) 
      * [Update beer by ID](#update-beer-by-id)
      * [Delete beer by ID](#delete-beer-by-id)
    * [Styles](#styles)
      * [Get all styles](#get-all-styles) 
      * [Create new style](#create-style)
      * [Get style by ID](#get-style-by-id) 
      * [Update style by ID](#update-style-by-id)
      * [Delete style by ID](#delete-style-by-id)                   
  * [Data Storage](#data-storage)
    * [Mongoose.js](#mongoose-js)
    * [Redis](#redis)
    * [MongoDB](#mongodb)
  * [Security](#security)
<!--te--> 

This repository should run out of the box if your machine has Docker installed.

```docker-compose up```

Will spin up the database containers and the api container and effectively create a fully functioning API.

## Team Members

Daniel Schroeder <schrodan@oregonstate.edu>

## Nouns

### Brewery
```JavaScript
const brewerySchema = mongoose.Schema({
    name: { type: String, required: true },
    website: { type: String, required: false },
    facebook_url: { type: String, required: false },
    twitter_url: { type: String, required: false },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
    beers : [{ type: Schema.Types.ObjectId, ref: 'Beer' }],
});
```

### Beer
```JavaScript
const beerSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    created_on: Date,
    in_stores: { type: Boolean, required: true },
    ibu: { type: Number, required: true },
    abv:{ type: Number, required: true },
    brewery: { type: Schema.Types.ObjectId, ref: 'Brewery' },
    style: { type: Schema.Types.ObjectId, ref: 'Style' },
});
```

### Style
```JavaScript
const styleSchema = mongoose.Schema({
    name: { type: String, required: true }
});
```

### User
```JavaScript
const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    api_key: { type: String, required: true }
});
```

## API Endpoints
### Breweries
#### Get all breweries

   A collection of all breweries in the database.
 
* **URL:** /breweries

* **Method:**  `GET` 
  
*  **URL Params**
   
   **Required:** `None`

   **Optional:**  An optional search query that will run as a $Regex expression on the "name" field
   
   `search=String`

* **Data Params**

   `None`

* **Success Response:**
  
  * **Code:** 200 <br />
    **Content:** 
    ```json
    {
      "breweries": [
          {
              "beers": [
                  {
                      "name": "Ridgeback Red"
                  },
                  {
                      "name": "An IPA"
                  },
                  {
                      "name": "An DIPA"
                  },
                  {
                      "name": "My second DIPA"
                  }
              ],
              "_id": "5b149c984959fea7157713bf",
              "name": "Block 15 Brewing",
              "website": "http://block15.com/",
              "facebook_url": "https://www.facebook.com/Block15Brewing",
              "twitter_url": "https://twitter.com/Block15Brewing",
              "phone": "541-758-2077",
              "address": "300 SW Jefferson Ave.",
              "city": "Corvallis",
              "state": "OR",
              "zip": 97330
          },
          {
              "beers": [],
              "_id": "5b14bff56b6c2910a1d55784",
              "name": "Mazama Brewing",
              "website": "http://mazamabrewing.com/contact",
              "facebook_url": "https://www.facebook.com/MazamaBrewing/",
              "twitter_url": "https://twitter.com/MazamaBrewing",
              "address": "33930 SE Eastgate Circle",
              "phone": "541-230-1810",
              "city": "Corvallis",
              "state": "OR",
              "zip": 97330,
              "__v": 0
          }
        ]
      }
    ```
 
* **Error Response:**

  * **Code:** 500 Server Error <br />
    **Content:** `{ error : "error" }`

#### Create brewery
#### Get brewery by ID
#### Delete brewery by ID
#### Update brewery by ID
#### Get brewery styles
#### Get brewery beers by style
#### Get beers for specific brewery

### Beers
#### Get all beers
#### Create beer
#### Get beer by ID
#### Update beer by ID
#### Delete beer by ID

### Styles
#### Get all styles
#### Create style
#### Get style by ID
#### Update style by ID
#### Delete style by ID

## Data Storage

### Mongoose js
-

<img src="./assets/mongoosejs.png" alt="s" width="500px"/>

Using [mongoose.js](http://mongoosejs.com/) for schema definitions and MongoDB modeling.

### Redis 
-

<img src="./assets/redis.png" alt="s" width="500px"/>

Using Redis for rate limiting.

### MongoDB 
-

<img src="./assets/mongodb.png" alt="s" width="500px"/> 

Using MongoDB to store all API documents.

## Security
This system will implement JWT-based authentication and potentially include rate-limiting access based on user-specific API keys.

