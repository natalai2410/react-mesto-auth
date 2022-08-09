import React from "react";
import Route from "react-router-dom/es/Route";
import Redirect from "react-router-dom/es/Redirect";


const ProtectedRoute = ({ component: Component, ...props }) => {
    return (
        <Route>
            {props.LoggedIn  ? <Component {...props} /> : <Redirect to="/signin"/> }
        </Route>
    )
};

export default ProtectedRoute;
