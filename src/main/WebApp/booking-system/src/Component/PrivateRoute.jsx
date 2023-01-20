import React from "react";
import {useAuth} from "../Context/AuthContext";
import {Navigate, Outlet} from "react-router-dom";

const PrivateRoute = (props: any) => {
    const {currentUser} = useAuth();

    return currentUser ? <Outlet/> : <Navigate to={'/login'}/>

}

export default PrivateRoute;