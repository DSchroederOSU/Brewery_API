# Table of Contents 

<!--ts-->
   * [API Description](#api-description)
   * [Team Members](#team-members)
   * [Nouns](#nouns)
   * [API Endpoints](#api-endpoints)
      * [GET Breweries](#get-breweries) 
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

## Nouns:

Beers, Breweries, Beer_Types (Lager, IPA, Hazy)

## API Endpoints

### GET Breweries

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

### POST /breweries
### GET /breweries/:breweryID
### DELETE /breweries/:breweryID
### PUT /breweries/:breweryID
### GET /breweries/:breweryID/styles
### GET /breweries/:breweryID/styles/:styleID
### GET /breweries//:breweryID/beers

## Data Storage

This is a pre-mature mock up of what I expect my data to look like. (Subject to change).

```SQL
CREATE TABLE beer(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
beer_name VARCHAR(255) NOT NULL,
description TEXT,
in_stores BOOLEAN NOT NULL,
ibu INT NOT NULL,
CONSTRAINT ibu_check CHECK (ibu BETWEEN 1 AND 100),
abv DECIMAL(4,3) NOT NULL, /* we want alcohol percentage 0.001 - 0.99 */
created_at DATE NOT NULL,
FOREIGN KEY (brewery_id_fk) REFERENCES brewery(id),
FOREIGN KEY (style_id_fk) REFERENCES style(id)
);
```

```SQL
CREATE TABLE brewery(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
brewery_name VARCHAR(255) NOT NULL,
/*optional contact */
website VARCHAR(255),
facebook_url VARCHAR(255),
twitter_url VARCHAR(255),

/* location details */
address VARCHAR(255) NOT NULL,
city VARCHAR(255) NOT NULL,
state VARCHAR(255) NOT NULL,
);
```

```SQL
CREATE TABLE style(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
style_name VARCHAR(255) NOT NULL,
);
```

Schema Definitions for Request Body Validations
```JavaScript
const beerSchema = {
    beer_name: { required: true },
    description: { required: true },
    created_on: { required: true },
    Brewery: { required: true },
    Style: { required: true },
};
```
```JavaScript
const brewerySchema = {
    brewery_name: { required: true },
    website: { required: false },
    facebook_url: { required: false },
    twitter_url: { required: false },
    address: { required: true },
    city: { required: true },
    state: { required: true }
};
```
```JavaScript
const styleSchema = {
    style_name: { required: true }
};
```
## Security
This system will implement JWT-based authentication and potentially include rate-limiting access based on user-specific API keys.


