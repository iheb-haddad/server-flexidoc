const Section = require("../models/section.model");
const Mapping = require("../models/mapping.model");

const getSections = async (req, res) => {
  const sections = await Section.find();
  res.send(sections);
};

const createSection = async (req, res) => {
  const section = req.body;

  const existingSection = await Section.findOne({ titleFr: section.titleFr });
  if (existingSection) {
    return res
      .status(400)
      .json({ message: "Section with this title already exists" });
  }

  await Section.create(section);
  res.status(201).send();
};

const updateSection = async (req, res) => {
  const _id = req.params._id;
  const updates = req.body;
  const updatedSection = await Section.updateOne({ _id: _id }, updates);
  res.status(200).json(updatedSection);
};

const deleteSection = async (req, res) => {
  const _id = req.params._id;
  await Section.deleteOne({ _id: _id });
  await Mapping.deleteMany({ idSection: _id });
  res.status(200).send();
};

module.exports = {
  getSections,
  createSection,
  updateSection,
  deleteSection,
};
