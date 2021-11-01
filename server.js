const express = require("express");
const chalk = require("chalk");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const logger = require("./middleware/logger");
const varMiddleware = require("./middleware/variables")
const session = require("express-session")
const path = require("path");
const soloRoutes = require("./routes/soloRoutes");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const dotenv = require("dotenv")

dotenv.config({ path: "./config/config.env" })


const application = express();
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

application.engine("hbs", hbs.engine);
application.set("view engine", "hbs");
application.set("views", "views");

application.use(express.urlencoded({ extended: true }));
application.use(express.static(path.join(__dirname, "public")));
application.use(session({
  secret: "my_secret_key",
  resave: false,
  saveUninitialized:false
}))


//Application Midlewares
application.use(logger);
application.use(flash());
application.use(varMiddleware)


application.use("/", soloRoutes);
application.use("/", authRoutes);

const PORT = process.env.PORT || 8000;
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    );
    application.listen(PORT, () =>
      console.log(chalk.cyan.bold`server started on port ${PORT}`)
    );
  } catch (error) {
    console.error(error);
  }
}
start();
