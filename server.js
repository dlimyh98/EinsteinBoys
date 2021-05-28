// Do not include in /src, since you don't want it in final project

const express = require('express');
const cors = require('cors');
const app = express();

// Mount CORS as Middleware (has access to req and res, and next middleware function in application's req-res cycle)
// Middleware allows us to define a stack of Actions that we should execute
// Add layers to Middleware (add to the Stack), using .use
// Each layer is a function (specified in the Argument) that has to be executed
app.use(cors());


// First argument specifies on which path, the Middleware function will trigger
// Second argument is the callback function which triggers, when application serves that path
/* Fetch token from browser = GET method
   Submit login form to browser = POST method
   In app.use, Express handles all requests the same. But for production builds, you should specify the methods used for each route.
 */
app.use('/Auth', (req,res) => {
    res.send({                      // Returns the response as HTML text
        token:'test123'             // JSON object (Key-Value pair), JSON is used for transmitting data in Web Apps using JS Syntax
    });
});


// Run the Server on specified Port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API is running on port ${PORT}`))