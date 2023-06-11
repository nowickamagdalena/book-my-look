import { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import useBeforeRender from '../utils/utils';

const BookVisit = () => {
    const { services, setServices } = useState([]);
    const { employees, setEmployees } = useState([]);
    const { searchCriteria, setSearchCriteria } = useState({servcie: "1"});

    // const updateEvents = (dateRange) => {
    //     axios.get(`http://localhost:8080/employees/${loggedInUser.employeeId}/availabilities?startDate=${dateRange.start}&endDate=${dateRange.end}`, {
    //         headers: {
    //             'Authorization': `Bearer ${loggedInUser.id_token}`
    //         }
    //     })
    //         .then(res => {
    //             const newEvents = res.data.map(aval => {
    //                 return { title: "Available", start: `${aval.date}T${aval.startTime}`, end: `${aval.date}T${aval.endTime}`, availibilityId: aval.id };
    //             });
    //             setEvents(newEvents);
    //         }).catch(error => {
    //             console.error('There was an error!' + error);
    //         });
    // }

    const getServices = () => {
        console.log('dupa');
        axios.get(`http://localhost:8080/salonservices`)
            .then(res => {
                setServices(res.data);
            }).catch(error => {
                console.error('There was an error!' + error);
            });
    }

    const searchSlots = () => {
        console.log("searching");
    }

    useBeforeRender(() => {
        getServices();
    }, []);

    useEffect(() => {
        // getServices();
        setSearchCriteria({service: ''});
    }, []);


    return (
        <div className="book-visit">
            <h2>BookVisit</h2>
            {searchCriteria !== {} && <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} className="mb-3" controlId="modalDayControl">
                        <Form.Label>Service</Form.Label>
                        <Form.Select aria-label="Default select example"
                            value={searchCriteria.service}
                            onChange={e => setSearchCriteria({ ...searchCriteria, service: e.target.value })}
                        >
                            <option>Open this select menu</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                            {/* {
                            services.map( service => {
                                return (<option key={service.id} value={service.name}>{service.name}</option>)
                            })
                        } */}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3" controlId="modalDayControl">
                        <Form.Label>Employee</Form.Label>
                        <Form.Select aria-label="Default select example" disabled>
                            <option>Open this select menu</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Button variant="pink" onClick={searchSlots}>Search</Button>
                    </Form.Group>
                </Row>
            </Form>}
        </div>
    );
}

export default BookVisit;