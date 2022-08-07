import connection from "../dbStrategy/database.js";

export async function getUser(req, res){
    
    try {

        const userId = res.locals.userId;

        const { rows: userData } = await connection.query(
            `SELECT users.id, users.name, SUM(urls."visitCount") AS "visitCount"
            FROM users
            JOIN urls on users.id= urls."userId"
            WHERE users.id= $1
            GROUP BY users.id`,
            [userId]
        );

        if(userData.length === 0){
            return res.status(404).send("User not found");
        }

        const { rows: shortenedUrls } = await connection.query(
            `SELECT id, "shortUrl", url, "visitCount"
            FROM urls
            WHERE "userId"= $1`,
            [userId]
        );

        const [ user ] = userData;
        const { id, name, visitCount } = user;
        const returnData = {id, name, visitCount, shortenedUrls};

        res.status(200).send(returnData);

    } catch {

        res.sendStatus(500);

    }
}