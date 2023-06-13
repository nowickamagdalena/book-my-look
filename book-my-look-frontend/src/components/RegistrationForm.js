import { useEffect, useState } from "react";
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";

const RegistrationForm = ({ slot, service, employee, setSuccess, setError, setEndForm }) => {
    const [clientData, setClientData] = useState({});
    const [formValidated, setFormValidated] = useState(false);

    const handleSubmit = (event) => {

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            event.stopPropagation();
            bookVisit();
            setEndForm();
        }
        setFormValidated(true);

    }

    const bookVisit = () => {
        const visitData = { date: slot.day, startTime: slot.startTime, salonServiceId: service.id, employeeId:employee.id, client: clientData};
        axios.post(`http://localhost:8080/visits`, visitData)
                    .then(response => {
                        setSuccess();
                    })
                    .catch(error => {
                        if (error.response) {
                            setError(error.response.data.message);
                        } else {
                            setError(error.response.data.message);
                        }
                        console.error('There was an error!');
                    });
    }

    return (
        <div className="registration-div">
            <h2>Register for the visit</h2>
            <Row>
                <Col>
                    <h4>Details of the visit</h4>
                    <div className="mt-4">
                        <div className="visit-detail"><p className="detail-label">Service: </p><p>{service.name}</p></div>
                        <div className="visit-detail"><p className="detail-label">Employee: </p><p>{employee.firstName + ' ' + employee.lastName}</p></div>
                        <div className="visit-detail"><p className="detail-label">Date: </p><p>{slot ? slot.day : ""}</p></div>
                        <div className="visit-detail"><p className="detail-label">Start time: </p><p>{slot ? slot.startTime : ""}</p></div>
                        <div className="visit-detail"><p className="detail-label">End time:</p><p>{slot ? slot.endTime : ""}</p></div>
                        <div className="visit-detail"><p className="detail-label">Duration:</p><p>{service.duration + " min"}</p></div>
                    </div>
                </Col>
                <Col>
                    <h4>Personal information</h4>
                    <Form noValidate validated={formValidated} onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group as={Col} className="mb-3">
                                <Form.Label>First name</Form.Label>
                                <Form.Control required type="text" name="firstName" autoFocus
                                    value={clientData.firstName}
                                    onChange={e => setClientData({ ...clientData, firstName: e.target.value })} />
                                <Form.Control.Feedback type="invalid">
                                    Please provide first name.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} className="mb-3" >
                                <Form.Label>Last name</Form.Label>
                                <Form.Control required type="text" name="lastName"
                                    value={clientData.lastName}
                                    onChange={e => setClientData({ ...clientData, lastName: e.target.value })} />
                                <Form.Control.Feedback type="invalid">
                                    Please provide last name.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control required type="email" name="email"
                                value={clientData.email}
                                onChange={e => setClientData({ ...clientData, email: e.target.value })} />
                            <Form.Control.Feedback type="invalid">
                                Please provide email address.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone number</Form.Label>
                            <Form.Control required type="text" name="phoneNumber"
                                value={clientData.phoneNumber}
                                onChange={e => setClientData({ ...clientData, phoneNumber: e.target.value })} />
                            <Form.Control.Feedback type="invalid">
                                Please provide phone number.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Additional information</Form.Label>
                            <Form.Control as="textarea" type="text" name="phoneNumber"
                                value={clientData.additionalInfo}
                                onChange={e => setClientData({ ...clientData, additionalInfo: e.target.value })} />
                        </Form.Group>
                        <div>
                        <Button className="m-3 float-end" variant="pink" type="submit" >Register</Button>
                        <Button className="m-3 float-end" variant="danger" onClick={setEndForm}>Cancel</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default RegistrationForm;