function errHandler(err, req, res, next) {
  console.log(err);
  console.log("Ini di error Handler >>>>>>>>>>>>>>>>>>", err.name);

  switch (err.name) {
    case "SequelizeValidationError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "InvalidUserorPassword":
      res.status(400).json({ message: "Invalid Email or Password" });
      break;
    case "JsonWebTokenError":
      res.status(400).json({ message: "Invalid Email or Password" });
      break;
    case "InvalidAccessToken":
      res.status(401).json({ message: "Invalid Access Token" });
      break;
    case "Unauthorized":
      res.status(401).json({ message: "Unauthorized Access" });
      break;
    case "NotFound":
      res.status(404).json({ message: "Task Not Found" });
      break;
    default:
      res.status(500).json({ message: "Internal server error" });
      break;
  }
}

module.exports = errHandler;
