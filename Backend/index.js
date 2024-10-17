const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth = require("./routes/auth");
const app = express();
const port = 3000;
const user = require("./routes/users");
const noti = require("./routes/notification");
const prod = require("./routes/products");
const appointment = require("./routes/appointment");
const attr = require("./routes/attributes");
const brand = require("./routes/brands");
const categorie = require("./routes/categories");
const prodAttr = require("./routes/productsAttr");
const review = require("./routes/reviews");
const task = require("./routes/task");
const taskType = require("./routes/taskType");
const logs = require("./routes/history_log");
const tech_applicant = require("./routes/tech_applicants");
const tech = require("./routes/technicians");
const warehouse = require("./routes/warehouses");
const order = require("./routes/orders");
const payment = require("./routes/payments");
const roles = require("./routes/roles");
const borrow_prod = require("./routes/borrow_product");
const status = require("./routes/status");
const chart = require("./routes/chart")
const isAdmin = require("./middlewares/isAdmin");
const cookieParser = require("cookie-parser");


// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173', // Set your frontend's URL here
  credentials: true, // Allow credentials to be passed, such as cookies
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser()); // Correct placement

app.use(auth);
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
app.use(logs);
app.use(order);
app.use(payment);
app.use(roles);
app.use(borrow_prod);
app.use(status);
app.use(chart)
app.use(isAdmin);



app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
