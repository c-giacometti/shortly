import connection from "../dbStrategy/database.js";

export async function getRanking(req, res){
    
    try {
        const { rows: mostPopular } = await connection.query(
            `SELECT users.id, 
            users.name, 
            COUNT(urls."userId") AS "linksCount",
            COALESCE(SUM(urls."visitCount"),0) AS "visitCount"
            FROM users
            LEFT JOIN urls ON users.id= urls."userId"
            GROUP BY users.id
            ORDER BY "visitCount" DESC
            LIMIT 10`
        );
    
        res.status(200).send(mostPopular);
        
    } catch {
        res.sendStatus(500);
    }
    
}