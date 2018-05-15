const brewerySchema = {
    brewery_name: { required: true },
    website: { required: false },
    facebook_url: { required: false },
    twitter_url: { required: false },
    address: { required: true },
    city: { required: true },
    state: { required: true }
};

module.exports = brewerySchema;