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
    Product.findOne({
      where: { id: req.params.ProductId },
    })
      .then((data) => {
        // baru bisa add satu satu belum yang nambah
        // jika tidak ada productnya >>>> Create product
        // jika ada jadinya update quantitynya >>>>> update product
        console.log(data);
        Cart.create({
          UserId: req.loggedUser.id,
          ProductId: req.params.ProductId,
          quantity: req.body.quantity,
        }).then((newCart) => {
          res.status(201).json(newCart);
          // valuenya nambah disini dan di product berkurang sejumlah angka
        });
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
