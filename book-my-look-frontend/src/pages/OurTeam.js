import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import {Link} from "react-router-dom";
import defaultImage from '../images/employee-default.jpg';

const OurTeam = () => {
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            setTeamMembers([]);
            const response = await axios.get('http://localhost:8080/employees');
            setTeamMembers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const renderTeamMembers = (currentRow) => {
        return currentRow.map((member, index) => (
            <Col md={4} key={index} className="mb-4">
                <Card className="employee-card">
                    <div className="image-container">
                        <Card.Img
                            variant="top"
                            src={`/images/employees/employee-${member.id}.jpg`}
                            onError={(e) => {
                                e.target.src = defaultImage;
                            }}
                            alt={member.id}
                        />
                    </div>
                    <Card.Body>
                        <Card.Title>{member.firstName} {member.lastName}</Card.Title>
                        <div className="employee-buttons">
                            <Link to="/book-visit">
                                <button className="btn-pink">Book Visit</button>
                            </Link>
                            <Link to={`/employee-profile/${member.id}`}>
                                <button className="btn-pink">See Profile</button>
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        ));
    };

    const renderRows = () => {
        const rows = [];
        let currentRow = [];

        teamMembers.forEach((member, index) => {
            currentRow.push(member);

            if (currentRow.length === 3 || index === teamMembers.length - 1) {
                rows.push(
                    <Row key={index} className="mb-4">
                        {renderTeamMembers(currentRow)}
                    </Row>
                );

                currentRow = [];
            }
        });

        return rows;
    };

    return (
        <section className="employees-section">
            <h2>Our team</h2>
            <Container>
                {renderRows()}
            </Container>
        </section>
    );
};

export default OurTeam;

