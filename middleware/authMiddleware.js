const jwt= require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    
    const token =req.header("Authorization");

  
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied!" });
    }

    try {
       
        const actualToken=token.replace("Bearer ", "");

       
        const decoded= jwt.verify(actualToken, "CampusStaySecretKey");
        
      
        req.user = decoded;
        next();

    } catch (error) {
        
        res.status(401).json({ message: "Token is not valid!" });
    }
};

module.exports = authMiddleware;