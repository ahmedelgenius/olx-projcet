require("dotenv").config();
const express = require("express");
const connectDB = require("./DB/connection");
const app = express();
const port = process.env.port;
const indexRouter = require("./modules/index.router");
const path = require("path");
const fs = require("fs");
const { createInvoice } = require("./scrvice/pdf");
const sendEmail = require("./scrvice/sendEmail");
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use("/api/v1/auth", indexRouter.authRouter);
app.use("/api/v1/user", indexRouter.userRouter);
app.use("/api/v1/product", indexRouter.productRouter);
app.use("/api/v1/admin", indexRouter.adminRouter);

const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111,
  },
  items: [
    {
      id: "",
      title: "product",
      desc: "this is very good",
      price: 400,
    },
    {
      id: "",
      title: "product",
      desc: "this is very good",
      price: 400,
    },
  ],
  userNumber: 8000,
  paid: 0,
  invoice_nr: 1234,
};
createInvoice(invoice, path.join(__dirname, "./uploads/PDF/invoice.pdf"));
const attachment = fs
  .readFileSync(path.join(__dirname, "./uploads/PDF/invoice.pdf"))
  .toString("base64");

// sendEmail("anasmsm10000@gmail.com", `<p> open your invioce </p>`, {
//   content: attachment,
//   filename: "attachment.pdf",
//   type: "application/pdf",
//   disposition: "attachment",
// });
sendEmail("anasmsm10000@gmail.com", "<p> open your invioce </p>", [
  {
    filename: "myInvoice.pdf",
    path: path.join(__dirname, "./uploads/PDF/invoice.pdf"),
  },
]);
connectDB();
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
