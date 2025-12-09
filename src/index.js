// api/index.js
import serverless from "serverless-http";
import app from "./server.js";
import { dbConnect } from "./helpers/dbConnect.js";
import config from "./config/config.js";

const port = config.port || 5000

export const handler = serverless(app);
export default handler;

// Start server only after DB connects
const startServer = async () => {
  try {
    await dbConnect();
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1); // Stop the app
  }
};

startServer();