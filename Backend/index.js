const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth = require("./routes/auth");
const app = express();
const port = 3000;
const user = require("./routes/users");
const noti = require("./routes/notification");
const prod = require("./routes/products");
const adminlog = require("./routes/adminlog");
const appointment = require("./routes/appointment");
const attr = require("./routes/attributes");
const brand = require("./routes/brands");
const categorie = require("./routes/categories");
const prodAttr = require("./routes/productsAttr");
const review = require("./routes/reviews");
const task = require("./routes/task");
const taskType = require("./routes/taskType");
const tech_applicant = require("./routes/tech_applicants");
const tech = require("./routes/technicians");
const warehouse = require("./routes/warehouses");

app.use(express());
app.use(cors());
app.use(bodyParser.json());

app.use(auth);
app.use(adminlog);
app.use(appointment);
app.use(attr);
app.use(brand);
app.use(categorie);
app.use(prodAttr);
app.use(review);
app.use(task);
app.use(taskType);
app.use(tech_applicant);
app.use(tech);
app.use(warehouse);
app.use(user);
app.use(noti);
app.use(prod);

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
