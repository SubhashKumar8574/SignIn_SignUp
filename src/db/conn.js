const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ytRegistration")
    .then(() => {
        console.log("Connection successfully");
    }).catch((e) => {
        console.log("No connection");
    });