require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const mail = require("./mail");
const db = []; //temp
const ress = new Map();
let t = 0; //temp

app.post("/api/user/create/", async (req, res) => {
	const email = req.body.email?.trim().toLowerCase();
	const name = req.body.name?.trim().toLowerCase();

	if (!email || !name) {
		console.error("email and/or name missing!")
		return res.json({
			success: false,
			message: "email and/or name missing!",
		});
	}

	console.log("adding user to db...");
	if (db.includes(email)) {
		console.log("email already used!");
		return res.json({
			success: false,
			message: "email already used!",
		});
	}
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

function findEmail(email) {
	for (let i = 0; i < db.length; i++) {
		if (db[i].email === email) return true;
	}
	return false;
}

app.post("/api/user/login", async (req, res) => {
	const email = req.body.email?.trim().toLowerCase();

	console.log("checking if email exists...")
	if (!findEmail(email)) {
		console.log("email does not exist!");
		return res.json({
			success: false,
			message: "email does not exist!",
		});
	}
	console.log("checked!");

	console.log("creating token...");
	let token = t++;
	console.log("created!");

	console.log("sending link...");
	await mail.sendHtml(
		email,
		"magic link is here",
		`<a href="${process.env.BASE_URL}/api/user/link/?token=${token}">login</a>`,
	);
	console.log("sent!");

	console.log("waiting for click...");
	ress.set(token, res);
});

app.get("/api/user/link", (req, res) => {
	const token = +req.query.token;

	console.log("check if token exists...");
	if (!ress.has(token)) {
		console.log("token does not exist!");
		return res.json({
			success: false,
			message: "token does not exist!",
		});
	}
	console.log("checked!");

	console.log("logging in...");
	ress.get(token).json({
		success: true,
		token,
		message: "logged in!",
	});
	console.log("waited!");
	console.log("logged in!");

	console.log("responding to request...");
	res.json({
		success: true,
		message: "logged in!",
	});
	console.log("responded!");
});

app.all("*", (req, res) => {
	res.sendStatus(404);
});

app.listen(port, () => console.log(`on ${port}`));
