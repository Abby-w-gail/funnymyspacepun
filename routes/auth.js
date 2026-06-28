const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const db = require("../database");

router.post("/register", async (req, res) => {
	try {
		const username = req.body.username;
		const password = req.body.password;

		if (!username || !password) {
			return res.status(400).json({
				error: "username and password required"
			});
		}

		const existingUser = await db.query(
			"SELECT id FROM users WHERE username = $1",
			[username]
		);

		if (existingUser.rows.length > 0) {
			return res.status(400).json({
				error: "username already exists"
			});
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const result = await db.query(
			"INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
			[
				username,
				passwordHash
			]
		);

		res.json({
			message: "account created",
			user: result.rows[0]
		});

	} catch (error) {
		console.log(error);

		res.status(500).json({
			error: "server error"
		});
	}
});


router.post("/login", async (req, res) => {
	try {
		const username = req.body.username;
		const password = req.body.password;

		const result = await db.query(
			"SELECT * FROM users WHERE username = $1",
			[username]
		);

		if (result.rows.length === 0) {
			return res.status(400).json({
				error: "incorrect username or password"
			});
		}

		const user = result.rows[0];

		const passwordCorrect = await bcrypt.compare(
			password,
			user.password_hash
		);

		if (!passwordCorrect) {
			return res.status(400).json({
				error: "incorrect username or password"
			});
		}

		req.session.user = {
			id: user.id,
			username: user.username
		};

		res.json({
			message: "logged in",
			user: req.session.user
		});

	} catch (error) {
		console.log(error);

		res.status(500).json({
			error: "server error"
		});
	}
});


router.post("/logout", (req, res) => {
	req.session.destroy(() => {
		res.json({
			message: "logged out"
		});
	});
});


router.get("/me", (req, res) => {
	if (!req.session.user) {
		return res.json({
			loggedIn: false
		});
	}

	res.json({
		loggedIn: true,
		user: req.session.user
	});
});


module.exports = router;