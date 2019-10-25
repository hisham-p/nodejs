const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');



//mongoose connection to db
mongoose.connect('mongodb://localhost/mongo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB Connected'));
let db = mongoose.connection;
db.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
});



//setting up schema
let Schema = new mongoose.Schema({
    name: String
});



//model created
let dbdata = mongoose.model('news', Schema);



//middlewares
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



//adding a value
app.post("/post", async (req, res) => {
    let value = {
        name: req.body.input
    }
    await dbdata.create(value, function (error) {
        console.log("Value inserted");
        if (error) {
            console.error(error);
        }
    });
    res.redirect("/");
})



//removing a value
app.post("/remove/:id", async (req, res) => {
    let id = req.params.id;
    console.log("Value deleted");
    dbdata.deleteOne({
        _id: id
    }, function (err) {
        if (err) return handleError(err);
    });
})



//updating a value
app.post("/update/:id/:oldvalue/:value", async (req, res) => {
    // console.log("value updated")
    let id = req.params.id;
    let oldvalue = req.params.oldvalue;
    let value = req.params.value;
    await dbdata.updateOne({
        name: oldvalue
    }, {
        name: value
    }, function (error) {
        console.log("Value updated");
        if (error) {
            console.error(error);
        }
    });
})




//get request
app.get("/", async (req, res) => {
    let value = await dbdata.find({}, {
        name: 1
    });
    res.render("index", {
        task: value
    });
})




//port
const port = 5000;
app.listen(port, () => console.log("app listening at port " + port + ""));