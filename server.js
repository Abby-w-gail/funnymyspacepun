const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");

dotenv.config();

const app = express();

app.use(cors({
	origin: [
		"http://localhost:3000",
		"https://space.abbyw.net"
	],
	credentials: true
}));
app.use(express.json());

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 365
	}
}));

/* login lasts 365 days max */

app.get("/", (req, res) => {

	res.sendFile(
		__dirname + "/public/index.html"
	);

});


app.use(express.static("public"));


app.get("/:username", (req, res) => {

	res.sendFile(
		__dirname + "/public/index.html"
	);

});

const db = require("./database");

db.query("SELECT NOW()", (err, result) => {
	if (err) {
		console.log(err);
	} else {
		console.log("Database connected:", result.rows[0]);
	}
});

const authRoutes = require("./routes/auth");

const profileRoutes = require("./routes/profiles");

const friendRoutes = require("./routes/friends");



app.use("/auth", authRoutes);

app.use("/profiles", profileRoutes);

app.use("/friends", friendRoutes);


app.get("/debug-session", (req,res)=>{
	res.json(req.session);
});
	

app.use((err, req, res, next) => {
	console.error("==== SERVER ERROR ====");
	console.error(err.stack);
	res.status(500).send("internal server error");
});



/* this should be at bottom please */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});

/* server connection set ^w^ */

