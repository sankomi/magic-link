require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/api/", require("./api"));

app.all("*", (req, res) => {
	res.sendStatus(404);
});

app.listen(port, () => console.log(`on ${port}`));
