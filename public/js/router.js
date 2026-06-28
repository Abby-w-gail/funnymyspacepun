const content = document.getElementById("content");


function goToPage(page) {

	if (page !== "profile") {

		removeProfileCSS();

	}


	const template = document.getElementById(
		"page-" + page
	);


	if (!template) {
		console.log("page does not exist:", page);
		return;
	}


	content.innerHTML = template.innerHTML;
	
	
	window.addEventListener(
		"load",
		()=>{

			const path =
			window.location.pathname;


			if(
				path !== "/" &&
				path.length > 1
			){

				const username =
				path.substring(1);


				viewProfile(username);

			}

		}
	);

	updatePage(page);

}


function updatePage(page) {

	document
		.querySelectorAll("#navbar button")
		.forEach(button => {
			button.classList.remove("active");
		});
		
	if (page === "profile") {
		loadMyProfile();
	}
	
	if (page === "settings") {
		loadProfileEditor();
	}
	
	if (page === "discover") {
		loadDiscover();
	}
	
	if(page === "friends") {
		loadFriends();

		loadFriendRequests();
	}
	
	if(page === "messages") {
		loadMessageUsers();
	}


	const pages = {
		home: "Home",
		profile: "Profile",
		discover: "Discover",
		messages: "Messages",
		settings: "Settings"
	};


	if (pages[page]) {

		document
			.querySelectorAll("#navbar button")
			.forEach(button => {

				if (button.innerText === pages[page]) {
					button.classList.add("active");
				}

			});

	}
}




function showLoginPage() {

	const template = document.getElementById(
		"page-login"
	);


	content.innerHTML = template.innerHTML;

}


window.addEventListener("load", () => {

	const path = window.location.pathname;


	if (
		path !== "/" &&
		path.length > 1
	) {

		const username =
			path.substring(1);


		viewProfile(username);

	}

});