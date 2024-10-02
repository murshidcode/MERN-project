const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const UserModel = require("./model/User");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:["http://localhost:3000"],
    credentials:true
}));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Failed to connect to MongoDB", err));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }); // Use findOne
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
              const accessToken = jwt.sign({email: email},
                "jwt-access-token-secret-key",{expiresIn:"1m"})
              const refreshToken = jwt.sign({email: email},
                    "jwt-refresh-token-secret-key",{expiresIn:"5m"})

             res.cookie('accessToken', accessToken, {maxAge:60000})

             res.cookie('refreshToken',refreshToken,
                {maxAge: 300000, httpOnly:true, secure:true, sameSite:'strict'})
                res.json("Success");
            } else {
                res.status(401).json("Password does not match!");
            }
        } else {
            res.status(401).json("No records found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // Fixed spelling
    }
});
 

const varifyUser = (req, res, next) => {
    const accesstoken = req.cookies.accessToken;
    if(!accesstoken){
        if(renewToken(req, res)){
            next()
        }
    } else {
        jwt.verify(accesstoken, 'jwt-access-token-secret-key', (err, decoded) => {
            if(err) {
                return res.json({valid: false, message: "Invalid Token"})
            } else {
                req.email = decoded.email
                next()
            }
        })
    }
}


const renewToken = (req, res) => {
    const refreshtoken = req.cookies.refreshToken;
    let exist = false;
    if(!refreshtoken){
        return res.json({valid: false, message: "No Refresh token"})
    } else {
        jwt.verify(refreshtoken, 'jwt-refresh-token-secret-key', (err, decoded) => {
            if(err) {
                return res.json({valid: false, message: "Invalid Refresh Token"})
            } else {
                const accessToken = jwt.sign({email: decoded.email},
                    "jwt-access-token-secret-key",{expiresIn:"1m"})
                 res.cookie('accessToken', accessToken, {maxAge:60000})
                 exist = true;
            }
        })
    }
    return exist;
}


app.get('/table',varifyUser,(req, res) => {
    return res.json({valid: true, message: "authorized"})
})
 
