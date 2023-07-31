const express = require('express');
const router = express.Router();
const {login, signup} = require('../controllers/Auth'); 
const {auth, isStudent, isAdmin} = require('../middlewares/auth');
const User = require('../models/User');

router.post('/login', login);
router.post('/signup', signup);

//testing route
router.get("/test", auth, (req, res)=> {
    res.json({
        success: true,
        message: "Welcome to protected route for TESTS"
    });
})

// protected routes
router.get("/student", auth, isStudent, (req, res)=>{
    res.json({
        success: true,
        message: "Welcome to student protected route"
    })
})

router.get("/admin", auth, isAdmin, (req, res)=> {
    res.json({
        success: true,
        message: "Welcom to Admin protected route"
    });
})

router.get("/getEmail", auth, async(req, res)=> {
    try {
        const id = req.user.id;
        console.log("ID: ", id);
        const user = await User.findById(id);
        
        return res.status(200).json({
            success: true,
            user: user, 
            message: "Welcome to getEmail protected route"
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            error: err.message,
            message: "Error while fetching user id"
        });
    }
});


module.exports = router;