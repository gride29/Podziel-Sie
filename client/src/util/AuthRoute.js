import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/auth";

function AuthRoute({ component: Component, ...rest }) {
	const { user } = useContext(AuthContext);

	return (
		<Route
			// Spread whatever Route is wrapped by.
			{...rest}
			// If user was successfully authenticated redirect to /, when user goes /login OR /register.
			// If user wasn't successfully authenticated just render the component in properties.
			render={(props) =>
				user ? <Redirect to="/" /> : <Component {...props} />
			}
		/>
	);
}

export default AuthRoute;
