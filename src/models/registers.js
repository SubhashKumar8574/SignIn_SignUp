const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// Here now we genarate Token

employeeSchema.methods.generateAuthToken = async function () {
    try {

        const token = jwt.sign({ _id: this._id.toString() }, "mynameisSubhashKumarfromIndia");
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        console.log("The Token number is:", token);
    } catch (error) {
        res.send("The error part" + error);
        console.log("The error part" + error);
    }
}


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