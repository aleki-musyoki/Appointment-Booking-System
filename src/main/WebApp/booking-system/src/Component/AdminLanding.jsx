import React, {useEffect, useState} from 'react';
import './css/Table.css';
import {Button, Card, Form, Tab, Table, Tabs} from 'react-bootstrap';
import {useAuth} from "../Context/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

const getAPI = 'http://localhost:8080/api/v1/getAllAppointments';
const sendEmailAPI = 'http://localhost:8080/sendMail';

const AdminLanding = () => {
    const [previousData, setPreviousData] = useState([]);
    const [upcomingData, setUpcomingData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [deletedData, setDeletedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const {logout} = useAuth();
    const navigate = useNavigate();

    const current = new Date();
    const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;

    async function fetchData() {
        await axios.get(getAPI)
            .then((res) => {
                sendAppointmentReminders(res.data);
                setAllData(res.data);
                setLoading(false);
                const resultFinal = res.data.map(({
                                                      appointmentID,
                                                      firstName,
                                                      lastName,
                                                      appointmentDate,
                                                      appointmentTime
                                                  }) =>
                    ({
                        appointmentID,
                        firstName,
                        lastName,
                        appointmentDate,
                        appointmentTime
                    }));


                const unsortedPrevious = resultFinal.filter(obj =>
                    Date.parse(obj.appointmentDate) < Date.parse(date)
                );

                const unsortedUpcoming = resultFinal.filter(obj =>
                    Date.parse(obj.appointmentDate) >= Date.parse(date)
                );

                const sortedPrevious = unsortedPrevious.sort((a, b) => a.appointmentID > b.appointmentID ? 1 : -1,);
                const sortedUpcoming = unsortedUpcoming.sort((a, b) => a.appointmentID > b.appointmentID ? 1 : -1,);
                setPreviousData(sortedPrevious);
                setUpcomingData(sortedUpcoming);
                setLoading(false);
            })
            .catch(err => {
                console.log(err)
            });
    }

    console.log(allData)

    useEffect(() => {
        fetchData();
        sendAppointmentReminders(allData);
    }, []);

    if (!previousData) return null;

    async function handleLogout() {
        setError('');

        try {
            await logout();
            navigate('/login');
        } catch {
            setError('Failed to log out')
        }
    }

    function deleteAppointment(appointmentInfo) {
        setDeletedData(appointmentInfo);
        sendEmailAlert(allData, appointmentInfo.appointmentID);
        const deleteOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        const response = fetch(`http://localhost:8080/api/v1/deleteAppointment/?documentID=${appointmentInfo.appointmentID}`, deleteOptions)
            .then(response => console.log(response))
            .catch((error) => {
                console.log(error)
            });
        if (response.status === 200) {
            fetchData();
            window.location.reload(true);
        } else {
            console.log(response);
        }

    }

    async function sendAppointmentReminders(appointment) {

        try {
            let counter = 0;
            const finalData = Object.values(appointment).filter((info) =>
                new Date(info.appointmentDate).getDate() - new Date(date).getDate() === 1
            )
            const emailDetails = {
                "recipient": `${finalData[0].emailAddress}`,
                "msgBody": `Hello ${finalData[0].firstName},\n\nThis email is a reminder that your appointment is scheduled for tomorrow ${new Date(finalData[0].appointmentDate).toLocaleDateString()} at ${finalData[0].appointmentTime}.\n\n\nThanks,\nThe Clinic`,
                "subject": "Appointment Reminders"
            }
            console.log(emailDetails);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailDetails)
            }

            const response = await fetch(sendEmailAPI, options);

            if (response != null) {
                console.log('Success sending reminder email');
            } else {
                console.log('Error! Not Sent');
            }

        } catch (e) {
            console.log(e);
        }
    }

    async function sendEmailAlert(appointment, appointmentID) {
        const finalData = appointment.filter((info) =>
            info.appointmentID === appointmentID
        )
        console.log(finalData)
        const emailDetails = {
            "recipient": `${finalData[0].emailAddress}`,
            "msgBody": `Hello ${finalData[0].firstName},\n\nYour appointment scheduled for ${new Date(finalData[0].appointmentDate).toLocaleDateString()} at ${finalData[0].appointmentTime} has been cancelled because of unforeseen circumstances.\nIf you want to rebook it please visit us again.\n\n\nThanks,\nThe Clinic`,
            "subject": "Deleted Appointment"
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailDetails)
        }

        const response = await fetch(sendEmailAPI, options);
        if (response != null) {
            console.log('Success Delete  email sent');
        } else {
            console.log('Error! Not Sent');
        }

    }

    const renderPrevious = (displayData) => {
        return (
            <tr key={displayData.appointmentID}>
                <td>{displayData.appointmentID}</td>
                <td>{displayData.firstName}</td>
                <td>{displayData.lastName}</td>
                <td>{displayData.appointmentDate}</td>
                <td>{displayData.appointmentTime}</td>
                <td><Button onClick={() => deleteAppointment(displayData)}
                            style={{backgroundColor: '#E34234', borderColor: '#E34234'}}>Delete</Button></td>
            </tr>
        )
    }

    const renderUpcoming = (upcomingData) => {
        return (
            <tr key={upcomingData.appointmentID}>
                <td>{upcomingData.appointmentID}</td>
                <td>{upcomingData.firstName}</td>
                <td>{upcomingData.lastName}</td>
                <td>{upcomingData.appointmentDate}</td>
                <td>{upcomingData.appointmentTime}</td>
                <td><Link to={'/updateAppointment'} state={{appointmentID: upcomingData.appointmentID}}><Button
                    style={{
                        backgroundColor: '#11899D',
                        borderColor: '#11899D',
                        marginRight: '0.5em'
                    }}>Update</Button></Link>
                    <Button onClick={() => deleteAppointment(upcomingData)}
                            style={{backgroundColor: '#E34234', borderColor: '#E34234'}}>Delete</Button></td>
            </tr>
        )
    }

    const searchAppointment = (data) => {
        return data.filter((item) =>
            item.appointmentID.toLowerCase().includes(value) ||
            item.firstName.toLowerCase().includes(value) ||
            item.lastName.toLowerCase().includes(value)
        )
    }

    return (
        <>
            <div style={{display: 'inline', marginTop: '12em'}}>
                <div style={{float: "left"}}>
                    <Link to={'/createAppointment'}><Button
                        style={{backgroundColor: '#11899D', borderColor: '#11899D'}}>Create Appointment</Button> </Link>
                </div>

                <div style={{margin: 'auto', marginRight: '4em'}}>
                    <Form.Control type="text" name={"searchBar"} onChange={(e) => setValue(e.target.value)}
                                  placeholder="Search" className={'w-50'}
                                  style={{
                                      width: '50em',
                                      margin: 'auto',
                                      border: '2px solid rgba(56, 147, 175, 100%)',
                                      backgroundColor: 'rgba(56, 147, 175, 20%)'
                                  }}/>
                </div>

                <div style={{float: 'right', marginTop: '-2.4em'}}>
                    <Button style={{backgroundColor: '#E34234', borderColor: '#E34234'}} onClick={handleLogout}>Log
                        Out</Button>
                </div>
            </div>

            <Card style={{
                height: '85vh',
                marginTop: '1.5em',
                borderRadius: '1.7em',
                overflow: 'hidden',
                color: '#000000'
            }}>
                <Card.Body>
                    <Tabs justify variant={'pills'} defaultActiveKey={'tab-2'}>
                        <Tab eventKey={'tab-1'} title={'Previous Appointments'}
                             style={{backgroundColor: 'rgba(56, 147, 175, 20%) !important'}}>
                            <Table striped>
                                <thead>
                                <tr>
                                    <th scope={'col'}>Appointment ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Appointment Date</th>
                                    <th>Appointment Time</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {searchAppointment(previousData).map(renderPrevious)}
                                </tbody>
                            </Table>
                        </Tab>
                        <Tab eventKey={'tab-2'} title={'Upcoming Appointments'}>
                            <Table striped>
                                <thead>
                                <tr>
                                    <th>Appointment ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Appointment Date</th>
                                    <th>Appointment Time</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {searchAppointment(upcomingData).map(renderUpcoming)}
                                </tbody>
                            </Table>
                        </Tab>
                    </Tabs>

                </Card.Body>
            </Card>
        </>
    );
}

export default AdminLanding;