# Table of Contents 

<!--ts-->
  * [API Description](#api-description)
  * [Team Members](#team-members)
  * [Nouns](#nouns)
  * [API Endpoints](#api-endpoints)
    * [BREWERIES](#breweries)
      * [Get all breweries](#get-all-breweries) 
      * [Create new brewery](#create-brewery)
      * [Get brewery by ID](#get-brewery-by-id) 
      * [Update brewery by ID](#update-brewery-by-id)
      * [Delete brewery by ID](#delete-brewery-by-id)      
      * [Get brewery styles](#get-brewery-styles) 
      * [Get brewery beers by style](#get-brewery-beers-by-style)     
      * [Get beers for specific brewery](#get-beers-for-specific-brewery) 
    * [BEERS](#breweries)
      * [Get all beers](#get-all-beers) 
      * [Create new beer](#create-beer)
      * [Get beer by ID](#get-beer-by-id) 
      * [Update beer by ID](#update-beer-by-id)
      * [Delete beer by ID](#delete-beer-by-id)
    * [STYLES](#breweries)
      * [Get all styles](#get-all-styles) 
      * [Create new style](#create-style)
      * [Get style by ID](#get-style-by-id) 
      * [Update style by ID](#update-style-by-id)
      * [Delete style by ID](#delete-style-by-id)                   
  * [Data Storage](#data-storage)
  * [Security](#security)
<!--te--> 

This repository should run out of the box if your machine has Docker installed.

```docker-compose up```

Will spin up the database containers and the api container and effectively create a fully functioning API.

## API Description

This API will act as service for information related to beers and breweries. Specifically, what breweries are “currently” serving what beer, and what that beer is like. Beer data fields can be as broad as beer name and type or go as explicit as the IBU and alcohol content.

## Team Members

Daniel Schroeder <schrodan@oregonstate.edu>

## Nouns

Beers, Breweries, Style (Lager, IPA, Hazy)

## API Endpoints
### Breweries
#### Get all breweries

   A collection of all breweries in the database.
 
* **URL**

  /breweries

* **Method:** 

  `GET` 
  
*  **URL Params**

   `None`
   
   **Required:**
 
   `None`

   **Optional:**
   
   An optional search query that will run as a $Regex expression on the "name" field
   
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

  <_Most endpoints will have many ways they can fail. From unauthorized access, to wrongful parameters etc. All of those should be liste d here. It might seem repetitive, but it helps prevent assumptions from being made where they should be._>

  * **Code:** 500 Server Error <br />
    **Content:** `{ error : error" }`

* **Notes:**

  <_This is where all uncertainties, commentary, discussion etc. can go. I recommend timestamping and identifying oneself when leaving comments here._> 
 

#### Create brewery
#### Get brewery by ID
#### Delete brewery by ID
#### Update brewery by ID
#### Get brewery styles
#### Get brewery beers by style
#### Get beers for specific brewery

#### Get all beers
#### Create beer
#### Get beer by ID
#### Update beer by ID
#### Delete beer by ID

#### Get all styles
#### Create style
#### Get style by ID
#### Update style by ID
#### Delete style by ID

## Data Storage

Using [mongoose.js](http://mongoosejs.com/) for schema definitions and MongoDB modeling.

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

const styleSchema = mongoose.Schema({
    name: { type: String, required: true }
});

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

## Security
This system will implement JWT-based authentication and potentially include rate-limiting access based on user-specific API keys.


