var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const brewerySchema = mongoose.Schema({
    name: String,
    website: String,
    facebook_url: String,
    twitter_url: String,
    phone: String,
    address: String,
    city: String,
    state:  String,
    zip: Number,
    beers : [{ type: Schema.Types.ObjectId, ref: 'Beer' }],
});

const styleSchema = mongoose.Schema({
    name: String
});

const beerSchema = mongoose.Schema({
    name: String,
    description: String,
    created_on: Date,
    in_stores:   Boolean,
    ibu: Number,
    abv: Number,
    brewery: { type: Schema.Types.ObjectId, ref: 'Brewery' },
    style: { type: Schema.Types.ObjectId, ref: 'Style' },
});

let Brewery = mongoose.model('Brewery', brewerySchema);
let Beer = mongoose.model('Beer', beerSchema);
let Style = mongoose.model('Style', styleSchema);

module.exports = {Brewery, Beer, Style};