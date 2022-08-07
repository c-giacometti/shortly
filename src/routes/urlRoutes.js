import { Router } from "express";
import { deleteURL, getURL, openURL, shortenURL } from "../controllers/urlController.js";
import tokenValidation from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/urls/shorten", tokenValidation, shortenURL);
router.get("/urls/:id", getURL);
router.get("/urls/open/:shortUrl", openURL);
router.delete("/urls/:id", tokenValidation, deleteURL);

export default router;