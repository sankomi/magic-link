const express = require("express");
const router = express.Router();

const mail = require("./mail");
const db = require("./db");
const ress = new Map();
let t = 0; //temp

router.post("/user/create/", async (req, res) => {
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
	const added = await db.addUser(email, name);
	if (!added.success) {
		console.log(added.message);
		return res.json({
			success: false,
			message: added.message,
		});
	}
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

router.post("/user/login", async (req, res) => {
	const email = req.body.email?.trim().toLowerCase();

	console.log("checking if email exists...");
	const checked = await db.checkEmail(email);
	if (!checked.success) {
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

router.get("/user/link", (req, res) => {
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

module.exports = router;
