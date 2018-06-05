const breweryHelper = require('./utils/breweryHelper');

module.exports = {

    /*
     * Performs data validation on an object by verifying that it contains
     * all required fields specified in a given schema.
     *
     * Returns true if the object is valid agianst the schema and false otherwise.
     */

    validateAgainstSchema: function (req, res, next) {
        let obj = req.body;
        let schema = req.schema;
        if (!obj) {
            return res.status(400).json({error: "Request needs a body."})
        } else {
            checkSchema(obj, schema)
                .then(()=>{
                    return checkExtra(obj, schema);
                })
                .then(()=>{
                    return next();
                })
                .catch((err)=>{
                    res.status(err.status).json({error: err.error})
                });
        }
    },

    /*
     * Used for beer creation. Validate that the specified Brewery exists
     */
    validateBrewery: function (req, res, next) {
        breweryHelper.getDocumentByID(req, req.body.Brewery)
            .then((brewery)=>{
                // if null, the brewery does not exist
                if(!brewery){
                    res.status(400).json({error: "The brewery specified does not exist."})
                } else {
                    req.brewery = brewery;
                    return next();
                }
            })
            .catch((err)=>{
                res.status(500).json({error: err})
            })
    },

    /*
     * Extracts all fields from an object that are valid according to a specified
     * schema.  Extracted fields can be either required or optional.
     *
     * Returns a new object containing all valid fields extracted from the
     * original object.
     */
    extractValidFields: function (obj, schema) {
        let validObj = {};
        Object.keys(schema).forEach((field) => {
            if (obj[field]) {
                validObj[field] = obj[field];
            }
        });
        return validObj;
    }
};

function checkSchema(object, schema){
    return new Promise( function (resolve, reject) {
        let success = true;
        Object.keys(schema).forEach(field => {
            // if the fields is a required field
            if (schema[field].required) {
                // if the obj does not contain the required field, reject
                if (!object[field]) {
                    success = false;
                    return reject({status: 400, error: `(${field}) field is required in the request body.`});
                }
            }
        });
        if(success){
            return resolve();
        }
    })
}

function checkExtra(object, schema){
    return new Promise( function (resolve, reject) {
        let success = true;
        Object.keys(object).forEach(field => {
                if(!schema[field]){
                    success = false;
                    return reject({status: 400, error:`Field: (${field}) does not match any field in the schema.`});
                }
            }
        );
        if(success){
            return resolve();
        }
    })
}