const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/bcrypt");

// Data base sebelumnya sudah di Seed dahulu
const userData = {
  email: "admin@mail.com",
  password: hashPassword("1234567"),
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeAll((done) => {
  queryInterface
    .bulkInsert("Users", [userData])
    .then(() => {
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
      done();
    })
    .catch((err) => {
      done(err);
    });
});

//success register
describe("User Register Test >> POST /register", () => {
  it("success register return new obj & status 201", (done) => {
    return request(app)
      .post("/register")
      .send({
        email: "mamanggarong@mail.com",
        password: "1234567",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, status } = response;
        expect(status).toBe(201);
        expect(typeof body).toEqual("object");
        expect(body).toHaveProperty("email", "mamanggarong@mail.com");
        expect(typeof body.email).toEqual("string");
        expect(body).toHaveProperty("role", "customer");
        expect(typeof body.role).toEqual("string");
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

// LOGIN success
describe("User Login Test >> POST /login", () => {
  it("success login return id, email, role, access_token & status 200", (done) => {
    return request(app)
      .post("/login")
      .send({ email: "admin@mail.com", password: "1234567" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, status } = response;
        // console.log(body);
        expect(status).toBe(200);
        expect(typeof body).toEqual("object");
        expect(body).toHaveProperty("id", expect.any(Number));
        expect(typeof body.id).toEqual("number");
        expect(body).toHaveProperty("email", userData.email);
        expect(typeof body.email).toEqual("string");
        expect(body).toHaveProperty("role", userData.role);
        expect(typeof body.role).toEqual("string");
        expect(body).toHaveProperty("access_token", expect.any(String));
        expect(typeof body.access_token).toEqual("string");
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });

  it("failed login with email & password empty, return err message & status 400", (done) => {
    return request(app)
      .post("/login")
      .send({ email: "", password: "" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, status } = response;
        // console.log(body, "<<< Masuk Body");
        expect(status).toBe(400);
        expect(typeof body).toEqual("object");
        expect(body).toHaveProperty("message", "Invalid Email or Password");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });

  it("failed login with email not registered return err message & status 400", (done) => {
    return request(app)
      .post("/login")
      .send({ email: "admin1@mail.com", password: "1234567" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, status } = response;
        // console.log(body);
        expect(status).toBe(400);
        expect(typeof body).toEqual("object");
        expect(body).toHaveProperty("message", "Invalid Email or Password");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });

  it("failed login with wrong password, return err message & status 400", (done) => {
    return request(app)
      .post("/login")
      .send({ email: "admin@mail.com", password: "12345" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, status } = response;
        // console.log(body);
        expect(status).toBe(400);
        expect(typeof body).toEqual("object");
        expect(body).toHaveProperty("message", "Invalid Email or Password");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });

  it("failed login with null value, return err message & status 400", (done) => {
    return request(app)
      .post("/login")
      .send({ email: null, password: null })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, status } = response;
        // console.log(body);
        expect(status).toBe(400);
        expect(typeof body).toEqual("object");
        expect(body).toHaveProperty("message", "Invalid Email or Password");
        expect(typeof body.message).toEqual("string");
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});
