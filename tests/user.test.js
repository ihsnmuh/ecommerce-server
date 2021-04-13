const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

const userData = {
  email: "admin@mail.com",
  password: "1234567",
  role: "admin",
};

// hook kosongin db
beforeAll((done) => {
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
describe("User Register Test >> Post /register", () => {
  it("success register return new obj & status 201", (done) => {
    return request(app)
      .post("/register")
      .send(userData)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, status } = response;
        expect(status).toBe(201);
        expect(body).toHaveProperty("email", userData.email);
        expect(body).toHaveProperty("role", userData.role);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

// LOGIN success
describe("User Login Test >> Post /login", () => {
  it("success login return id, email, role, access_token & status 201", (done) => {
    return request(app)
      .post("/login")
      .send(userData)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, status } = response;
        // console.log(body);
        expect(status).toBe(200);
        expect(body).toHaveProperty("id", expect.any(Number));
        expect(body).toHaveProperty("email", userData.email);
        expect(body).toHaveProperty("role", userData.role);
        expect(body).toHaveProperty("access_token", expect.any(String));
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

// Login fail (empty email, empty password)
describe("User Login Test (no Email & Password) >> Post /login", () => {
  it("failed login return err message, status 400", (done) => {
    return request(app)
      .post("/login")
      .send({ email: "", password: "" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, status } = response;
        // console.log(body);
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Invalid Email or Password");
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

// Login fail (not registered email, true password)
describe("User Login Test (Email not registered) >> Post /login", () => {
  it("failed login return err message, status 400", (done) => {
    return request(app)
      .post("/login")
      .send({ email: "admin1@mail.com", password: "1234567" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, status } = response;
        // console.log(body);
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Invalid Email or Password");
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

// Login fail (registered email, wrong password)
describe("User Login Test (Email registered and wrong password) >> Post /login", () => {
  it("failed login return err message, status 400", (done) => {
    return request(app)
      .post("/login")
      .send({ email: "admin@mail.com", password: "12345" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .then((response) => {
        let { body, status } = response;
        // console.log(body);
        expect(status).toBe(400);
        expect(body).toHaveProperty("message", "Invalid Email or Password");
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});
