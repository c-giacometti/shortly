import { Router } from "express";
import { deleteURL, getURL, openURL, shortenURL } from "../controllers/urlController.js";

const router = Router();

router.post("/urls/shorten", shortenURL);
router.get("/urls/:id", getURL);
router.get("/urls/open/:shortUrl", openURL);
router.delete("/urls/:id", deleteURL);

export default router;