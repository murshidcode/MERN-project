const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const UserModel = require("./model/User");
const EmployeeModel = require("./model/Employee")


dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:["http://localhost:3000"],
    credentials:true
}));
app.use(session({
    secret: 'your-session-secret-key',
    resave: false,
    saveUninitialized:true,
    cookie:{secure:false}
}))


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
        const user = await UserModel.findOne({ email }); 
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
        res.status(500).json({ error: error.message }); 
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




app.post('/employee', varifyUser, async (req, res) => {
    try {
        const { name, position, contact } = req.body; 
        const newEmployee = new EmployeeModel({
            name,
            position,
            contact,
            email: req.email 
        });
        const savedEmployee = await newEmployee.save(); 
        res.status(201).json(savedEmployee); 
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
});


app.get('/employee', varifyUser, async (req, res) => {
    try {
        const employees = await EmployeeModel.find({ email: req.email }); 
        res.status(200).json(employees); 
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
});




app.put('/employee/:id', varifyUser, async (req, res) => {
    const { id } = req.params; 
    const { name, position, contact } = req.body; 
    try {
        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
            id,
            { name, position, contact },
            { new: true } 
        );

        if (!updatedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.status(200).json(updatedEmployee); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





app.delete('/employee/:id', varifyUser, async (req, res)=> {
    const { id } = req.params;

    try {
        await EmployeeModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Employee daleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})



app.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out successfully' });
  });
  
  
 
