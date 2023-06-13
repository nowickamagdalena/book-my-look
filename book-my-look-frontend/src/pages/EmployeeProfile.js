import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import defaultImage from "../images/employee-default.jpg";

const EmployeeProfile = () => {
    const { id } = useParams();
    console.log('id: ', id);
    const [employee, setEmployee] = useState(null);

    const fetchEmployee = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/employees/${id}`);
            setEmployee(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchEmployee().then(r => console.log(r));
    }, []);

    return (
        <Container className="profile-container">
            <Row>
                <Col md={4}>
                    <Image className="profile-image"
                        src={`/images/employees/employee-${id}.jpg`}
                        onError={(e) => {
                            e.target.src = defaultImage;
                        }}
                        alt={id}
                        fluid
                    />
                </Col>
                <Col md={8}>
                    {employee && (
                        <>
                            <h2>{employee.firstName} {employee.lastName}</h2>
                            <p>Email: {employee.email}</p>
                            <h4>Available Services:</h4>
                            <ul>
                                {employee.availableServices.map((service) => (
                                    <li key={service}>{service.name}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default EmployeeProfile;
