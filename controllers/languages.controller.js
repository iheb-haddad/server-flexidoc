const Language = require("../models/language.model.js");

const getLanguages = async (req, res) => {
    try {
        const result = await Language.find();
        res.send(result);
    } catch (err) {
        console.log(err);
    }
};

const createLanguage = async (req, res) => {
    const lang = req.body;
    const language = await Language.findOne({ code: lang.code });
    if (language) {
        return res.status(400).json({ error: 'Language already exists' });
    }
    try {
        await Language.create(lang);
        res.status(201).send();
    } catch (err) {
        res.status(500).send();
    }
};

const updateLanguage = async (req, res) => {
    const _id = req.params._id;
    const updates = req.body;
    try {
        const result = await Language.updateOne({ _id: _id }, updates);
        res.status(200).json(result);
    }
    catch {
        res.status(500).send();
    }
}

const deleteLanguage = async (req, res) => {
    const _id = req.params._id;
    try {
        await Language.deleteOne({ _id: _id });
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

module.exports = {
    getLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage
}