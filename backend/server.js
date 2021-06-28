// Setting up a BACKEND server using Express, handles connection between DATABASE and FRONTEND
// Axios captures data from Frontend, sends to localhost:4000/...., whereby it is processed by Backend (right here!), and sent back to Frontend
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const User = require('./user');                // representation of mongoDB data

// Connecting to mongoDB
mongoose.connect("mongodb+srv://Damien:EinsteinBoys@einsteinboys.m7bvh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser : true,
    useUnifiedTopology : true
    }, () => {
    console.log("Mongoose is connected")
    }
)

// ----------------------------------------------- MIDDLEWARE ------------------------------------------------------------ //
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({                       // CORS allows a server to indicate any other origins than it's own, from which it will allow loading of resources
    origin : "http://localhost:3000",   // Whatever the React app is using
    credentials : true
}))
app.use(session({     // Start a session (place to store data that you want to access, between requests)
    secret:"secretcode",      // Session is signed with this to prevent tampering. Whatever used here, must be used in cookie parser
    resave : true,            // Forces session to be saved back to store, even if session is not modified during request
    saveUninitialized : true, // Forces session that is uninitialised (new but not modified) to be saved to store
}))
app.use(cookieParser("secretcode"))      // Parses cookies attached to the client request object

// Middleware to initialize Passport
app.use(passport.initialize());
app.use(passport.session());
// First pair of braces is to include
// Second pair of braces is to run it with input
require('./passportConfig')(passport);        // Pass in the SAME instance of passport throughout ENTIRE application!
// ----------------------------------------------- END OF MIDDLEWARE ------------------------------------------------------------ //


// ----------------------------------------------- ROUTES ------------------------------------------------------------ //
/* app.METHOD( ROUTE, FUNCTION(req,res) => { CALLBACK FUNCTION } )
   - Application 'listens' for any requests to specified PATH and HTTP METHOD
   - when match, it triggers CALLBACK FUNCTION
 */

// Backend server located at localhost:4000, but nothing will be seen there since I have not implemented response back to Frontend

// Login Route (authenticate User using passport)
app.post("/login", (req,res,next) => {
    passport.authenticate("local", (error,user,info) => {    // "local" string will run the Local Strategy we defined in passportConfig.js
        // By placing passport.authenticate inside Route, we have access to HTTP req and res! Which we can pass to passport strategy
        if (error) throw error;
        if (!user) res.send("Invalid Username/Password")
        else {
            // Attempt to establish a Login session, if User EXISTS (but hasn't been AUTHENTICATED yet!)
            req.logIn(user, (error) => {
                if (error) throw error
                res.send('Successfuly Authenticated!');
            })
        }
    })
    // Small speedup, just go to NEXT route in STACK (Order matters!), with exactly 3 parameters
    (req,res,next);
})

// Register Route (saves first time users into mongoDB, with encryption)
app.post("/register", (req, res, next) => {
    User.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) throw err;
        if (doc) res.send("Username Already Taken");
        if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);   // MUST await, because hashing takes time
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
            });
            await newUser.save();
            res.send("User Registered!");
        }
    });
});

// Once authenticated, User is stored in req.user (The req object you receive fromt FRONTEND, now has user object inside as well as Session data)
// This req object can be used anytime, anywhere in the application
app.get("/user", async (req,res, next) => {
    await res.send(req.user)
})


// Route to FETCH tasks
app.get("/tasks", async (req,res) => {
    if (req.user) {
        User.findOne({_id: req.user.id}, async (err, doc) => {
            if (err) throw err;
            await res.send(doc)
        })
    }
})

// Route to ADD tasks (POST)
app.post("/tasks", (req,res) => {
    User.findOne( {_id : req.user.id}, async(err,doc) => {    // Search by current person logged in
        if (err) throw err;
        doc.task.push(req.body)
        await doc.save()
    })
    res.send(req.user.id)
})

// Route to DELETE task
app.delete("/tasks", (req, res) => {
    User.findByIdAndUpdate(req.user.id, {$pull: {"task": {text: req.body.text, day: req.body.day}}}, {
            safe: true,
            upsert: true
        },
        function (err, doc) {
            if (err) throw err
            else {
                console.log("Task Deleted")
                res.send(doc)
            }
        })
})

// Route to UPDATE task (PUT)
app.put("/tasks", (req, res) => {
    User.updateOne({_id: req.user.id}, {$set: {task: req.body}}, {
            safe: true,
            upsert: true
        },
        function (err, doc) {
            if (err) throw err
            else {
                console.log("Task Updated")
                res.send(doc)
            }
        })
})

// ------------------------------------------END OF ROUTES ------------------------------------------------------------ //

// Backend server will using PORT specified below
const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server running on ${PORT}`));
