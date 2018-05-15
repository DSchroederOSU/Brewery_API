const beerSchema = {
    beer_name: { required: true },
    description: { required: true },
    created_on: { required: true },
    Brewery: { required: true },
    Style: { required: true },
};

module.exports = beerSchema; 