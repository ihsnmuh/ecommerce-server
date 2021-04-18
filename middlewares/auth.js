const { verifyToken } = require("../helpers/jwt");
const { User, Product, Cart } = require("../models");

function authentication(req, res, next) {
  const access_token = req.headers.access_token;
  if (access_token) {
    const token = verifyToken(access_token);

    User.findOne({
      where: {
        email: token.email,
      },
    })
      .then((foundUser) => {
        if (foundUser) {
          req.loggedUser = {
            id: token.id,
            username: token.username,
            email: token.email,
            role: token.role,
          };
          next();
        } else {
          res.status(401).json({ message: "Invalid Access Token" });
        }
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(401).json({ message: "Invalid Access Token" });
  }
}

function authorizationAdmin(req, res, next) {
  const id = +req.params.id;

  Product.findByPk(id)
    .then((foundProduct) => {
      if (foundProduct) {
        //bandingkan
        if (req.loggedUser.role === "admin") {
          next();
        } else {
          res.status(401).json({ message: "Authorization Admin Failed!" });
        }
      } else {
        res.status(401).json({ message: "Authorization Admin Failed!" });
      }
    })
    .catch((err) => {
      next(err);
    });
}

function authorizationCustomer(req, res, next) {
  const id = +req.params.id;

  Product.findByPk(id)
    .then((foundProduct) => {
      if (foundProduct) {
        //bandingkan
        if (req.loggedUser.role === "customer") {
          next();
        } else {
          res.status(401).json({ message: "Authorization Customer Failed!" });
        }
      } else {
        res.status(401).json({ message: " ini Authorization Customer Failed!" });
      }
    })
    .catch((err) => {
      next(err);
    });
}

function authorizationCart(req, res, next) {
  const id = +req.params.id;

  Cart.findByPk(id)
    .then((foundCart) => {
      if (foundCart) {
        if (foundCart.UserId === req.loggedUser.id) {
          next();
        } else {
          res.status(401).json({ message: "Authorization Cart Failed!" });
        }
      } else {
        res.status(401).json({ message: "Authorization Cart Failed!" });
      }
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  authentication,
  authorizationAdmin,
  authorizationCustomer,
  authorizationCart,
};
