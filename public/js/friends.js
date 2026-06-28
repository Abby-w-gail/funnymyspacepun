async function sendFriendRequest(username) {

	const response = await fetch(
		"/friends/request/" + username,
		{
			method: "POST",
			credentials: "include"
		}
	);

	const data = await response.json();

	alert(data.message || data.error);

}

async function loadFriends() {

	const response = await fetch(
		"/friends/list",
		{
			credentials: "include"
		}
	);


	const friends = await response.json();


	const container =
		document.getElementById(
			"friendsList"
		);


	container.innerHTML = "";


	friends.forEach(friend => {

		container.innerHTML += `

			<div class="friend-card">

				<a href="#"
				onclick="viewProfile('${friend.username}')">

					${friend.username}

				</a>
			</div>
		`;

	});

	if (friends.length === 0) {

		container.innerHTML =
			"No friends yet :(";
	}
}


async function loadFriendRequests() {


	const response = await fetch(
		"/friends/requests",
		{
			credentials:"include"
		}
	);

	const requests =
		await response.json();

	const container =
		document.getElementById(
			"friendRequests"
		);

	container.innerHTML = "";

	requests.forEach(request => {
		container.innerHTML += `


			<div class="friend-request">


				${request.username}


				<button onclick="acceptFriend('${request.username}')">

					accept

				</button>


			</div>
		`;
	});


	if(requests.length === 0){

		container.innerHTML =
			"No requests";
	}

}

async function acceptFriend(username) {


	const response = await fetch(

		"/friends/accept/" + username,

		{

			method:"POST",

			credentials:"include"

		}

	);


	const data = await response.json();


	alert(data.message || data.error);


	// refresh both sections
	loadFriendRequests();
	loadFriends();

}