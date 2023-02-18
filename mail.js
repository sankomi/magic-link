const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	secure: process.env.MAIL_SECURE,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

async function send(to, subject, body) {
	let info = await transporter.sendMail({
		from: process.env.MAIL_FROM,
		//to,
		to: process.env.TEST_MAIL,
		subject,
		text: body,
	});
}

async function sendHtml(to, subject, body) {
	let info = await transporter.sendMail({
		from: process.env.MAIL_FROM,
		//to,
		to: process.env.TEST_MAIL,
		subject,
		html: body,
	});
}

module.exports = {
	send,
	sendHtml,
}
