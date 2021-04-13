const router = require("express").Router();
const ProductRouter = require("./product");
const UserRouter = require("./user");

router.use("/", UserRouter);
router.use("/products", ProductRouter);

module.exports = router;
