const beerSchema = {
    name: { required: true },
    description: { required: true },
    created_on: { required: false },
    Brewery: { required: true },
    Style: { required: true },
};

module.exports = beerSchema; 