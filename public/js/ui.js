async function updateUI() {

	const response = await fetch("/auth/me", {
		credentials: "include"
	});

	const data = await response.json();

	const loginStatus =
		document.getElementById("loginStatus");

	const logoutButton =
		document.getElementById("logoutButton");

	if (data.loggedIn) {

		loginStatus.innerText =
			"logged in as " + data.user.username;

		logoutButton.style.display =
			"block";

		goToPage("home");

	} else {

		loginStatus.innerText =
			"not logged in";

		logoutButton.style.display =
			"none";

		showLoginPage();
	}

}


function setStatus(text) {

	document.getElementById(
		"statusText"
	).innerText = text;

}


window.addEventListener(
	"load",
	updateUI
);