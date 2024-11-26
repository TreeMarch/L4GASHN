const express = require("express");
const { Pool } = require("pg");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());

// Kết nối PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ungdungs",
  password: "1234",
  port: 5432,
});

// API lấy thông tin cây xăng
app.get("/api/gasstation", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM gasstation");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from database");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
