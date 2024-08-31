const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
// This is to handle async errors (no need to use try/catch blocks)
require("express-async-errors");
const errorHandler = require("./middleware/error-handler");

// Middlewares
app.use(cors());
app.use(express.json());
//middleware for cookies
const notFoundMiddleware = require("./middleware/not-found");

// db
const connectDb = require("./database/connect");

// routes imports
const authRoute = require("./routes/auth.route");
const refreshRoute = require("./routes/refresh.route");
const usersRoutes = require("./routes/users.route");
const documentationsRoute = require("./routes/documentations.route");
const configurationsRoute = require("./routes/configurations.route");
const sourceRoute = require("./routes/sources.route");
const memosRoute = require("./routes/memos.route");
const sectionRoute = require("./routes/sections.route");
const mappingsRoute = require("./routes/mappings.route");
const languagesRoute = require("./routes/languages.route");
const projectsRoute = require("./routes/projects.route");
const subProjectsRoute = require("./routes/subProjects.route");
const errorsRoute = require("./routes/errors.route");

const port = process.env.PORT || 5000;

// Routes
app.use("/users", usersRoutes);
app.use("/auth", authRoute);
app.use("/refresh", refreshRoute);
app.use("/languages", languagesRoute);
app.use("/documentations", documentationsRoute);
app.use("/configurations", configurationsRoute);
app.use("/sources", sourceRoute);
app.use("/memos", memosRoute);
app.use("/sections", sectionRoute);
app.use("/mappings", mappingsRoute);
app.use("/projects", projectsRoute);
app.use("/subProjects", subProjectsRoute);
app.use("/errors", errorsRoute);
// -- route for the not-found
app.use(notFoundMiddleware);

// -- error handler
app.use(errorHandler);

// Jobs
require("./jobs/cron");

const start = async () => {
  try {
    await connectDb();
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}...`);
    });
  } catch (err) {
    console.log("Date: ", new Date().toISOString(), "Error: ", err);
  }
};

// Start the server
start();
