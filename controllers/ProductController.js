const { Product } = require("../models");

class ProductController {
  static getProduct(req, res, next) {
    Product.findAll()
      .then((dataProduct) => {
        dataProduct.forEach((e) => {
          e.price = `Rp ${new Intl.NumberFormat("ID").format(e.price)}`;
        });
        res.status(200).json(dataProduct);
      })
      .catch((err) => {
        next(err);
      });
  }

  static postProduct(req, res, next) {
    let newProduct = {
      name: req.body.name,
      image_url: req.body.image_url,
      price: req.body.price,
      stock: req.body.stock,
    };
    Product.create(newProduct)
      .then((dataProduct) => {
        res.status(201).json(dataProduct);
      })
      .catch((err) => {
        next(err);
      });
  }

  static getProductById(req, res, next) {
    let id = +req.params.id;

    Product.findOne({ where: { id: id } })
      .then((foundProduct) => {
        if (!foundProduct) {
          throw { name: "Not Found" };
        }
        res.status(200).json(foundProduct);
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }

  static putProductById(req, res, next) {
    let id = +req.params.id;
    let updateProduct = {
      name: req.body.name,
      image_url: req.body.image_url,
      price: req.body.price,
      stock: req.body.stock,
    };

    Product.update(updateProduct, {
      where: { id: id },
      returning: true,
    })
      .then((updatedProduct) => {
        if (!updatedProduct) {
          throw { name: "Not Found" };
        } else {
          res.status(200).json(updatedProduct[1][0]);
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static deleteProductById(req, res, next) {
    let id = +req.params.id;
    Product.destroy({
      where: { id: id },
    })
      .then((deletedProduct) => {
        if (!deletedProduct) {
          throw { name: "Not Found" };
        } else {
          res.status(200).json({ message: "Product success to delete" });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = ProductController;
