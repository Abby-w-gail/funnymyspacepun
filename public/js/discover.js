async function loadDiscover() {

	const response = await fetch(
		"/profiles/discover"
	);

	const users = await response.json();

console.log("DISCOVER RESPONSE:", users);

	const list =
		document.getElementById(
			"discoverList"
		);

	list.innerHTML = "";

	users.forEach(user => {

		list.innerHTML += `

			<p>

				<div class="user-card">


				<a href="#"
				onclick="viewProfile('${user.username}')">

				${user.username}

				</a>


				<button onclick="sendFriendRequest('${user.username}')">

					add friend

				</button>


				</div>

				<br>

				<small>
					joined:
					${new Date(user.created_at)
					.toLocaleDateString()}
				</small>
			</p>
		`;
	});
}


async function searchUsers() {

	const username =
		document.getElementById(
			"userSearch"
		).value;

	const response = await fetch(
		"/profiles/search/" + username
	);

	const users = await response.json();

	const list =
		document.getElementById(
			"discoverList"
		);


	list.innerHTML = "";

	users.forEach(user => {

		list.innerHTML += `

		<p>

			<a href="#"
			onclick="viewProfile('${user.username}')">

			${user.username}

			</a>

		</p>

		`;
	});
}