const User = require("../models/user.model");

const handleRefreshToken = async (req, res) => {
    const userId = req.params._id;
    const user = await User.findById(userId); 
    if (!user) { return res.status(404).json({ error: "User not found" }); }
    res.json({ user });
}

module.exports = { handleRefreshToken }