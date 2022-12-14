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
        
        const returnObject = {
            shortUrl: shortURL
        }

        res.status(201).send(returnObject);
        
    } catch {
        res.sendStatus(500);
    }

}

export async function getURL(req, res){

    try {

        const shortId = req.params.id;

        const { rows: urlData } = await connection.query(
            `SELECT id, "shortUrl", url
            FROM urls
            WHERE urls.id = $1`,
            [shortId]
        );

        if(urlData.length === 0){
            return res.status(404).send("This URL does not exist");
        }

        const [ returnData ] = urlData;

        res.status(200).send(returnData);

    } catch {
        res.sendStatus(500);
    }
}

export async function openURL(req, res){

    try {

        const { shortUrl } = req.params;

        const { rows: urlData } = await connection.query(
            `SELECT url 
            FROM urls
            WHERE "shortUrl" = $1`,
            [shortUrl]
        );

        if(urlData.length === 0){
            return res.status(404).send("This URL does not exist");
        }

        await connection.query(
            `UPDATE urls
            SET "visitCount"= "visitCount" + 1
            WHERE "shortUrl" = $1`,
            [shortUrl]
        );

        const url = urlData[0].url;

        res.redirect(url);

    } catch {
        res.sendStatus(500);
    }

}

export async function deleteURL(req, res){

    try {

        const urlId = req.params.id;
        const userId = res.locals.userId;

        const { rows: confirmUser } = await connection.query(
            `SELECT * FROM urls
            WHERE id = $1`,
            [urlId]
        );

        if(confirmUser.length === 0){
            return res.status(404).send("URL not found");
        }

        if(confirmUser[0].userId != userId){
            return res.sendStatus(401);
        }

        await connection.query(
            `DELETE FROM urls
            WHERE id = $1`,
            [urlId]
        );

        res.sendStatus(204);

    } catch {
        res.sendStatus(500);
    }

}