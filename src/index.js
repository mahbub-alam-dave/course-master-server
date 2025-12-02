import express from "express"
import config from "./config/config.js";


const app = express();
const port = config.port || 3000



app.get("/", (req, res) => {
  res.send("🎓 Courser Master API is running...");
});

app.listen(port, () =>{
    console.log(`server is listening on port ${port}`)
})