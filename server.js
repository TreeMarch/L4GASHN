const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const pool = require("./db");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Cấu hình session
app.use(
  session({
    secret: "tringtrong",
    resave: false,
    saveUninitialized: true,
  })
);

// cau hinh flash message
app.use(flash());

// Middleware truyền flash message vào tất cả các view
app.use((req, res, next) => {
  res.locals.successMessage = req.flash("success");
  res.locals.errorMessage = req.flash("error");
  next();
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM gasstations");
    res.render("index", { gasStations: result.rows });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Trang chủ - Liệt kê các trạm xăng
app.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM gasstations ORDER BY station_id"
    );
    res.render("index", { stations: result.rows });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Trang thêm trạm xăng
app.get("/add", (req, res) => {
  res.render("add");
});

// Xử lý thêm trạm xăng
app.post("/add", async (req, res) => {
  const {
    station_name,
    station_address,
    station_latitude,
    station_longitude,
    brand,
    types_of_gasoline,
    oils,
    open_hours,
    services,
    contact_number,
    status,
  } = req.body;
  try {
    await pool.query(
      "INSERT INTO gasstations (station_name, station_address, station_latitude,station_longitude,brand,types_of_gasoline,oils,open_hours,services,contact_number,status) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9)",
      [
        station_name,
        station_address,
        station_latitude,
        station_longitude,
        brand,
        types_of_gasoline,
        oils,
        open_hours,
        services,
        contact_number,
        status,
      ]
    );
    //flash message
    req.flash("success", "Tạo thành công trạm xăng!");
    res.redirect("/");
  } catch (err) {
    req.flash("error", "Đã xảy ra lỗi khi tạo trạm xăng.");
    res.status(500).send(err.message);
  }
});

// Trang chỉnh sửa trạm xăng
app.get("/edit/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM gasstations WHERE station_id = $1",
      [req.params.id]
    );
    res.render("edit", { station: result.rows[0] });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// chon va chinh sua theo id
app.put("/edit/:id", async (req, res) => {
  const {
    station_name,
    station_address,
    station_latitude,
    station_longitude,
    brand,
    types_of_gasoline,
    oils,
    open_hours,
    services,
    contact_number,
    status,
  } = req.body;
  try {
    await pool.query(
      "UPDATE gasstations SET station_name = $1, station_address = $2, station_latitude = $3,station_longitude= $4,brand = $5,types_of_gasoline = $6,oils = $7 ,open_hours= $8,services = $9,contact_number = $10, status = $11 WHERE station_id = $12",
      [
        station_name,
        station_address,
        station_latitude,
        station_longitude,
        brand,
        types_of_gasoline,
        oils,
        open_hours,
        services,
        contact_number,
        status,
        req.params.station_id,
      ]
    );
    res.redirect("/"); // Sau khi cập nhật, quay lại trang index
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// xoa theo id cay xang
app.delete("/delete/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM gasstations WHERE station_id = $1", [
      req.params.id,
    ]);
    res.redirect("/"); // Sau khi xóa, quay lại trang index
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Chi tiet  cay xang
app.get("/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM gasstations WHERE station_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Không tìm thấy cây xăng này.");
    }
    res.render("detail", { station: result.rows[0] });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));

// ===============================================================================

// Trang User - Liệt kê các User
app.get("/user", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ");
    res.render("user", { user: result.rows });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
