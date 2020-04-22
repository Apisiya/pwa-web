const express = require("express");
const mongoose = require("mongoose");
const MONGO_URI = "mongodb+srv://admin:admin@pwa-cfopw.mongodb.net/pwa";
const path = require("path");

const app = express();

//view engine
app.set("view engine", "ejs");
app.set("views", "views");

//body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//public folders
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "node_modules/chart.js/dist",
  express.static(path.join(__dirname, "node_modules/chart.js/dist"))
);

//session
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);
const store = new mongoDbStore({
  uri: MONGO_URI,
  collection: "sessions",
});
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//csrf
const csrf = require("csurf");
const csrfProtection = csrf();
app.use(csrfProtection);

//Find user
const User = require("./models/user");
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.user;
  res.locals.csrfToken = req.csrfToken();
  next();
});

//routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
app.use(authRoutes);
app.use(userRoutes);

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    console.log("connected");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
