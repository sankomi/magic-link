{
	const token = sessionStorage.getItem("token");
	if (token) {
		fetch(`/api/user/check/?token=${token}`)
			.then(res => res.json())
			.then(json => {
				if (!json.success) {
					location.replace("/login.html");
				}
			})
			.catch(console.error);
	} else {
		location.replace("/login.html");
	}
}
