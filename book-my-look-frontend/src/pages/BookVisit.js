import { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const BookVisit = () => {
    const [criteria, setCriteria] = useState({ service: '', employee: '' });
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [searchValidated, setSearchValidated] = useState(false);

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
        console.log('get services');
        axios.get(`http://localhost:8080/salonservices`)
            .then(res => {
                console.log(res.data);
                setServices(res.data);
            }).catch(error => {
                console.error('There was an error!' + error);
            });
    }

    const getEmployeesForService = () => {
        console.log('get employees for service');
        axios.get(`http://localhost:8080/employees/services/${criteria.service}`)
            .then(res => {
                console.log(res.data);
                setEmployees(res.data);
            }).catch(error => {
                console.error('There was an error!' + error);
            });
    }

    const handleSubmit = (event) => {

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {            
            searchSlots();
        }
        setSearchValidated(true);

    }

    const searchSlots = () => {
        console.log("searching");
    }

    useEffect(() => {
        getServices();
        setCriteria({ service: '', employee: '' });
    }, []);

    useEffect(() => {
        setSearchValidated('');
        getEmployeesForService();
        setCriteria({ ...criteria, employee: '' });
        if (criteria.service !== '') {
            document.getElementById('employee_select').disabled = false;
        }
    }, [criteria.service]);

    return (
        <div className="book-visit">
            <h2>BookVisit</h2>
            <Form noValidate validated={searchValidated} onSubmit={handleSubmit}>
                {criteria &&
                    <Row className="mb-3"> <Form.Group as={Col} className="mb-3" controlId="modalDayControl">
                        <Form.Label>Service</Form.Label>
                        <Form.Select required aria-label="Default select example"
                            value={criteria.service}
                            onChange={e => setCriteria({ ...criteria, service: e.target.value })}
                        >

                            <option value="" selected disabled>Please select</option>
                            {
                                services.map(service => {
                                    return (<option key={service.id} value={service.id}>{service.name}</option>)
                                })
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please provide an end time.
                        </Form.Control.Feedback>
                    </Form.Group>
                        <Form.Group as={Col} className="mb-3">
                            <Form.Label>Employee</Form.Label>
                            <Form.Select required aria-label="Default select example" id='employee_select' disabled
                                value={criteria.employee}
                                onChange={e => setCriteria({ ...criteria, employee: e.target.value })}>

                                <option value="" selected disabled>Please select</option>
                                {
                                    employees.map(employee => {
                                        return (<option key={employee.id} value={employee.id}>{employee.firstName + ' ' + employee.lastName}</option>)
                                    })
                                }
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please provide an end time.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Button type="submit" variant="pink" onClick={searchSlots}>Search</Button>
                        </Form.Group>
                    </Row>
                }
            </Form>
        </div>
    );
}

export default BookVisit;