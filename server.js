const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("./middleware/passport");
const path = require("path");
const port = process.env.PORT || 8000;

const app = express();

const authRoute = require("./routes/authRoute");
const indexRoute = require("./routes/indexRoute");
const dbRoute = require("./routes/databaseRoute");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/db", dbRoute);

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server has started on port ${port}`);
  });