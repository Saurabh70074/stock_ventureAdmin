//#region
const app = require("express")();
var cors = require("cors");
const dotenv = require("dotenv");
//!R const AWS = require("aws-sdk");
const multer = require("multer");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
//!R const axios = require("axios");
//!R const jwt = require("jsonwebtoken");
// const logger = require("./logger").logger;
const responseHandler = require("./utils/responseHandler");

const config = require("./config");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" })); // parse application/json
app.use(cookieParser());
app.use(multer({ dest: "/tmp" }).any()); // parse multipart-form-data

const AppConfig = require("./config/config");
dotenv.config();
app.use(cors());
//#endregion

//Routes
app.use("/auth", require("./routes/authRouter"));
app.use("/blog", require("./routes/blogRouter"));
app.use("/form", require("./routes/formRouter"));
app.use("/course", require("./routes/courseRouter"));
app.use("/cart", require("./routes/cartRouter"));
app.use("/discount", require("./routes/discountRouter"));
app.use("/content", require("./routes/contentRouter"));
app.use("/faq", require("./routes/faqRouter"));

app.use("/util", require("./routes/utilRouter"));

app.use(responseHandler.handleError);

app.get("/", async (req, res) => {
  res.send({ status: "OK" });
});

const port = parseInt(process.env.PORT || 3001);
let server = "";

config.dbConnection.connectDb();

server = require("http").createServer(app);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // logger.info(`Server listening on ${port}, in ${config.cfg.ENVIRONMENT} mode`);
});

module.exports;
module.exports = server;
