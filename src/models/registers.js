const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

// Schema define here.
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true

    },
    confirmPassword: {
        type: String,
        required: true
    }
});


// This concept is called Middelware    --->    A web server is middleware that connects websites to the backend database.
// Here we converted password in Hash.
employeeSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        console.log(`The current password is ${this.password}`);
        console.log(`The current confirmpassword is ${this.confirmPassword}`);
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = await bcrypt.hash(this.password, 10);
       
        console.log(`The current password is ${this.password}`);
        console.log(`The current confirmpassword is ${this.confirmPassword}`);
    }
    next();
});

// Now we need to create a collection
const Register = new mongoose.model("Register", employeeSchema);
module.exports = Register;
