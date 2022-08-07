import jwt from "jsonwebtoken";

export default async function tokenValidation(req, res, next){

    try {

        const token = req.headers.authorization?.replace("Bearer ","").trim();

        if(!token){
            return res.status(401).send("Token is required");
        }

        jwt.verify(token, process.env.JWT_SECRET, (error, validToken) => {
            if(error){
                return res.status(401).send("invalid token");
            }
            res.locals.userId = validToken;
            next()
        });

    } catch(error){

        return res.status(500);

    }
    
}