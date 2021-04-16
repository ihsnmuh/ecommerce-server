const { Cart, Product } = require("../models");

class CartController {
  static showCart(req, res, next) {
    Cart.findAll({
      include: Product,
    })
      .then((cardData) => {
        res.status(200).json(cardData);
      })
      .catch((err) => {
        next(err);
      });
  }

  static postCart(req, res, next) {
    // jika tidak ada productnya >>>> Create product
    // jika ada jadinya update quantitynya >>>>> update product
    // belum ke handle kalo inputan melebihi stock
    let dataInput = {
      UserId: req.loggedUser.id,
      ProductId: req.params.ProductId,
      quantity: 1,
    };

    Cart.findOne({
      where: { ProductId: req.params.ProductId },
    })
      .then((data) => {
        if (!data) {
          return Cart.create(dataInput);
        } else {
          let quantityBefore = +data.quantity;
          console.log(quantityBefore, "MASOK SINI");
          return Cart.update(
            {
              quantity: quantityBefore + 1,
            },
            {
              where: {
                ProductId: req.params.ProductId,
              },
              returning: true,
            }
          );
        }
      })
      .then((dataNew) => {
        if (dataNew[0] === 1) {
          res.status(201).json(dataNew[1][0]);
        } else {
          res.status(201).json(dataNew);
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static getCartById(req, res, next) {
    let id = +req.params.id;

    Cart.findOne({
      where: { id: id },
    })
      .then((foundCart) => {
        if (!foundCart) {
          throw { name: "Not Found" };
        }
        res.status(200).json(foundCart);
      })
      .catch((err) => {
        next(err);
      });
  }

  static putCartById(req, res, next) {
    let id = +req.params.id;

    let updateCart = {
      quantity: req.body.quantity,
    };

    Cart.update(updateCart, {
      where: { id: id },
      returning: true,
    })
      .then((updateCart) => {
        if (!updateCart) {
          throw { name: "Not Found" };
        } else {
          res.status(200).json(updateCart[1][0]);
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static deleteCartById(req, res, next) {
    let id = +req.params.id;

    Cart.destroy({
      where: { id: id },
    })
      .then((deletedCart) => {
        if (!deletedCart) {
          throw { name: "CartNotFound" };
        } else {
          res.status(200).json({ message: "Item on Cart success to delete" });
          // seharusnya value nya balik lagi ke stock ++ disini menghilang
        }
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = CartController;
