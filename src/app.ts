import express from "express";
import sequelize from "./config/database";
import indexRoutes from "./routes/route";
import "./models/index";
import bodyParser from "body-parser";
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use routes defined in route.ts
app.use("/api", indexRoutes); // You can change the base route as needed
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();

  
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
