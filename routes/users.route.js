const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUsersSafely,
  updateUser,
  updatePassword,
  updatePasswordOtherUser,
  updatePrivileges,
  deleteUser,
} = require("../controllers/users.controller");

router.get("/",getUsers);
router.get("/:user", getUsersSafely);
router.put("/:_id", updateUser);
router.put("/password/:_id", updatePassword);
router.put("/privileges/:_id", updatePrivileges);
router.delete("/:_id", deleteUser);

module.exports = router;
