const express = require("express");
const hbs = require("hbs");
const path = require('path');
const bcrypt = require("bcryptjs");

const app = express();
require('./db/conn');
const Register = require("./models/registers");


const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', 'src/templates/views');
app.set("view engine", "hbs");

hbs.registerPartials("src/templates/partials");

app.get("/", (req, res) => {
    res.render("index");

});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

// Create a new user in our Database
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cPassword = req.body.confirmPassword;
        if (password === cPassword) {
            const registerEmployee = Register({
                name: req.body.name,
                email: req.body.email,
                password: password,
                confirmPassword: cPassword
            })
            console.log("The success part:", registerEmployee);

            //  Here we call for token  generating which will generate in register.js
            const token = await registerEmployee.generateAuthToken();
            const registered = await registerEmployee.save();
            res.status(201).render("index");

        } else {
            res.send("Password are not Matched");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});


// Login Check
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, useremail.password);
        console.log("The password is", isMatch);
        const token = await useremail.generateAuthToken();
        console.log("The token part:", token);
        if (isMatch) {
            res.status(201).render("index");
            console.log("VAlid Login");
        } else {
            res.send("invalid Login Details");
        }

    } catch (error) {
        res.status(400).send("invalid Login Details");
    }
});


app.listen(port, () => {
    console.log(`server is running at port no. ${port}`);
});