const jwt = require('jsonwebtoken');

function authMiddleware (req, res, next) {
     const token = req.headers.token;
     
     const decoded = jwt.verify(token, "organization-super-secret-key");
     const userId = decoded.userId;

     if(userId) {
        req.userId = userId;
        next();
     } else {
        res.status(411).json({
            success: false,
            message: "Token was incorrect"
        })
     }
}

module.exports = {
    authMiddleware
}