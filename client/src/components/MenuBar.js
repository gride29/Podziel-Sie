import React, { useState } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

function MenuBar() {
	const pathname = window.location.pathname;
	// Login
	const path = pathname === "/" ? "home" : pathname.substr(1);
	const [activeItem, setActiveItem] = useState(path);

	const handleItemClick = (e, { name }) => setActiveItem(name);

	return (
		<Menu pointing secondary size="massive" color="teal">
			<Menu.Item
				name="Home"
				content="Strona główna"
				active={activeItem === "home"}
				onClick={handleItemClick}
				as={Link}
				to="/"
			/>
			<Menu.Menu position="right">
				<Menu.Item
					name="Login"
					content="Logowanie"
					active={activeItem === "login"}
					onClick={handleItemClick}
					as={Link}
					to="/login"
				/>
				<Menu.Item
					name="Register"
					content="Rejestracja"
					active={activeItem === "register"}
					onClick={handleItemClick}
					as={Link}
					to="/register"
				/>
			</Menu.Menu>
		</Menu>
	);
}

export default MenuBar;
