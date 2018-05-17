const brewerySchema = {
    name: { required: true },
    website: { required: false },
    facebook_url: { required: false },
    twitter_url: { required: false },
    phone: { required: false },
    address: { required: true },
    city: { required: true },
    state: { required: true },
    zip: { required: true }
};

module.exports = brewerySchema;