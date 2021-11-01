const { Router} = require("express");
const router = Router();

const authContol = require('../middleware/authControl')


router.get("/home", authContol,(req, res) => {

    res.render("home", {
      pageTitle: "solo Application | Home",
      isHome: true,
    });
  });

router.get("/about", authContol,(req, res) => {

  res.render("about", {
    pageTitle: "solo Application | About",
    isAbout: true,
  });
});

router.get("/team", authContol,(req, res) => {
  
  res.render("team", {
    pageTitle: "solo Application | Team",
    isTeam: true,
  });
});

router.get("/prise", authContol,(req, res) => {

  res.render("prise", {
    pageTitle: "solo Application | Prise",
    isPrise: true,
  });
});



module.exports = router;