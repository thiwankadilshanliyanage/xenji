import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Xenji API on ${port}`);
      console.log("Google Client Loaded:", !!process.env.GOOGLE_CLIENT_ID);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });