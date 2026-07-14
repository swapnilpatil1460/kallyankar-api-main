const express = require("express");
const auth = require("../middleware/auth");
const {
  login,
  signup,
  UserList_get,
  deleteUser,
} = require("../controller/admin.controller");
const router = new express.Router();

router.post("/login", login);

router.post("/sign-up", signup);

router.get("/user_list", auth, UserList_get);

router.delete("/delete/:id", auth, deleteUser);

// router.post("/logout", userLogout);

// router.post("/logout/all", userLogout);

//router.patch("/update/:id", auth, updateUser);

router.get('/force-admin', async (req, res) => {
  const Admin = require('../models/admin');
  try {
    const defaultAdmin = new Admin({
      name: 'Admin',
      last_name: 'User',
      email: 'admin@kallyankar.com',
      password: 'KallyankarAdmin123!',
      role: 'Admin',
      createdBy: 'System'
    });
    await defaultAdmin.save();
    res.send('Admin created successfully! You can now log in.');
  } catch (err) {
    if (err.code === 11000) return res.send('Admin already exists! You can log in.');
    res.send('Error: ' + err.message);
  }
});

module.exports = router;

