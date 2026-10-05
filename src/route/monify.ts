import {Router} from "express";
import {createReservedAccountController} from "../controler/monify.js";
import {requireAuth} from "../middleware/auth.js";

const route = Router(); 

route.post("/reserved-account", requireAuth, createReservedAccountController);

export default route;