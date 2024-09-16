const Memo = require("../models/memos.model");

const getMemos = async (req, res) => {
  try {
    const memos = await Memo.find().populate("idSource");
    res.send(memos);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

const createMemo = async (req, res) => {
  const doc = req.body;
  await Memo.create(doc);
  res.status(201).send();
};

const updateMemo = async (req, res) => {
  const _id = req.params._id;
  const updates = req.body;
  const updatedMemo = await Memo.updateOne({ _id: _id }, updates);
  res.status(200).json(updatedMemo);
};

module.exports = {
  getMemos,
  createMemo,
  updateMemo,
};
