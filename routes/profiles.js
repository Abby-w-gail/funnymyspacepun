const express = require("express");
const router = express.Router();

const db = require("../database");


// =========================
// Current user's profile
// =========================

router.get("/me", async (req, res) => {

	if (!req.session.user) {
		return res.status(401).json({
			error: "not logged in"
		});
	}

	try {

		const result = await db.query(
			`
			SELECT
				username,
				profile_html,
				profile_css,
				created_at
			FROM users
			WHERE id = $1
			`,
			[
				req.session.user.id
			]
		);

		res.json(result.rows[0]);

	}
	catch (err) {

		console.error(err);

		res.status(500).json({
			error: "server error"
		});

	}

});


// =========================
// Update own profile
// =========================

router.post("/update", async (req, res) => {

	if (!req.session.user) {
		return res.status(401).json({
			error: "not logged in"
		});
	}

	const {
		html,
		css
	} = req.body;

	try {

		await db.query(
			`
			UPDATE users
			SET
				profile_html = $1,
				profile_css = $2
			WHERE id = $3
			`,
			[
				html,
				css,
				req.session.user.id
			]
		);

		res.json({
			message: "profile updated"
		});

	}
	catch (err) {

		console.error(err);

		res.status(500).json({
			error: "server error"
		});

	}

});


// =========================
// Discover newest users
// =========================

router.get("/discover", async (req, res) => {

	try {

		const result = await db.query(
			`
			SELECT
				username,
				created_at
			FROM users
			ORDER BY created_at DESC
			LIMIT 10
			`
		);

		res.json(result.rows);

	}
	catch (err) {

		console.error(err);

		res.status(500).json({
			error: "server error"
		});

	}

});


// =========================
// Search users
// =========================

router.get("/search/:username", async (req, res) => {

	try {

		const result = await db.query(
			`
			SELECT
				username,
				created_at
			FROM users
			WHERE username ILIKE $1
			ORDER BY username
			LIMIT 20
			`,
			[
				"%" + req.params.username + "%"
			]
		);

		res.json(result.rows);

	}
	catch (err) {

		console.error(err);

		res.status(500).json({
			error: "server error"
		});

	}

});


// =========================
// View someone's profile
// MUST BE LAST!
// =========================

router.get("/:username", async (req, res) => {

	try {

		const result = await db.query(
			`
			SELECT
				username,
				profile_html,
				profile_css,
				created_at
			FROM users
			WHERE username = $1
			`,
			[
				req.params.username
			]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({
				error: "user not found"
			});
		}

		res.json(result.rows[0]);

	}
	catch (err) {

		console.error(err);

		res.status(500).json({
			error: "server error"
		});

	}

});


module.exports = router;