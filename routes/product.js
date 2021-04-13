const router = require("express").Router();
const ProductController = require("../controllers/ProductController");
const { authentication, authorizationAdmin } = require("../middlewares/auth");

router.use(authentication);
router.get("/", ProductController.getProduct);
router.post("/", ProductController.postProduct);

router.use("/:id", authorizationAdmin);
router.get("/:id", ProductController.getProductById);
router.put("/:id", ProductController.putProductById);
router.delete("/:id", ProductController.deleteProductById);

module.exports = router;
