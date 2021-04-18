const { Cart, Product } = require("../models");

class CartController {
  static showCart(req, res, next) {
    if (req.loggedUser.role === "admin") {
      Cart.findAll({
        include: Product,
        attributes: ['id', 'quantity', 'UserId', 'ProductId']
      })
        .then((cardData) => {
          res.status(200).json(cardData);
        })
        .catch((err) => {
          next(err);
        });
    } else if (req.loggedUser.role === "customer") {
      Cart.findAll({
        include: Product,
        where: { UserId: req.loggedUser.id },
        attributes: ['id', 'quantity', 'UserId', 'ProductId'],
        include: Product,
      })
        .then((cardData) => {
          res.status(200).json(cardData);
        })
        .catch((err) => {
          next(err);
        });
    }
  }

  static postCart(req, res, next) {
    // jika tidak ada productnya >>>> Create product
    // jika ada jadinya update quantitynya >>>>> update product
    let dataInput = {
      UserId: req.loggedUser.id,
      ProductId: req.params.ProductId,
      quantity: 1,
    };

    Cart.findOne({
      where: { ProductId: req.params.ProductId, UserId: req.loggedUser.id },
      include: Product,
    })
      .then((data) => {
        if (!data) {
          return Cart.create(dataInput);
        } else {
          if (data.quantity < data.Product.stock) {
            let quantityBefore = +data.quantity;
            // console.log(quantityBefore, "MASOK SINI");
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
          } else {
            throw { name: "OutOfStock" }
            // res.status(400).json({message: "Out of Stock!"})
          }
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
      where: { id: id, UserId: req.loggedUser.id},
      attributes: ['id', 'quantity', 'UserId', 'ProductId']
    })
      .then((foundCart) => {
        if (!foundCart) {
          throw { name: "CartNotFound" };
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

    Cart.findOne({
      where: {id: id}
    })
    .then((data) => {
      if (data) {
        return Product.findOne({
          where: {id: data.ProductId} 
        })
      } else {
        throw { name: "CartNotFound" }
      }
    })
    .then((data) => {
      if (data.stock >= updateCart.quantity) {
        return Cart.update(updateCart, {
          where: { id: id },
          returning: true,
        })
      } else {
        throw { name: "OutOfStock" }
        // res.status(400).json({message: "Out of Stock!"})
      }
    })
      .then((updateCart) => {
        if (!updateCart) {
          throw { name: "CartNotFound" };
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
