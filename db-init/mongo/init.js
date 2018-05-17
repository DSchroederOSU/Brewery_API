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
    zip : 97330,
    beers: []
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
    zip : 97330,
    beers: []
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


