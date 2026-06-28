async function register() {
	const username = document.getElementById("registerUsername").value;
	const password = document.getElementById("registerPassword").value;

	const response = await fetch("/auth/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			username: username,
			password: password
		})
	});

	const data = await response.json();

	document.getElementById("message").innerText =
		data.message || data.error;
}


async function login() {
	const username = document.getElementById("loginUsername").value;
	const password = document.getElementById("loginPassword").value;

	const response = await fetch("/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		credentials: "include",
		body: JSON.stringify({
			username: username,
			password: password
		})
	});

	const data = await response.json();

	document.getElementById("message").innerText =
		data.message || data.error;

	checkLogin();
	updateUI();
}


async function logout() {
	const response = await fetch("/auth/logout", {
		method: "POST",
		credentials: "include"
	});

	const data = await response.json();

	document.getElementById("message").innerText =
		data.message;

	checkLogin();
	updateUI();
}


async function checkLogin() {
	const response = await fetch("/auth/me", {
		credentials: "include"
	});

	const data = await response.json();

	if (data.loggedIn) {
		document.getElementById("status").innerText =
			"logged in as: " + data.user.username;
	} else {
		document.getElementById("status").innerText =
			"not logged in";
	}
}


checkLogin();