const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

const productData = {
  name: "iPhone 12 Pro",
  image_url:
    "https://images.unsplash.com/photo-1611791485440-24e8239a0377?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
  price: 100000000,
  stock: 20,
};

const userData = {
  id: 1,
  email: "admin@mail.com",
  role: "admin",
  access_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYxODI4ODY0OH0.GutdYPIIC496Mt7Nh63zpHQY_mOibSZBSKwUbn2aYd8",
};

// SUKSES GET ALL DATA
describe("get All product >> GET /products", () => {
  it("return array of obj from all products & status 200", (done) => {
    return request(app)
      .get("/products")
      .set("access_token", userData.access_token)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, status } = response;
        expect(status).toBe(200);
        expect(body).toHaveProperty("id", expect.any(Number));
        expect(body).toHaveProperty("name", expect.any(String));
        expect(body).toHaveProperty("image_url", expect.any(String));
        expect(body).toHaveProperty("price", expect.any(String));
        expect(body).toHaveProperty("stock", expect.any(Number));
        done();
      });
  });
});
