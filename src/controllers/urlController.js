import { nanoid } from 'nanoid'
import connection from "../dbStrategy/database.js";
import { postUrlSchema } from '../schemas/urlSchema.js';

export async function shortenURL(req, res){

    try {
        const { url } = req.body;
        const userId = res.locals.userId;
        const shortURL = nanoid(10);

        const validURL = postUrlSchema.validate(req.body);

        if(validURL.error){
            return res.status(422).send("Invalid URL");
        }

        await connection.query(
            `INSERT INTO urls ("shortUrl", url, "userId")
            VALUES ($1, $2, $3)`,
            [shortURL, url, userId]
        );
        
        res.status(201).send(shortURL);
    } catch {
        res.sendStatus(500);
    }

}

export async function getURL(req, res){

}

export async function openURL(req, res){

}

export async function deleteURL(req, res){
    
}