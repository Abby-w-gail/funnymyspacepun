async function loadMyProfile() {

	const response = await fetch(
		"/profiles/me",
		{
			credentials: "include"
		}
	);

	const data = await response.json();

	if (data.error) {
		document.getElementById("profileView").innerHTML = `
			<h1>Error</h1>
			<p>${data.error}</p>
		`;
		return;
	}


	document.getElementById("profileView").innerHTML = `

		<div id="profile-page">

			${data.profile_html}

		</div>

	`;


	let oldStyle = document.getElementById(
		"user-profile-style"
	);


	if (oldStyle) {
		oldStyle.remove();
	}


	let style = document.createElement("style");

	style.id = "user-profile-style";

	style.innerHTML = data.profile_css;

	document.head.appendChild(style);

}

function removeProfileCSS() {

	const oldStyle = document.getElementById(
		"user-profile-style"
	);


	if (oldStyle) {
		oldStyle.remove();
	}

}

async function loadProfileEditor() {

	const response = await fetch(
		"/profiles/me",
		{
			credentials: "include"
		}
	);


	const data = await response.json();


	document.getElementById(
		"settingsContent"
	).innerHTML = `

		<h2>Profile Editor</h2>


		<h3>HTML</h3>

		<textarea id="profileHTML">${data.profile_html}</textarea>


		<h3>CSS</h3>

		<textarea id="profileCSS">${data.profile_css}</textarea>


		<button onclick="saveProfile()">
			save profile
		</button>

	`;

}


async function saveProfile() {

	const html =
		document.getElementById("profileHTML").value;


	const css =
		document.getElementById("profileCSS").value;


	const response = await fetch(
		"/profiles/update",
		{
			method: "POST",

			headers: {
				"Content-Type": "application/json"
			},

			credentials: "include",

			body: JSON.stringify({
				html: html,
				css: css
			})
		}
	);


	const data = await response.json();

	alert(data.message);

	loadMyProfile();

}

async function viewProfile(username) {

	removeProfileCSS();

	const response = await fetch(
		"/profiles/" + username
	);

	const data = await response.json();

	content.innerHTML = `

		<div class="page">

			<div id="profileView">

				<div id="profile-page">

					${data.profile_html}

				</div>
			</div>
		</div>
	`;

	const style =
		document.createElement("style");

	style.id =
		"user-profile-style";

	style.innerHTML =
		data.profile_css;

	document.head.appendChild(style);

}