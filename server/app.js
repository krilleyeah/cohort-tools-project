const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5012;
const data = require("./package.json");
// const cohorts = require("./cohorts.json");
// const students = require("./students.json");
const cors = require("cors");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

mongoose
  .connect("mongodb://localhost:27017/cohort-tools-api")
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to mongo", err));

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(
  cors({
    // Add the URLs of allowed origins to this array
    origin: ['http://localhost:5173'],
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// app.get("/api/cohorts", (req, res) => {
//   res.json(cohort);
// });
// app.get("/api/students", (req, res) => {
//   res.json(students);
// })

////////////////Create Schema

//Cohort
const cohortsSchema = new Schema({
  inProgress: { type: Boolean, required: true },
  cohortSlug: { type: String, required: true, unique: true },
  cohortName: { type: String, required: true },
  program: { type: String, required: true },
  campus: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  programManager: { type: String, required: true },
  leadTeacher: { type: String, required: true },
  totalHours: { type: Number, required: true }
})

//Students
const studentsSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  linkedinUrl: String,
  languages: [String],
  program: { type: String, required: true },
  background: String,
  image: String,
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }], // Assuming 'Project' is another model
  cohort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cohort', // Assuming 'Cohort' is another model
    required: true
  }
}
)




///////////////Create Models
const cohorts = mongoose.model("Cohorts", cohortsSchema)
const students = mongoose.model("Students", studentsSchema);

//GET REQUEST
// GET  /books - Retrieve all books from the database
app.get("/students", (req, res) => {
  students.find({})
    .then((students) => {
      console.log("Retrieved books ->", students);
      res.status(200).json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving Students ->", error);
      res.status(500).json({ error: "Failed to retrieve Students" });
    });
});

app.get("/cohorts", (req, res) => {
  cohorts.find({})
    .then((cohorts) => {
      console.log("Retrieved books ->", cohorts);
      res.status(200).json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving Students ->", error);
      res.status(500).json({ error: "Failed to retrieve Students" });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
