const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

// to allow access api for cross-origin sharing
app.use(cors());
// allow api for parsing json
app.use(express.json());
app.use(morgan("dev"));
// allow api ffor recive data from client
app.use(express.urlencoded({ extended: true }));

//v1 (with jwt)
// app.use("/auth", require("./middleware"));
app.use("/assets/uploads/area", express.static("assets/uploads/area"));
app.use("/assets/uploads/audio", express.static("assets/uploads/audio"));
app.use("/assets/uploads/img/blog", express.static("assets/uploads/img/blog"));
app.use("/assets/uploads/img/gs", express.static("assets/uploads/img/gs"));
app.use("/assets/uploads/img/gs_icon", express.static("assets/uploads/img/gs_icon"));
app.use("/assets/uploads/img", express.static("assets/uploads/img"));
app.use('/assets/uploads/file', express.static("assets/uploads/file"));

// app.use("/api/v1", require("./routes/v1/index"));
app.use("/api/v2", require("./routes/v2/index"));
app.use("/api/v3", require("./routes/v3/index"));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "e-taxzone API is running",
    timestamp: new Date().toISOString()
  });
});

const sequelize = require("./config/sequelizeconf");

sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:");
    console.error(err);
  });

require("./models/associations");

app.listen(process.env.PORT || 8000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});