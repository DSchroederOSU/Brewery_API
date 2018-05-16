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
    phone: "541-207-3277",
    address: "160 NW Jackson Ave",
    city: "Corvallis",
    state : "OR",
    zip : 97330
});

db.breweries.insert({
    name : "Block 15 Brewing",
    website: "http://block15.com/",
    facebook_url : "https://www.facebook.com/Block15Brewing",
    twitter_url: "https://twitter.com/Block15Brewing",
    phone: "541-758-2077",
    address: "300 SW Jefferson Ave.",
    city: "Corvallis",
    state : "OR",
    zip : 97330
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
db.styles.insert({
    name: "Double IPA"
});
db.styles.insert({
    name: "Red Ale"
});
db.styles.insert({
    name: "Stout"
});
db.styles.insert({
    name: "Pilsner"
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
    description: "For you Freewheeling PNW Hop Heads out there, " +
    "we break out our HopBack for our unique take on " +
    "IPA. A cornucopia of hop varieties added in the " +
    "boil, at the HopBack and in the fermenter lend " +
    "fruity and floral notes to a melodious hoppy brew.",
    in_stores : false,
    ibu : 77,
    abv : 7,
    created_on : new Date(),
    Brewery : "Sky High Brewing",
    Style : "IPA"
});

db.beers.insert({
    name: "Sticky Hands",
    description: "Offering a luscious blend of flavor and drinkability, " +
    "this Hop Experience Ale features ample additions of sticky, lupulin-packed hops, " +
    "grown in the Pacific Northwest. The result is an aromatic blast of citrus, tropical fruit, " +
    "and dank herb that transitions into resinous hop flavor and a delightfully balanced finish.",
    in_stores : true,
    ibu : 110,
    abv : 8.1,
    created_on : new Date(),
    Brewery : "Block 15 Brewing",
    Style : "Double IPA"
});

db.beers.insert({
    name: "Bushwack xxIPA",
    description: "With heaps of Wakatu and Motueka hops straight from Australia, this XXIPA brings wildflower and stone fruit notes to the nose, with bits of peach mango, and citrus flavors. This brew’s medium body and strong bitter backbone balances wonderfully with its fruit flavors as it trails off the tongue. Cheers Mate!!",
    in_stores : false,
    ibu : 82,
    abv : 9.6,
    created_on : new Date(),
    Brewery : "Sky High Brewing",
    Style : "Double IPA"
});

db.beers.insert({
    name: "Russian Imperial Stout",
    description: "We brewed this Russian as a “sequential mash” brew, a double batch with the same water to give it more strength and higher yield. A hearty, easy drinking stout, with a sweet vanilla nose and a warm bear hug of a finish. DA!",
    in_stores : false,
    ibu : 33,
    abv : 10.9,
    created_on : new Date(),
    Brewery : "Sky High Brewing",
    Style : "Stout"
});

db.beers.insert({
    name: "Bohemian Pils",
    description: "Blonde and beautiful, crisp and delicious, bursting with revolution. A traditional Czech formulation brewed with German Pils malt, Czech Saas hops and Urquel yeast. Lagered for 7 weeks and worth the wait. Na zdravi to the great beer from Pilsen.",
    in_stores : false,
    ibu : 30,
    abv : 5.9,
    created_on : new Date(),
    Brewery : "Sky High Brewing",
    Style : "Pilsner"
});
