import React, {useEffect, useState} from "react";
import './css/create.css';
import {Button, Card, Form} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {GrLinkPrevious} from "react-icons/all";


const UpdateAppointment = () => {
    const [data, setData] = useState('');
    const [errors, setErrors] = useState('')
    const appID = useLocation();
    const navigate = useNavigate();
    const current = new Date();
    const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;
    const time = `${current.getTime()}`;

    const updateAPI = 'http://localhost:8080/api/v1/updateAppointment';
    const sendEmailAPI = 'http://localhost:8080/sendMail';

    async function updateAppointment(appointment) {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointment)
        }
        const response = await fetch(updateAPI, options);
        if (response != null) {
            sendEmailAlert(appointment);
            navigate('/');
        } else {
            console.log(response.status);
        }
    }

    async function fetchAppointmentData() {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
        await fetch(`http://localhost:8080/api/v1/getSpecificAppointment/?documentID=${appID.state.appointmentID}`, options)
            .then(response => response.json())
            .then(appInfo => setData(appInfo))
            .catch((error) => {
                console.log(error);
            });
    }

    async function sendEmailAlert(appointment){
        const emailDetails = {
            "recipient": `${appointment.emailAddress}`,
            "msgBody": `Hello ${appointment.firstName},\n\nThere has been a change in your appointment.\n\n\nYour appointment is now scheduled at ${appointment.appointmentTime} on ${new Date(appointment.appointmentDate).toLocaleDateString()}.\n\n\nThank you for choosing The Clinic.\n
                \nThanks,\nThe Clinic`,
            "subject": "Updated Appointment Details"
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailDetails)
        }

        const response = await fetch(sendEmailAPI, options);
        if(response != null){
            console.log('Success');
        }else{
            console.log('Error! Not Sent');
        }

    }

    console.log(data);

    useEffect(() => {
        fetchAppointmentData()
    }, []);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        const currentInputFieldData = {
            [name]: value
        }

        const updatedData = {
            ...data,
            ...currentInputFieldData
        }
        setData(updatedData);

        if (!!errors[name]) setErrors({
            ...errors,
            [name]: null
        })
    }

    const findFormErrors = () => {
        const {
            appointmentID,
            firstName,
            middleName,
            lastName,
            phoneNumber,
            emailAddress,
            age,
            appointmentDate,
            appointmentTime
        } = data;
        const newErrors = {};

        if (!appointmentID || appointmentID === '') newErrors.appointmentID = 'Cannot be blank';
        else if (appointmentID.length > 5) newErrors.appointmentID = 'name is too long';

        //First name errors
        if (!firstName || firstName === '') newErrors.firstName = 'Cannot be blank';
        else if (firstName.length > 15) newErrors.firstName = 'name is too long';

        if (!middleName || middleName === '') newErrors.middleName = 'Cannot be blank';
        else if (middleName.length > 15) newErrors.middleName = 'name is too long';

        if (!lastName || lastName === '') newErrors.lastName = 'Cannot be blank';
        else if (lastName.length > 15) newErrors.lastName = 'name is too long';

        if (!phoneNumber || phoneNumber === '') newErrors.phoneNumber = 'Cannot be blank';
        else if (phoneNumber.length > 10) newErrors.phoneNumber = 'phone number is too long';

        if (!age || age === '') newErrors.age = 'Cannot be blank';
        else if (age.length > 2) newErrors.age = 'Cannot be older than 100';

        if (!emailAddress || emailAddress === '') newErrors.emailAddress = 'Cannot be blank';

        if (!appointmentDate || appointmentDate === '') newErrors.appointmentDate = 'Cannot be blank'
        else if (appointmentDate < date) newErrors.appointmentDate = 'Cannot set date older than today'

        if (!appointmentTime || appointmentTime === '') newErrors.appointmentTime = 'Cannot be blank'
        else if (+appointmentDate === +date && appointmentTime < time) newErrors.appointmentTime = 'Cannot set a time in the past'

        return newErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = findFormErrors();

        if (Object.keys(newErrors).length > 0)
            setErrors(newErrors);

        updateAppointment(data);
    }

    return (
        <>
            <Link to={'/'}><GrLinkPrevious size={25} id={"icon"}/></Link>
            <Card
                style={{
                    height: '85vh',
                    marginTop: '1.5em',
                    borderRadius: '1.7em',
                    overflow: 'hidden',
                    color: '#000000'
                }}>
                <Card.Body>
                    <div>
                        <div style={{
                            backgroundColor: '#11899D',
                            float: 'left',
                            width: '25%',
                            height: '85vh',
                            marginTop: '-1.1em',
                            marginLeft: '-1.2em'
                        }}>
                            <p style={{margin: 'auto', lineHeight: '80vh', color: '#FFFFFF'}}>Update Appointment</p>
                        </div>
                        <div style={{float: 'right', width: '75%', height: '85vh'}}>
                            <p><strong style={{fontSize: '1.2em', width: '50%', marginLeft: '-39em'}}>Update
                                Appointment: </strong></p>
                            <Form onSubmit={handleSubmit} style={{height: '81vh', marginTop: '1.2em'}}>
                                <div>
                                    <Form.Group className="mb-3" controlId="formFirstName"
                                                style={{width: '100%', float: 'left'}}>
                                        <Form.Label>Appointment ID</Form.Label>
                                        <Form.Control type="text" name={"appointmentID"} value={data.appointmentID}
                                                      onChange={handleChange}
                                                      placeholder="Appointment ID" style={{
                                            width: '30%',
                                            backgroundColor: 'rgba(56, 147, 175, 20%)'
                                        }}/>
                                    </Form.Group>
                                </div>
                                <div className={'w-100'}>
                                    <Form.Group className="mb-3" controlId="formFirstName"
                                                style={{width: '30%', float: 'left'}}>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" name={"firstName"} value={data.firstName}
                                                      onChange={handleChange}
                                                      placeholder="First Name"
                                                      style={{backgroundColor: 'rgba(56, 147, 175, 20%)'}}
                                                      isInvalid={!!errors.firstName}/>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.firstName}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formMidName"
                                                style={{width: '30%', float: 'left', marginLeft: '3em'}}>
                                        <Form.Label>Middle Name</Form.Label>
                                        <Form.Control type="text" name={"middleName"} value={data.middleName}
                                                      onChange={handleChange}
                                                      placeholder="Middle Name"
                                                      style={{backgroundColor: 'rgba(56, 147, 175, 20%)'}}
                                                      isInvalid={!!errors.middleName}/>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.middleName}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formLastName"
                                                style={{width: '30%', float: 'right', marginLeft: '-1.2em'}}>
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" name={"lastName"} value={data.lastName}
                                                      onChange={handleChange}
                                                      placeholder="Last Name"
                                                      style={{backgroundColor: 'rgba(56, 147, 175, 20%)'}}
                                                      isInvalid={!!errors.lastName}/>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.lastName}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>

                                <div className={'w-100'}>
                                    <Form.Group className="mb-3" controlId="formFirstName"
                                                style={{width: '30%', float: 'left'}}>
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control type="text" name={"phoneNumber"} value={data.phoneNumber}
                                                      onChange={handleChange}
                                                      placeholder="Phone Number"
                                                      style={{backgroundColor: 'rgba(56, 147, 175, 20%)'}}
                                                      isInvalid={!!errors.phoneNumber}/>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.phoneNumber}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formMidName"
                                                style={{width: '30%', float: 'left', marginLeft: '3em'}}>
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control type="email" name={"emailAddress"} value={data.emailAddress}
                                                      onChange={handleChange}
                                                      placeholder="Email Address"
                                                      isInvalid={!!errors.emailAddress}
                                                      style={{backgroundColor: 'rgba(56, 147, 175, 20%)'}}/>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.emailAddress}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formLastName"
                                                style={{width: '30%', float: 'right', marginLeft: '-1.2em'}}>
                                        <Form.Label>Gender</Form.Label>
                                        <Form.Select name={"gender"} value={data.gender} onChange={handleChange}
                                                     style={{backgroundColor: 'rgba(56, 147, 175, 20%)'}}>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <div className={'w-100'}>
                                    <Form.Group className="mb-3" controlId="formFirstName"
                                                style={{width: '30%', float: 'left'}}>
                                        <Form.Label>Age</Form.Label>
                                        <Form.Control type="text" name={"age"} value={data.age} onChange={handleChange}
                                                      placeholder="Age"
                                                      style={{backgroundColor: 'rgba(56, 147, 175, 20%)'}}
                                                      isInvalid={!!errors.age}/>
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.age}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formMidName"
                                                style={{width: '30%', float: 'left', marginLeft: '3em'}}>
                                        <Form.Label>Appointment Date</Form.Label>
                                        <Form.Control type="date" name={"appointmentDate"} value={data.appointmentDate}
                                                      min={date}
                                                      onChange={handleChange}
                                                      placeholder="Date"
                                                      style={{backgroundColor: 'rgba(56, 147, 175, 20%)'}}/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formLastName"
                                                style={{width: '30%', float: 'right'}}>
                                        <Form.Label>Appointment Time</Form.Label>
                                        <Form.Control type="time" name={"appointmentTime"} value={data.appointmentTime}
                                                      onChange={handleChange}
                                                      style={{backgroundColor: 'rgba(56, 147, 175, 20%)'}}
                                                      isInvalid={!!errors.appointmentTime}/>
                                    </Form.Group>
                                </div>
                                <Button id="btn-submit" variant="primary" type="submit">
                                    Update Appointment
                                </Button>

                            </Form>
                        </div>
                    </div>

                </Card.Body>
            </Card>

        </>
    );
}

export default UpdateAppointment;