const express = require("express");
const app = express();

const dbConnect = require("./configs/mongoDbConnect");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth.routes");
const productRouter = require("./routes/product.routes");
const blogRouter = require("./routes/blog.routes");
const productCategoryRouter = require("./routes/productCategory.routes");
const blogCategoryRouter = require("./routes/blogCategory.routes");
const brandRouter = require("./routes/brand.routes");
const couponRouter = require("./routes/coupon.routes");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/product-category", productCategoryRouter);
app.use("/api/blog-category", blogCategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
