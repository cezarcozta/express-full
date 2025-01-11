import { getData, putData } from "#controllers/controller.js";
import express from "express";

const router = express.Router();

router.post("/", getData);
router.put("/", putData);

export default router;
