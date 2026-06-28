const express = require("express");

const router = express.Router();

const db = require("../database");


router.get("/me", async (req, res) => {

	if (!req.session.user) {
		return res.status(401).json({
			error: "not logged in"
		});
	}


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

});



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

});



router.get("/:username", async (req, res) => {

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

});

router.get("/discover", async (req, res) => {

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

});



router.get("/search/:username", async (req, res) => {

	const result = await db.query(
		`
		SELECT
			username
		FROM users
		WHERE username ILIKE $1
		LIMIT 20
		`,
		[
			"%" + req.params.username + "%"
		]
	);


	res.json(result.rows);

});

module.exports = router;