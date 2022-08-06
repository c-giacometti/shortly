import bcrypt from "bcrypt";
import connection from "../dbStrategy/database.js";
import { signUpSchema, signInSchema } from "../schemas/authSchema.js";

export async function signIn(req, res){

    const userData = req.body;

    const validUser = signInSchema.validate(userData);

    if(validUser.error){
        return res.status(422).send("Complete all fields");
    }

    const { email, password } = userData;

    const { rows: checkUser } = await connection.query(
        `SELECT * FROM users
        WHERE email= $1`,
        [email]
    );

    if(checkUser.length === 0){
        return res.status(401).send("Incorrect user or password");
    }

    const [ user ] = checkUser;

    const validPassword = bcrypt.compareSync(password,user.password);

    if(!validPassword){
        return res.status(401).send("Incorrect user or password");
    }

    const token = "123";

    res.status(200).send(token);

}

export async function signUp(req, res){

    const newUser = req.body;

    const validNewUser = signUpSchema.validate(newUser);

    if(validNewUser.error){
        const error = validNewUser.error.details[0].message;
        return res.status(422).send(error);
    }

    const { name, email, password, confirmPassword } = newUser;

    if(password !== confirmPassword){
        return res.status(422).send("Confirme a senha corretamente");
    }

    const emailExists = await connection.query(
        `SELECT * FROM users
        WHERE email= $1`,
        [email]
    );

    if(emailExists.rowCount > 0){
        return res.status(409).send("This e-mail address is already registered")
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await connection.query(
        `INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)`,
        [name, email, passwordHash]
    );

    res.sendStatus(201);

}