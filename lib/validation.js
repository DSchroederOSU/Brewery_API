module.exports = {
    /*
     * Performs data validation on an object by verifying that it contains
     * all required fields specified in a given schema.
     *
     * Returns true if the object is valid agianst the schema and false otherwise.
     */
    validateAgainstSchema: function (res, obj, schema) {
        if(obj && Object.keys(schema).every(
            field => !schema[field].required || obj[field] )){
            return true;
        }
        else{
            res.status(400).json({error: "Incorrect fields in request body."});
            return false;
        }
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