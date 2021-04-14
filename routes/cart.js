const router = require("express").Router();
const CartController = require("../controllers/CartController");
const {
  authentication,
  authorizationCustomer,
  authorizationCart,
} = require("../middlewares/auth");

router.use(authentication);
router.get("/", CartController.showCart);
router.post("/:ProductId", CartController.postCart);

router.use("/:id", authorizationCustomer);
router.get("/:id", CartController.getCartById);
router.put("/:id", authorizationCart, CartController.putCartById);
router.delete("/:id", authorizationCart, CartController.deleteCartById);

module.exports = router;
