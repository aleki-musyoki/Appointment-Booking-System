import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import React from "react";
import NormalLanding from "./Component/NormalLanding";
import Signup from "./Component/SignUpComponent/Signup";
import Login from "./Component/LoginComponent/Login";
import {Container} from "react-bootstrap";
import {AuthProvider, useAuth} from "./Context/AuthContext";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import PrivateRoute from "./Component/PrivateRoute";
import CreateAppointment from "./Component/CreateAppointment";
import UpdateAppointment from "./Component/UpdateAppointment";
import AdminLanding from "./Component/AdminLanding";

function App() {
    const {currentUser} = useAuth();
    return (
        <div className='App' style={{backgroundColor: '#CBD6D8'}}>
            <AuthProvider>
                <Container
                    className={"d-flex align-items-center justify-content-center"}
                    style={{minHeight: '100vh'}}>
                    <div className={"w-100"}>
                        <Router>
                            <AuthProvider>
                                <Routes>
                                    <Route exact path="/" element={<PrivateRoute/>}>
                                        <Route path={'/'} element={
                                            currentUser && currentUser.email === 'tester15@gmail.com' ?
                                                (<AdminLanding/>)
                                                :
                                                (<Navigate to={'/normalLanding'} replace/>)}/>
                                        <Route path={'/normalLanding'} element={<NormalLanding/>}/>
                                        <Route path={'/createAppointment'} element={<CreateAppointment/>}/>
                                        <Route path={'/updateAppointment'} element={<UpdateAppointment/>}/>
                                    </Route>
                                    <Route path="/signup" element={<Signup/>}/>
                                    <Route path="/login" element={<Login/>}/>
                                </Routes>
                            </AuthProvider>
                        </Router>
                    </div>

                </Container>
            </AuthProvider>
        </div>
    );


}

export default App;
