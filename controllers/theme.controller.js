const Theme = require("../models/theme.model")

const getThemes = async (req, res) => {
    const themes = await Theme.find();
    res.send(themes);
    }

const getTheme = async (req, res) => {
    const themeId = req.params.theme;
    const theme = await Theme.findOne({ _id: themeId });
    res.send(theme);
}

const createTheme = async (req, res) => {
    const theme = req.body;
    await Theme.create(theme);
    res.status(201).send();
}

const verifyNameUniqueness = async (req, res) => {
    const theme = req.body;
    const existingTheme = await Theme.findOne({ name: theme.name });
    if (existingTheme) {
        return res.status(400).json({ message: "Theme with this name already exists" });
    }
    res.status(200).send();
}

const updateTheme = async (req, res) => {
    const themeId = req.params.theme;
    const theme = req.body;
    await Theme.updateOne({ _id: themeId }, theme);
    res.status(200).send();
}

const deleteTheme = async (req, res) => {
    const themeId = req.params._id;
    await Theme.deleteOne({ _id: themeId });
    res.status(200).send();
}

module.exports = {
    getThemes,
    getTheme,
    createTheme,
    updateTheme,
    deleteTheme,
    verifyNameUniqueness
}
