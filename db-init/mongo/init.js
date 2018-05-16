db.createUser({
    user: 'breweryUser',
    pwd: 'breweryPassword',
    roles: [
        {
            role: 'readWrite',
            db: 'breweryAPI'
        }
    ]
});

/*
CREATE TABLE breweries(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    brewery_name VARCHAR(255) NOT NULL,
    /*optional contact
    website VARCHAR(255),
    facebook_url VARCHAR(255),
    twitter_url VARCHAR(255),

    /* location details
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
);
*/
db.breweries.insert({
    name : "Sky High Brewing",
    website: "http://skyhighbrewing.com/",
    facebook_url : "https://www.facebook.com/SkyHighBrewing/",
    twitter_url: "https://twitter.com/SkyHighBrewing",
    address: "160 NW Jackson Ave",
    city: "Corvallis",
    state : "OR"
});
/*
CREATE TABLE styles(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
style_name VARCHAR(255) NOT NULL,
);
 */
db.styles.insert({
    name: "IPA"
});

/*
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
beer_name VARCHAR(255) NOT NULL,
description TEXT,
in_stores BOOLEAN NOT NULL,
ibu INT NOT NULL,
CONSTRAINT ibu_check CHECK (ibu BETWEEN 1 AND 100),
abv DECIMAL(4,3) NOT NULL, /* we want alcohol percentage 0.001 - 0.99
created_at DATE NOT NULL,
    FOREIGN KEY (brewery_id_fk) REFERENCES brewery(id),
    FOREIGN KEY (style_id_fk) REFERENCES style(id)
 */
db.beers.insert({
    name: "Freewheel IPA",
    Description: "For you Freewheeling PNW Hop Heads out there,\n" +
    "we break out our HopBack for our unique take on\n" +
    "IPA. A cornucopia of hop varieties added in the\n" +
    "boil, at the HopBack and in the fermenter lend\n" +
    "fruity and floral notes to a melodious hoppy brew.",
    "in_stores" : false,
    "ibu" : 77,
    "abv" : 7,
    created_on : new Date(),
    Brewery : "Sky High Brewing",
    Style : "IPA"
});


