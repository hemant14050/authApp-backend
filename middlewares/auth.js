// auth, isStudent, isAdmin
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        //token extract jwt token from body of req
        //many other ways for token
        const token = req.body.token || req.cookies.token || req.headers("Authorization").replace("Bearer ", "");
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            })
        }
        
        //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
        } catch(err) {
            return res.status(401).json({
                success: false,
                message: "Token invalid"
            })
        }
        next();
    } catch(err) {
        return res.status(401).json({
            success: false,
            message: "Something wents wrong while verifing token"
        })
    }
}

exports.isStudent = (req, res,next)=> {
    try{
        if(req.user.role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for student"
            });
        }
        next();
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "User role is not matching"
        });
    }
}

exports.isAdmin = (req, res, next)=> {
    try{
        if(req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for admin"
            });
        }
        next();
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "User role is not matching"
        });
    }
}