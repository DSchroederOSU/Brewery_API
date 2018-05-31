const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beerSchema = new Schema({
    name:  String,
    description: String,
    in_stores:   String,
    ibu: String,
    abv: String,
    Brewery: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brewery'
    },
    Style: {
        type: mongoose.Schema.ObjectId,
        ref: 'Style'
    }

});

//module.exports = mongoose.model('Beer', beerSchema);

