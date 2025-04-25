const cronJobs = require("node-cron");
const moment = require("moment");
const Documentation = require("../models/documentation.model");

cronJobs.schedule("*/1 * * * *", async () => {
  try {
    const documents = await Documentation.find();
    for (const document of documents) {
      if (moment(document.expiration).isBefore(moment(), "day") && document.status !== "expiré") {
        await Documentation.updateOne(
          { _id: document._id },
          { status: "expiré" }
        );

        console.log(
          `Document with ID ${document.title} has been updated to expired.`
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
});
