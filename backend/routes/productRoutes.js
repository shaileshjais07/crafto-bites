import { Router } from "express";
import {
  getCategories, getProducts, getProduct,
  addProduct, updateProduct, deleteProduct
} from "../controllers/productController.js";
import { authRequired, adminRequired } from "../middleware/auth.js";

const router = Router();

router.get("/categories", getCategories);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", authRequired, adminRequired, addProduct);
router.put("/:id", authRequired, adminRequired, updateProduct);
router.delete("/:id", authRequired, adminRequired, deleteProduct);

export default router;
