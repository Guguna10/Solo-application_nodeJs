const { Router} = require("express");
const User = require("../models/UserModel")
const bcrypt = require("bcryptjs");
const router = Router();
const authContol = require('../middleware/authControl')

router.get("/", (req, res) => {
    res.render("sign_in", {
        pageTitle: "solo Application | Sign In",
        isSign_in: true,
        error: req.flash("error"),
        info: req.flash("info")
    });
});

router.post("/", async (req, res) => {
  await Object.values(req.body).map((value) => {
    if (value === null || value === undefined || value === "") {
      req.flash("error", "Please enter all form fields");
      res.redirect("/");
    }
  });

   User
   .findOne({ email: req.body.email })
   .exec()
   .then( async (document) => {
      const areSame = await bcrypt.compare(req.body.password, document.password)
      if (areSame) {
        req.session.user = document
        req.session.isAuthenticated = true
        res.redirect("/home")
      }else {
        req.flash("error", "Wrong Password");
        res.redirect("/");
      }
    })
   .catch((error)=> {
      req.flash("error", "This email not found in Mongo Database");
      res.redirect("/");
   })
});

router.get("/registration", (req, res) => {
    res.render("registration", {
        pageTitle: "solo Application | Registration",
        isRegistration: true,
        error: req.flash("error"),
        info: req.flash("info")
    });
});

router.post("/registration", async (req, res) => {
    try {
      const { email, password, confirm_password } = req.body;
      await Object.values(req.body).map((value) => {
          if (value === null || value === undefined || value === "") {
            req.flash("error", "Please enter all form fields");
            res.redirect("/registration");
          }
      });

      if (password === confirm_password) {
        const candidate = await User.findOne({ email });
  
        if (candidate) {
          req.flash("error", "This Email is already exists in Mongo Database");
          res.redirect("/registration");
        } else {
          const hashPassword = await bcrypt.hash(password, 10);

          const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hashPassword,
          });
          await newUser.save();
          req.flash("info", "Congrets! now you can sign in our application");
          res.redirect("/");
        }
      } else {
        req.flash("error", "Please check password or confirm password");
        res.redirect("/registration");
      }
    } catch (error) {
      console.error(error);
    }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});


router.get("/users", authContol, async(req, res) => {
  const userData= await User.find({}).lean();

  res.render("users", {
    pageTitle: "solo Application | Users",
    isUsers: true,
    userData:userData
  });
});

module.exports = router