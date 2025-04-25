const cronJobs = require("node-cron");
const moment = require("moment");
const Documentation = require("../models/documentation.model");

cronJobs.schedule("*/10 * * * *", async () => {
  try {
    const documents = await Documentation.find();
    for (const document of documents) {
      if (moment(document.expiration).isBefore(moment(), "day")) {
        await Documentation.updateOne(
          { _id: document._id },
          { statut: "expiré" }
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
});
