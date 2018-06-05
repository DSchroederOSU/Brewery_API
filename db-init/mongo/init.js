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


