const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5012;
const data = require("./package.json");
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
const Cohort = mongoose.model("Cohort", cohortsSchema)
const Student = mongoose.model("Student", studentsSchema);

///////Student Routes

app.post("/students", (req, res) => {

  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    projects: req.body.projects,
    cohort: req.body.cohort
  })
    .then((createdStudent) => {
      console.log("Retrieved books ->", createdStudent);
      res.status(201).json(createdStudent);
    })
    .catch((error) => {
      console.error("Error while creating Student ->", error);
      res.status(500).json({ error: "Failed to create Students" });
    });
});

app.get("/students", (req, res) => {
  Student.find({})
    .then((students) => {
      console.log("Retrieved books ->", students);
      res.status(200).json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving Students ->", error);
      res.status(500).json({ error: "Failed to retrieve Students" });
    });
});


app.get("/students/cohort/:cohortId", (req, res) => {

  let cohortId = req.params.id;

  console.log("cohortId")
  console.log(cohortId)
  console.log("cohortId")

  Student.find({cohortId: cohortId})
    .populate("cohort")
    .then((cohorts) => {
      console.log("Retrieved books ->", cohorts);
      res.status(200).json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving Students ->", error);
      res.status(500).json({ error: "Failed to retrieve Students" });
    });
    
});


//get
app.get("/students/:studentId", (req, res) => {

  const studentId = req.params.id;

  Student.find({studentId})
    .then((student) => {
      console.log("Retrieved student ->", student);
      res.status(200).json(student);
    })
    .catch((error) => {
      console.error("Error while retrieving Students ->", error);
      res.status(500).json({ error: "Failed to retrieve Students" });
    });
});

//update
app.put("/students/:studentId", (req, res, next) => {

  const {studentId} = req.params;

  console.log("StudentID" + studentId);
  const newDetails = req.body;

  Student.findByIdAndUpdate(studentId, newDetails, {new: true})
    .then((student) => {
      console.log("Updated student ->", student);
      res.status(200).json(student);
    })
    .catch((error) => {
      console.error("Error while updating Students ->", error);
      res.status(500).json({ error: "Failed to update Students" });
    });
});

//Delete
app.delete("/students/:studentId", (req, res, next) => {

  const {studentId} = req.params;

  console.log("StudentID" + studentId);

  Student.findByIdAndDelete(studentId)
    .then((result) => {
      console.log("Deleted student ->", result);
      res.status(200).json(result);
    })
    .catch((error) => {
      console.error("Error while deleting Students ->", error);
      res.status(500).json({ error: "Failed to delete Students" });
    });
});


///////Cohorts Routes
app.get("/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrieved books ->", cohorts);
      res.status(200).json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving Students ->", error);
      res.status(500).json({ error: "Failed to retrieve Students" });
    });
});

//create
app.post("/cohorts", (req, res) => {

  Cohort.create({
    inProgress: req.body.inProgress,
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours
  })
    .then((createdCohort) => {
      console.log("Created Cohort ->", createdCohort);
      res.status(201).json(createdCohort);
    })
    .catch((error) => {
      console.error("Error while creating Cohort ->", error);
      res.status(500).json({ error: "Failed to create Cohort" });
    });
});

//get
app.get("/cohorts/:cohortId", (req, res) => {

  const cohortId = req.params.id;

  Cohort.find({cohortId})
    .then((cohorts) => {
      console.log("Retrieved cohort by id ->", cohorts);
      res.status(200).json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});

// //update
app.put("/cohorts/:cohortId", (req, res, next) => {

  const {cohortId} = req.params;

  console.log("CohortID" + cohortId);
  const newDetails = req.body;

  Cohort.findByIdAndUpdate(cohortId, newDetails, {new: true})
    .then((cohorts) => {
      console.log("Updated cohort ->", cohorts);
      res.status(200).json(cohorts);
    })
    .catch((error) => {
      console.error("Error while updating cohort ->", error);
      res.status(500).json({ error: "Failed to update cohort" });
    });
});

//Delete
app.delete("/cohorts/:cohortId", (req, res, next) => {

  const {cohortId} = req.params;

  console.log("CohortID" + cohortId);

  Cohort.findByIdAndDelete(cohortId)
    .then((result) => {
      console.log("Deleted cohort ->", result);
      res.status(200).json(result);
    })
    .catch((error) => {
      console.error("Error while deleting cohort ->", error);
      res.status(500).json({ error: "Failed to delete cohort" });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
