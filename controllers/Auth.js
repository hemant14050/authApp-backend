const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

//signup controller
exports.signup = async (req, res) => {
    try{
        //get data
        const {name, email, password, role} = req.body; 

        //check if user alredy exists
        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(400).json({
                succes: false,
                message: "User already exists!"
            });
        }

        //secure pass
        let hashedPass;
        try{
            hashedPass = await bcrypt.hash(password, 10);
        }
        catch(err) {
            return res.status(500).json({
                success: false,
                message: "Error while hashing password."
            });
        }

        //create user entry in db
        const user = await User.create({
            name, email, password:hashedPass, role
        });

        return res.status(200).json({
            success: true,
            message: "User created successfully!"
        });

    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Internal server Error."
        });
    }
}

exports.login = async(req, res)=> {
    try{
        //fetch data from request
        const {email, password} = req.body;
        //validation on emai and pass
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Pls fill all the details"
            })
        }
        
        //check registered user
        let user = await User.findOne({email});
        //if not registered
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not registered"
            })
        }


        //define payload
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }

        // verify password
        // console.log("user is: "+user)
        if(await bcrypt.compare(password, user.password)) {
            //password match
            let token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            );
            
            console.log("Before: ", user);

            // const oldUser = {...user, token};
            // oldUser.password = undefined;

            //check alternative for this lines <3
            user = user.toObject();
            user.token = token;
            user.password = undefined;
            console.log("After:", user);

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            //create cookie
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Logged in successfully"
            });

            // res.status(200).json({
            //     success: true,
            //     token,
            //     user,
            //     message: "User Logged in successfully"
            // });

        } else {
            //password do not match
            return res.status(403).json({
                success: false,
                message: "Password do not match"
            })
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }

}