import express from "express";
import {getAllUsers, getUser, postUser, deleteUser, updateUser, loginUser} from "../controllers/UsersController.js";

const router = express.Router();

router.get("/",  getAllUsers)
router.get("/:id", getUser)
router.post("/", postUser)
router.delete("/:id", deleteUser)
router.put("/:id", updateUser)
router.post("/login", loginUser)

export default router;