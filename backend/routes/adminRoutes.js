import { Router } from "express";
import { authRequired, adminRequired } from "../middleware/auth.js";
import { getStats, getCustomers } from "../controllers/adminController.js";

const router = Router();

router.get("/stats", authRequired, adminRequired, getStats);
router.get("/customers", authRequired, adminRequired, getCustomers);

export default router;
