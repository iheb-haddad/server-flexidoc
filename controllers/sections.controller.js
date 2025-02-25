const Section = require("../models/section.model");
const Mapping = require("../models/mapping.model");

const getSections = async (req, res) => {
  const sections = await Section.find();
  res.send(sections.sort((a, b) => a.order - b.order));
};

const createSection = async (req, res) => {
  const section = req.body;

  const existingSection = await Section.findOne({ titleFr: section.titleFr });
  const maxOrderSection = await Section.findOne().sort('-order').exec();
  section.order = maxOrderSection ? maxOrderSection.order + 1 : 1;
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
  const deletedSection = await Section.findById(_id);
  await Section.deleteOne({ _id: _id });
  await Section.updateMany(
    { order: { $gt: deletedSection.order } },
    { $inc: { order: -1 } }
  );
  await Mapping.deleteMany({ idSection: _id });
  res.status(200).send();
};

const updateSectionsOrder = async (req, res) => {
  const sectionsOrder = req.body;
  console.log(sectionsOrder);
  for (const section of sectionsOrder) {
    await Section.updateOne({ _id: section._id }, { order: section.order });
  }
  res.status(200).send();
};

module.exports = {
  getSections,
  createSection,
  updateSection,
  deleteSection,
  updateSectionsOrder
};
