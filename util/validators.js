module.exports.validateRegisterInput = (
	username,
	email,
	password,
	confirmPassword
) => {
	const errors = {};
	if (username.trim() === "") {
		errors.username = "Nazwa użytkownika nie może być pusta";
	}
	if (email.trim() === "") {
		errors.email = "Adres email nie może być pusty";
	} else {
		const regex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
		if (!email.match(regex)) {
			errors.email = "Adres email musi być prawidłowy";
		}
	}
	if (password === "") {
		errors.password = "Hasło nie może być puste.";
	} else if (password !== confirmPassword) {
		errors.confirmPassword = "Hasła muszą być jednakowe";
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};

module.exports.validateLoginInput = (username, password) => {
	const errors = {};
	if (username.trim() === "") {
		errors.username = "Nazwa użytkownika nie może być pusta";
	}
	if (password.trim() === "") {
		errors.password = "Hasło nie może być puste";
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};
