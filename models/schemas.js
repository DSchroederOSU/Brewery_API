var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    api_key: { type: String, required: true }
});

let Brewery = mongoose.model('Brewery', brewerySchema);
let Beer = mongoose.model('Beer', beerSchema);
let Style = mongoose.model('Style', styleSchema);
let User = mongoose.model('User', userSchema);

module.exports = {Brewery, Beer, Style, User};