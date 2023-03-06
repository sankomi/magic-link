const sqlite = new require("./sqlite");
const db = sqlite.open("magic");

db.run(
	`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT,
		username TEXT
	);`
);
db.run(
	`CREATE TABLE IF NOT EXISTS texts (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		user INTEGER,
		text TEXT
	);`
);

async function addUser(email, username) {
	const result = await db.get(
		"SELECT email, username FROM users WHERE email = ?1;",
		[email],
	);

	if (result) return {success: false, message: "email already used!"};

	const added = await db.run(
		"INSERT INTO users (email, username) VALUES (?1, ?2);",
		[email, username],
	);

	return {success: true, message: "user added!"};
}

async function checkEmail(email) {
	const result = await db.get(
		"SELECT id FROM users WHERE email = ?1;",
		[email],
	);

	if (result) return {
		success: true,
		id: result.id,
		message: "email checked!",
	};
	else return {success: false, message: "email does not exist!"};
}

async function findUsername(id) {
	const result = await db.get(
		"SELECT username FROM users WHERE id = ?1;",
		[id],
	);

	if (result) return {
		success: true,
		username: result.username,
		message: "username found!",
	};
	else return {success: false, message: "username not found!"};
}

async function listTexts(userId) {
	const results = await db.all(
		"SELECT id, text FROM texts WHERE user = ?1 ORDER BY id DESC;",
		[userId],
	);

	if (results) return {
		success: true,
		texts: results,
		message: "texts listed!",
	};
	else return {success: false, message: "texts not found!"};
}

async function addText(userId, text) {
	const result = await db.run(
		"INSERT INTO texts (user, text) VALUES (?1, ?2);",
		[userId, text],
	);

	if (result) return {success: true, message: "text added!"};
	else return {success: false, message: "text not added!"};
}

async function deleteText(userId, textId) {
	const result = await db.run(
		"DELETE FROM texts WHERE id = ?1 AND user = ?2;",
		[textId, userId],
	);

	if (result) return {success: true, message: "text deleted!"};
	else return {success: false, message: "text not deleted!"};
}

module.exports = {
	addUser,
	checkEmail,
	findUsername,
	listTexts,
	deleteText,
	addText,
};
