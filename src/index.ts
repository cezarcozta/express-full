import express, { Request, Response } from "express";
import leadsRoute from "./routes/route.js";

const app = express();
const port = process.env.PORT ?? "9001";

app.use(express.json({ limit: "1mb" }));

app.use("/leads", leadsRoute);

app.get("/start", (request: Request, response: Response) => {
  response.status(202).json({ message: "started" });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
