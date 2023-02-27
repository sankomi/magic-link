const sqlite = new require("./sqlite");
const db = sqlite.open("magic");

db.run(
	`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT,
		username TEXT
	);`
)

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
		"SELECT email FROM users WHERE email = ?1;",
		[email],
	);

	if (result) return {success: true, message: "email checked!"};
	else return {success: false, message: "email does not exist!"};
}

module.exports = {
	addUser,
	checkEmail,
};
