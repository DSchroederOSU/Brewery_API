const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brewerySchema = new Schema({
    name:  String,
    website: String,
    facebook_url:   String,
    twitter_url: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    beers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Beer'
    }]

});

//module.exports = mongoose.model('Brewery', brewerySchema);

