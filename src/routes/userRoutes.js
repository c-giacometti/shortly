import { Router } from "express";
import { getUser } from "../controllers/userController.js";
import tokenValidation from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/users/me", tokenValidation, getUser);

export default router;