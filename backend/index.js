import express from "express";
import mainRouter from "./routes/index.js";
import cors from "cors";
import { connectDb } from "./models/index.js";

const app = express();

app.use(cors({
    origin: "*",
    methods: ['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true
}));

app.use(express.json());

app.use("/api/v1", mainRouter);

app.get('/', (req, res) => {
    res.send("Hi There!");
});

const PORT = 3000;
app.listen(PORT, () => {
    connectDb();
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
