const Scrap = require("../models/scrap");

const getScrapList = async (req, res) => {
  try {
    const list = await Scrap.find({ deleted: { $ne: true } }).populate("customer");
    res.status(200).send(list);
  } catch (e) {
    res.status(400).send({ message: "Error fetching scrap list", error: e.message });
  }
};

const deleteScrap = async (req, res) => {
  const id = req.params.id;
  try {
    const scrap = await Scrap.findOneAndUpdate(
      { _id: id },
      { deleted: true }
    );
    if (scrap) {
      res.status(200).send({ message: "Scrap item soft deleted", scrap });
    } else {
      res.status(404).send({ message: "Scrap item not found" });
    }
  } catch (e) {
    res.status(400).send({ message: "Error deleting scrap", error: e.message });
  }
};

module.exports = {
  getScrapList,
  deleteScrap
};
