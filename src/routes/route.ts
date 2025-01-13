import { deleteData, getData, putData } from "#controllers/controller.js";
import express from "express";

const router = express.Router();

router.post("/", getData); //read from prefix
router.post("/", putData); //create data
router.put("/:id", putData); //update data
router.delete("/:id", deleteData); //delete data

export default router;
