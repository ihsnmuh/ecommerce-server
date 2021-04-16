const request = require("supertest");
const app = require("../app");
const { User, Product, sequelize } = require("../models");
const { queryInterface } = sequelize;
const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");

const userData = {
  id: 1,
  email: "admin@mail.com",
  role: "admin",
  password: "1234567",
};

const productData = {
  name: "iPhone 12 Pro",
  image_url:
    "https://images.unsplash.com/photo-1611791485440-24e8239a0377?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
  price: 100000000,
  stock: 20,
};

let access_token;

beforeAll((done) => {
  Product.create(productData)
    .then((data) => {
      // console.log(data, "<<<<< MASOK");
      done();
    })
    .catch((err) => {
      done(err);
    });

  User.create(userData)
    .then((data) => {
      const payload = {
        id: data.id,
        email: data.email,
        role: data.role,
      };
      access_token = signToken(payload);
      console.log(access_token, "<<<<<<<< AKSES TOKEN didalem");
      done();
    })
    .catch((err) => {
      done(err);
    });
});

afterAll((done) => {
  queryInterface
    .bulkDelete("Users")
    .then(() => {
      // queryInterface.bulkDelete("Products");
      done();
    })
    // .then(() => {
    //   done();
    // })
    .catch((err) => {
      done(err);
    });
});

// console.log(access_token, ">>>>>> AKSES TOKEN GLOBAL");

access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYxODM0OTAyM30.rnEkKAEPi-BMpebxI35FhLFOKGoPmF8wjNsa1oX078I";

// GET ALL PRODUCT

describe("GET /products", () => {
  console.log(access_token, ">>>>> Didalam Describe");
  it("Success Case return array of obj from all products & status code 200", (done) => {
  console.log(access_token, ">>>>> Didalam IT");
    return request(app)
      .get("/products")
      .set("access_token", access_token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        console.log(response.error);
        // console.log(body);
        let { body, statusCode } = response;
        expect(statusCode).toBe(200);
        body.forEach((data) => {
          expect(typeof data).toEqual("object");
          expect(data).toHaveProperty("id");
          expect(typeof data.id).toEqual("number");
          expect(data).toHaveProperty("name");
          expect(typeof data.name).toEqual("string");
          expect(data).toHaveProperty("image_url");
          expect(typeof data.image_url).toEqual("string");
          expect(data).toHaveProperty("price");
          expect(typeof data.price).toEqual("string");
          expect(data).toHaveProperty("stock");
          expect(typeof data.stock).toEqual("number");
        });
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

//CREATE PRODUCT

describe("POST /products", () => {
  it("Success case return new obj & status code 201", (done) => {
    let dataProduct = {
      name: "iPhone 12 Pro",
      image_url:
        "https://images.unsplash.com/photo-1611791485440-24e8239a0377?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
      price: 100000000,
      stock: 20,
    };

    return request(app)
      .post("/products")
      .send(dataProduct)
      .set("access_token", access_token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        // console.log(response.error);
        // console.log(response);
        let { body, statusCode } = response;
        expect(statusCode).toBe(201);
        expect(typeof body).toEqual("object");
        expect(body).toHaveProperty("name");
        expect(body.name).toEqual("iPhone 12 Pro");
        expect(typeof body.name).toEqual("string");
        expect(body).toHaveProperty("image_url");
        expect(body.image_url).toEqual(dataProduct.image_url);
        expect(typeof body.image_url).toEqual("string");
        expect(body).toHaveProperty("price");
        expect(body.price).toEqual(dataProduct.price);
        expect(typeof body.price).toEqual("number");
        expect(body).toHaveProperty("stock");
        expect(body.stock).toEqual(dataProduct.stock);
        expect(typeof body.stock).toEqual("number");
        done();
      })
      .catch((err) => {
        // console.log(err);
        done(err);
      });
  });

  it("Failed Case >> without access_token return error & status code 401", (done) => {
    let dataProduct = {
      name: "iPhone 12 Pro",
      image_url:
        "https://images.unsplash.com/photo-1611791485440-24e8239a0377?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
      price: 100000000,
      stock: 20,
    };

    return request(app)
      .post("/products")
      .send(dataProduct)
      .set("access_token", "")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, statusCode } = response;
        expect(statusCode).toBe(401);
        expect(body).toHaveProperty("message");
        expect(body.message).toMatch("Invalid Access Token");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Failed Case >> with wrong access_token return error & status code 400", (done) => {
    let dataProduct = {
      name: "iPhone 12 Pro",
      image_url:
        "https://images.unsplash.com/photo-1611791485440-24e8239a0377?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
      price: 100000000,
      stock: 20,
    };

    return request(app)
      .post("/products")
      .send(dataProduct)
      .set("access_token", "fabfkjqandnqn1n3dandniqnlkanlkfaklnf")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, statusCode } = response;
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toMatch("User Not Authenticated");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Failed Case >> with empty value return error & status code 400", (done) => {
    let dataProduct = {
      name: "",
      image_url: "",
      price: 100000000,
      stock: 20,
    };

    return request(app)
      .post("/products")
      .send(dataProduct)
      .set("access_token", access_token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, statusCode } = response;
        // console.log(body);
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("message");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Failed Case >> with minus price value return error & status code 400", (done) => {
    let dataProduct = {
      name: "iPhone 12 Pro",
      image_url:
        "https://images.unsplash.com/photo-1611791485440-24e8239a0377?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
      price: -100000000,
      stock: 20,
    };

    return request(app)
      .post("/products")
      .send(dataProduct)
      .set("access_token", access_token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, statusCode } = response;
        // console.log(body);
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toEqual("Price cannot set less than 0");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Failed Case >> with minus stock value return error & status code 400", (done) => {
    let dataProduct = {
      name: "iPhone 12 Pro",
      image_url:
        "https://images.unsplash.com/photo-1611791485440-24e8239a0377?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
      price: 100000000,
      stock: -20,
    };

    return request(app)
      .post("/products")
      .send(dataProduct)
      .set("access_token", access_token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, statusCode } = response;
        // console.log(body);
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toEqual("Stock cannot set less than 0");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Failed Case >> with wrong type value data return error & status code 400", (done) => {
    let dataProduct = {
      name: true,
      image_url: null,
      price: "100000000",
      stock: "-20",
    };

    return request(app)
      .post("/products")
      .send(dataProduct)
      .set("access_token", access_token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, statusCode } = response;
        console.log(body, ">>>>>>> wrong type data");
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("message");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        // console.log(err, ">>>>>> MASOK");
        done(err);
      });
  });
});

// UPDATE PRODUCT

describe("PUT /products/:id", () => {
  it("Success Case return Obj data update & status code 200", (done) => {
    let dataNewProduct = {
      name: "iPhone 12 Pro",
      image_url:
        "https://images.unsplash.com/photo-1611791485440-24e8239a0377?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
      price: 110000000,
      stock: 10,
    };

    return request(app)
      .put("/products/2")
      .send(dataNewProduct)
      .set("access_token", access_token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        // expect(typeof body).toEqual("object");
        let { body, statusCode } = response;
        console.log(response);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("name");
        expect(body.name).toEqual("iPhone 12 Pro");
        expect(typeof body.name).toEqual("string");
        expect(body).toHaveProperty("image_url");
        expect(body.image_url).toEqual(dataNewProduct.image_url);
        expect(typeof body.image_url).toEqual("string");
        expect(body).toHaveProperty("price");
        expect(body.price).toEqual(dataNewProduct.price);
        expect(typeof body.price).toEqual("number");
        expect(body).toHaveProperty("stock");
        expect(body.stock).toEqual(dataNewProduct.stock);
        expect(typeof body.stock).toEqual("number");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Failed Case >> without access_token return error & status code 401", (done) => {
    let dataNewProduct = {
      name: "iPhone 12 Pro",
      image_url:
        "https://images.unsplash.com/photo-1611791485440-24e8239a0377?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
      price: 110000000,
      stock: 10,
    };

    return request(app)
      .post("/products/2")
      .send(dataNewProduct)
      .set("access_token", "")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, statusCode } = response;
        expect(statusCode).toBe(401);
        expect(body).toHaveProperty("message");
        expect(body.message).toMatch("Invalid Access Token");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Failed Case >> wrong access_token return error & status code 400", (done) => {
    let dataNewProduct = {
      name: "iPhone 12 Pro",
      image_url:
        "https://images.unsplash.com/photo-1611791485440-24e8239a0377?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
      price: 110000000,
      stock: 10,
    };

    return request(app)
      .post("/products/2")
      .send(dataNewProduct)
      .set("access_token", "askjdn13h8haodoandasm")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, statusCode } = response;
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toMatch("User Not Authenticated");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Failed Case >> with minus price return error & status code 400", (done) => {
    let dataNewProduct = {
      name: "iPhone 12 Pro",
      image_url:
        "https://images.unsplash.com/photo-1611791485440-24e8239a0377?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
      price: -110000000,
      stock: 10,
    };

    return request(app)
      .put("/products/2")
      .send(dataNewProduct)
      .set("access_token", access_token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, statusCode } = response;
        console.log(response.statusCode, ">>>>> INININININ");
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toMatch("Price cannot set less than 0");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Failed Case >> with minus stock return error & status code 400", (done) => {
    let dataNewProduct = {
      name: "iPhone 12 Pro",
      image_url:
        "https://images.unsplash.com/photo-1611791485440-24e8239a0377?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
      price: 110000000,
      stock: -10,
    };

    return request(app)
      .put("/products/2")
      .send(dataNewProduct)
      .set("access_token", access_token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, statusCode } = response;
        // console.log(response.statusCode, ">>>>> INININININ");
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toMatch("Stock cannot set less than 0");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Failed Case >> with wrong type value data return error & status code 400", (done) => {
    let dataNewProduct = {
      name: null,
      image_url: 0,
      price: "110000000",
      stock: "10",
    };

    return request(app)
      .put("/products/2")
      .send(dataNewProduct)
      .set("access_token", access_token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, statusCode } = response;
        console.log(response.statusCode, ">>>>> INININININ");
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("message");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

// DELETE PRODUCT

describe("DELETE /products/:id", () => {
  it("Success Case return obj massage & status code 200", (done) => {
    return request(app)
      .delete("/products/23")
      .set("access_token", access_token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        // expect(typeof body).toEqual("object");
        let { body, statusCode } = response;
        // console.log(response);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("message");
        expect(body.message).toMatch("Product success to delete");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Failed Case >> without access_token return error & status code 401", (done) => {
    return request(app)
      .delete("/products/1")
      .set("access_token", "")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        // expect(typeof body).toEqual("object");
        let { body, statusCode } = response;
        // console.log(response);
        expect(statusCode).toBe(401);
        expect(body).toHaveProperty("message");
        expect(body.message).toMatch("Invalid Access Token");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Failed Case >> wrong access_token return error & status code 401", (done) => {
    return request(app)
      .delete("/products/1")
      .set("access_token", "asdafsfwf42fwefw34twf4fgg")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        // expect(typeof body).toEqual("object");
        let { body, statusCode } = response;
        // console.log(response);
        expect(statusCode).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toMatch("User Not Authenticated");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
