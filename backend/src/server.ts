import app from './app';
import { pool } from "./lib/db";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 5000;

// test DB connection
pool.query("SELECT NOW()")
  .then(() => console.log("Database connected"))
  .catch(err => console.error("DB Error:", err));

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
