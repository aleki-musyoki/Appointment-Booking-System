import React, {useState} from "react";
import './css/create.css';
import {Button, Card, Form} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {GrLinkPrevious} from "react-icons/all";

const CreateAppointment = () => {
    const [data, setData] = useState('');
    const [errors, setErrors] = useState('');
    const [recepient, setRecepient] = useState('');
    const navigate = useNavigate();
    const current = new Date();
    const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`;
    const time = `${current.getTime()}`;

    const createAPI = 'http://localhost:8080/api/v1/createAppointment';
    const sendEmailAPI = 'http://localhost:8080/sendMail';

    async function createAppointment(appointment) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointment)
        }
        const response = await fetch(createAPI, options);
        if (response.status === 200) {
            sendEmailAlert(appointment);
            navigate('/');
        } else {
            console.log(response.status);
        }

    }

    async function sendEmailAlert(appointment) {
        const emailDetails = {
            "recipient": `${appointment.emailAddress}`,
            "msgBody": `Hello ${appointment.firstName},\n\nThank you for choosing The Clinic.\n\nYour appointment is scheduled for ${appointment.appointmentTime} on ${new Date(appointment.appointmentDate).toLocaleDateString()}\n\n\nThanks,\nThe Clinic`,
            "subject": "New Appointment Details"
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
            console.log('Success');
        } else {
            console.log('Error! Not Sent');
        }

    }

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
        setRecepient(updatedData.emailAddress);

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
            gender,
            age,
            appointmentDate,
            appointmentTime
        } = data;
        const newErrors = {};

        if (!appointmentID || appointmentID === '') newErrors.appointmentID = 'Cannot be blank';
        else if (appointmentID.length > 7 || !appointmentID.includes('PT-')) newErrors.appointmentID = 'Invalid ID';

        //First name errors
        if (!firstName || firstName === '') newErrors.firstName = 'Cannot be blank';
        else if (firstName.length > 15) newErrors.firstName = 'name is too long';

        if (!middleName || middleName === '') newErrors.middleName = 'Cannot be blank';
        else if (middleName.length > 15) newErrors.middleName = 'name is too long';

        if (!lastName || lastName === '') newErrors.lastName = 'Cannot be blank';
        else if (lastName.length > 15) newErrors.lastName = 'name is too long';

        if (!phoneNumber || phoneNumber === '') newErrors.phoneNumber = 'Cannot be blank';
        else if (phoneNumber.length !== 10 || !phoneNumber.includes('07') || phoneNumber.charAt(0) !== '0') newErrors.phoneNumber = 'Not a valid phone number';

        if (!gender || gender === '') newErrors.gender = 'Cannot be blank';
        else if (gender === 'none') newErrors.gender = 'Gender cannot be None';

        if (!age || age === '') newErrors.age = 'Cannot be blank';
        else if (age.length > 2 || age.match(/[0-9]/) === null) newErrors.age = 'Not a valid age';

        if (!emailAddress || emailAddress === '') newErrors.emailAddress = 'Cannot be blank';
        else if (!emailAddress.includes('@') || !emailAddress.includes('.com') ||
            (emailAddress.charAt(emailAddress.length - 4) !== '.' && emailAddress.charAt(emailAddress.length - 3) !== 'c' && emailAddress.charAt(emailAddress.length - 2) !== 'o' && emailAddress.charAt(emailAddress.length - 1) !== 'm')) newErrors.emailAddress = 'Not a valid email'

        if (!appointmentDate || appointmentDate === '') newErrors.appointmentDate = 'Cannot be blank'
        else if (Date.parse(appointmentDate) < Date.parse(date)) newErrors.appointmentDate = 'Cannot set date before today'

        if (!appointmentTime || appointmentTime === '') newErrors.appointmentTime = 'Cannot be blank'
        else if (+appointmentDate === +date && appointmentTime < time) newErrors.appointmentTime = 'Cannot set a time in the past'


        return newErrors
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = findFormErrors();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            createAppointment(data);
        }
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
                            <p style={{margin: 'auto', lineHeight: '80vh', color: '#FFFFFF'}}>Create Appointment</p>
                        </div>
                        <div style={{float: 'right', width: '75%', height: '85vh'}}>
                            <p><strong style={{fontSize: '1.2em', width: '50%', marginLeft: '-39em'}}>Create
                                Appointment: </strong></p>
                            <Form onSubmit={handleSubmit} style={{height: '81vh', marginTop: '1.2em'}}>
                                <div>

                                    <div>
                                        <Form.Group className="mb-3" controlId="formFirstName"
                                                    style={{width: '100%', float: 'left'}}>
                                            <Form.Label>Appointment ID</Form.Label>
                                            <Form.Control type="text" name={"appointmentID"} onChange={handleChange}
                                                          placeholder="Appointment ID" style={{
                                                width: '30%',
                                                backgroundColor: 'rgba(56, 147, 175, 20%)'
                                            }}
                                                          isInvalid={!!errors.appointmentID}/>
                                            <Form.Control.Feedback style={{width: '30%'}} type='invalid'>
                                                {errors.appointmentID}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>
                                    <div className={'w-100'}>
                                        <Form.Group className="mb-3" controlId="formFirstName"
                                                    style={{width: '30%', float: 'left'}}>
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control type="text" name={"firstName"} onChange={handleChange}
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
                                            <Form.Control type="text" name={"middleName"} onChange={handleChange}
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
                                            <Form.Control type="text" name={"lastName"} onChange={handleChange}
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
                                            <Form.Control type="text" name={"phoneNumber"} onChange={handleChange}
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
                                            <Form.Control type="text" name={"emailAddress"} onChange={handleChange}
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
                                            <Form.Select name={"gender"} onChange={handleChange}
                                                         style={{backgroundColor: 'rgba(56, 147, 175, 20%)'}}
                                                         isInvalid={!!errors.gender}>
                                                <option value="none">None</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type='invalid'>
                                                {errors.gender}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>

                                    <div className={'w-100'}>
                                        <Form.Group className="mb-3" controlId="formFirstName"
                                                    style={{width: '30%', float: 'left'}}>
                                            <Form.Label>Age</Form.Label>
                                            <Form.Control type="text" name={"age"} onChange={handleChange}
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
                                            <Form.Control type="date" name={"appointmentDate"} min={Date.parse(date)}
                                                          onChange={handleChange}
                                                          placeholder="Date"
                                                          style={{backgroundColor: 'rgba(56, 147, 175, 20%)'}}
                                                          isInvalid={!!errors.appointmentDate}/>
                                            <Form.Control.Feedback type='invalid'>
                                                {errors.appointmentDate}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formLastName"
                                                    style={{width: '30%', float: 'right'}}>
                                            <Form.Label>Appointment Time</Form.Label>
                                            <Form.Control type="time" name={"appointmentTime"} onChange={handleChange}
                                                          placeholder="First Name"
                                                          style={{backgroundColor: 'rgba(56, 147, 175, 20%)'}}
                                                          isInvalid={!!errors.appointmentTime}/>
                                            <Form.Control.Feedback type='invalid'>
                                                {errors.appointmentTime}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </div>
                                </div>

                                <Button id="btn-submit" variant="primary" type="submit">
                                    Create Appointment
                                </Button>

                            </Form>
                        </div>
                    </div>

                </Card.Body>
            </Card>

        </>
    );

}

export default CreateAppointment;