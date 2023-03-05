{
	const login = sessionStorage.getItem("token");
	if (login === null) {
		location.replace("/login.html");
	}
}
