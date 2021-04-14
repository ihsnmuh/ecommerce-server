const router = require("express").Router();
const ProductRouter = require("./product");
const UserRouter = require("./user");
const CartRouter = require("./cart");

router.use("/", UserRouter);
router.use("/products", ProductRouter);
router.use("/carts", CartRouter);

module.exports = router;
