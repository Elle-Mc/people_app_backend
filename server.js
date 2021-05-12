///////////////////////////////
// DEPENDENCIES - have to be imported first
////////////////////////////////
// get .env variables (always the first thing you want to do)
require("dotenv").config();
// pull PORT from .env, give default value of 3000 (here we're object desctructuring - pulling out port from this process.env). creating a new variable called port. we're defaulting the value to 3000.
const { PORT = 3000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object (app object is keepig track of all our routes)
const app = express();
// import mongoose
const mongoose = require("mongoose")
// IMPORT MIDDLEWARE
// bring in cors
const cors = require("cors")
const morgan = require("morgan")


///////////////////////////////
// Database connection
////////////////////////////////
// ESTABLISH CONNECTION: if you start the server without doing the unified topo and new url, it will tell you to do it (this is the line that starts the process of connecting to mongo)
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// CONNECTION EVENTS: 
mongoose.connection
.on("open", () => console.log("You're connected to Mongo"))
.on("close", () => console.log("You're disconnected from Mongo"))
.on("error", (error) => console.log(error))

///////////////////////////////
// MODELS - don't want to use models until you're connected to your database
////////////////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String, 
    image: String, 
    title: String
})

const People = mongoose.model("People", PeopleSchema)

///////////////////////////////
// MIDDLEWARE - should go before routes (most important order)
////////////////////////////////
app.use(cors())
app.use(morgan("dev"))
// this looks at the request as it comes in and if it says "content type json - oh it's a json data let me parse that for req.body"
app.use(express.json())

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route - you do this to test so you're making sure you're not building a whole app only for it to not work
app.get("/", (req, res) => {
  res.send("hi world");
});

// PEOPLE INDEX ROUTE - Displays all people
// This is saying try my code and if it's wrong (catch) let me know what the error is
app.get("/people", async (req, res) => {
    try {
        res.json(await People.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// People create route
app.post("/people", async (req, res) => {
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

// People update route
app.put("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})



///////////////////////////////
// LISTENER
////////////////////////////////
// we're saying hey the server should listen on whatever port and then console.log listening on whatever port we're telling it to.
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));