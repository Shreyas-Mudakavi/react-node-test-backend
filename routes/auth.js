import express from "express";

import { getStatus, login, register } from "./../controller/auth.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/home", getStatus);

export default router;
