const moment = require("moment");
const chalk = require("chalk");
//App logger
const logger = (req, res, next) => {
  console.log(
    chalk.greenBright.bold`${req.protocol}://${req.get("host")}${
      req.originalUrl
    }: ${moment().format()}`
  );
  next();
};

module.exports = logger;
