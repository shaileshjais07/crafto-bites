import { Router } from "express";
import { authRequired, adminRequired } from "../middleware/auth.js";
import {
  createOrder, getMyOrders, getAllOrders, updateOrderStatus
} from "../controllers/orderController.js";

const router = Router();

router.post("/", createOrder);
router.get("/mine", authRequired, getMyOrders);
router.get("/", authRequired, adminRequired, getAllOrders);
router.patch("/:id/status", authRequired, adminRequired, updateOrderStatus);

export default router;
