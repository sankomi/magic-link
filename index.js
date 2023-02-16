require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const mail = require("./mail");
const db = []; //temp

app.post("/api/user/create/", async (req, res) => {
	const email = req.body.email;
	const name = req.body.name;

	if (!email || !name) {
		console.error("email and/or name missing!")
		return res.json({
			success: false,
			message: "email and/or name missing!",
		});
	}

	console.log("adding user to db...");
	db.push({email, name});
	console.log("added!");
	
	console.log("sending welcome email...");
	await mail.send(email, `welcome ${name}!`, ":)");
	console.log("sent!");

	console.log("responding to request...");
	res.json({
		success: true,
		message: "user created!",
	});
	console.log("responded!");
});

app.all("*", (req, res) => {
	res.sendStatus(404);
});

app.listen(port, () => console.log(`on ${port}`));
