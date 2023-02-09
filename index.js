const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const db = []; //temp

app.post("/api/user/create/", (req, res) => {
	const email = req.body.email;
	const name = req.body.name;

	if (!email || !name) {
		console.error("email and/or name missing!")
		return res.json({
			success: false,
			message: "email and/or name missing!",
		});
	}

	db.push({email, name});
	res.json({
		success: true,
		message: "user created!",
	});
});

app.all("*", (req, res) => {
	res.sendStatus(404);
});

app.listen(port, () => console.log(`on ${port}`));
