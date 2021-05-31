const mongoose = require('mongoose');

// Create User Schema
// User Schema (in Mongoose model) allows us to access data from mongoDB in Object Oriented fashion
const user = new mongoose.Schema({
    username : { type : String, default : 'BLANK' },
    password : { type : String, default : 'BLANK' },
    task : [{
        text : { type : String, default : 'BLANK'},
        day : { type : String, default : 'BLANK'},
        reminder : { type : Boolean, default : false}
    }]
});

// Common JS (CJS) format of exporting in JS
/* module.exports syntax
   module is variable that represents current module
   exports is an object that will be exposed as module
   whatever assigned to module.exports, will be exposed to files outside
 */

/* mongoose.model syntax (converts Schema into something we can use)
   1. First argument = singular name of the collection you are looking for
   - Mongoose looks for the plural, lowercase version of the model name in mongoDB

   2. Second argument = reference to the scheme definition
 */
module.exports = mongoose.model("User", user);

/*
    - Mongoose schema defines the structure of the document,default values, .... (Description of Data)
    - Mongoose model provides an INTERFACE to the database, for CRUD (you can have multipled Models having same Schema)

    Steps for creating Mongoose model...
    1. Referencing Mongoose
    2. Defining Schema
    3. Exporting Model
 */