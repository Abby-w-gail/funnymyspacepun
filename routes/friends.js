const express = require("express");

const router = express.Router();

const db = require("../database");


// send friend request
router.post("/request/:username", async (req, res) => {

	try {

		const sender = req.session.user.id;

		if (!sender) {
			return res.status(401).json({
				error: "not logged in"
			});
		}


		const userResult = await db.query(
			`
			SELECT id FROM users
			WHERE username = $1
			`,
			[
				req.params.username
			]
		);


		if (userResult.rows.length === 0) {
			return res.status(404).json({
				error: "user not found"
			});
		}


		const receiver = userResult.rows[0].id;


		await db.query(
			`
			INSERT INTO friendships
			(user_id, friend_id)
			VALUES ($1, $2)
			`,
			[
				sender,
				receiver
			]
		);


		res.json({
			message: "friend request sent"
		});


	} catch (err) {

		console.log(err);

		res.status(500).json({
			error: "server error"
		});

	}

});




// view incoming requests
router.get("/requests", async (req, res) => {

	try {

		const userId = req.session.user.id;

		console.log("checking requests for user:", userId);


		const result = await db.query(
			`
			SELECT
				users.username,
				friendships.created_at

			FROM friendships

			JOIN users
			ON users.id = friendships.user_id

			WHERE friendships.friend_id = $1
			AND friendships.status = 'pending'
			`,
			[
				userId
			]
		);


		console.log("found requests:", result.rows);


		res.json(result.rows);


	} catch(err) {

		console.log(err);

		res.status(500).json({
			error:"server error"
		});

	}

});



// accept request
router.post("/accept/:username", async(req,res)=>{

	try {

		const userId = req.session.user.id;


		const result = await db.query(
			`
			UPDATE friendships

			SET status='accepted'

			WHERE user_id = (
				SELECT id
				FROM users
				WHERE username=$1
			)

			AND friend_id=$2

			RETURNING *
			`,
			[
				req.params.username,
				userId
			]
		);


		console.log("accepted:", result.rows);


		res.json({
			message:"friend accepted"
		});


	} catch(err){

		console.log(err);

		res.status(500).json({
			error:"server error"
		});

	}

});




// list friends
router.get("/list", async(req,res)=>{

	try {

		const userId = req.session.user.id;


		const result = await db.query(
			`
			SELECT 
				users.username

			FROM friendships

			JOIN users

			ON users.id = friendships.user_id

			WHERE friendships.friend_id = $1
			AND friendships.status = 'accepted'


			UNION


			SELECT 
				users.username

			FROM friendships

			JOIN users

			ON users.id = friendships.friend_id

			WHERE friendships.user_id = $1
			AND friendships.status = 'accepted'
			`,
			[
				userId
			]
		);


		console.log("friends found:", result.rows);


		res.json(result.rows);


	} catch(err) {

		console.log(err);

		res.status(500).json({
			error:"server error"
		});

	}

});


module.exports = router;