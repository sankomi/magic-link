{
	const login = localStorage.getItem("token");
	if (login === null) {
		location.replace("/login.html");
	}
}
