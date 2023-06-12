import { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { startOfWeek, endOfWeek } from 'date-fns'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

const BookVisit = () => {
    const [criteria, setCriteria] = useState({ service: "", employee: "" });
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [searchValidated, setSearchValidated] = useState(false);
    const [dateRange, setDateRange] = useState(
        { start: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().split('T')[0], end: endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().split('T')[0] }
    )
    const [slots, setSlots] = useState([]);
    const [pickedSlot, setPickedSlot] = useState(null);

    const updateSlots = (dateRange) => {
        axios.get(`http://localhost:8080/visits/slots?employeeId=${criteria.employee.id}&salonServiceId=${criteria.service.id}&startDate=${dateRange.start}&endDate=${dateRange.end}`)
            .then(res => {
                const newSlots = res.data.map(slot => {
                    return { title: criteria.service.name, start: `${slot.date}T${slot.startTime}`, end: `${slot.date}T${slot.endTime}` };
                });
                setSlots(newSlots);
            }).catch(error => {
                console.error('There was an error!' + error);
            });
    }

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
        axios.get(`http://localhost:8080/employees/services/${criteria.service.id}`)
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
            event.preventDefault();
            event.stopPropagation();
            searchSlots();
        }
        setSearchValidated(true);

    }

    useEffect(() => {
        updateSlots(dateRange);
        const handleFocusOut = (event) => {
            setPickedSlot(null)
        };

        // Find all elements with class "fc-event"
        const fcEventElements = document.querySelectorAll('.fc-event');

        // Add onBlur event handler to each element
        fcEventElements.forEach((element) => {
            element.addEventListener('blur', handleFocusOut);
        });
    }, [dateRange]);

    const searchSlots = () => {
        updateSlots(dateRange);
    }

    useEffect(() => {
        getServices();
        setCriteria({ service: "", employee: "" });
    }, []);

    useEffect(() => {
        setSearchValidated('');
        getEmployeesForService();
        setCriteria({ ...criteria, employee: "" });
        if (criteria.service !== '') {
            document.getElementById('employee_select').disabled = false;
        }
    }, [criteria.service]);

    useEffect(() => {
        setSearchValidated('');
    }, [criteria.employee]);


    function handleEventClick(eventInfo) {
        console.log("Event has been clicked", eventInfo.event._instance.range);
        var start = new Date(eventInfo.event._instance.range.start);
        var end = new Date(eventInfo.event._instance.range.end);
        setPickedSlot(
            {
                day: start.toISOString().split('T')[0],
                startTime: start.toISOString().substring(11, 16),
                endTime: end.toISOString().substring(11, 16),
            });
    }


    function handleDatesSet(dateInfo) {
        console.log("Date has been clicked", dateInfo);
        console.log(dateInfo.startStr.split('T')[0]);
        var start = dateInfo.startStr.split('T')[0];
        var end = dateInfo.endStr.split('T')[0];
        setDateRange({ start: start, end: end })

    }

    function displayClientForm() {
        console.log("display sth");
    }


    return (
        <div className="book-visit">
            <h2>Book visit</h2>
            <Form noValidate validated={searchValidated} onSubmit={handleSubmit}>
                {criteria &&
                    <Row className="mb-3"> <Form.Group as={Col} className="mb-3" controlId="modalDayControl">
                        <Form.Label>Service</Form.Label>
                        <Form.Select required aria-label="Default select example"
                            value={criteria.service !== "" ? JSON.stringify(criteria.service) : ""}
                            onChange={e => setCriteria({ ...criteria, service: JSON.parse(e.target.value) })}
                        >

                            <option value="" selected disabled>Please select</option>
                            {
                                services.map(service => {
                                    return (<option key={service.id} value={JSON.stringify(service)}>{service.name}</option>)
                                })
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Select service
                        </Form.Control.Feedback>
                    </Form.Group>
                        <Form.Group as={Col} className="mb-3">
                            <Form.Label>Employee</Form.Label>
                            <Form.Select required aria-label="Default select example" id='employee_select' disabled
                                value={criteria.employee !== "" ? JSON.stringify(criteria.employee) : ""}
                                onChange={e => setCriteria({ ...criteria, employee: JSON.parse(e.target.value) })}>

                                <option value="" selected disabled>Please select</option>
                                {
                                    employees.map(employee => {
                                        return (<option key={employee.id} value={JSON.stringify(employee)}>{employee.firstName + ' ' + employee.lastName}</option>)
                                    })
                                }
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Select employee
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} className="mb-3 d-flex align-items-end">
                            <Button id="search-button" type="submit" variant="pink" onClick={searchSlots}>Search</Button>
                        </Form.Group>
                    </Row>
                }
            </Form>
            <FullCalendar
                plugins={[timeGridPlugin]}
                initialView='timeGridWeek'
                firstDay="1"
                weekends={true}
                slotEventOverlap={false}
                allDaySlot={false}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                slotDuration="00:15:00"
                slotLabelInterval="00:30"
                events={slots}
                eventDisplay="block"
                displayEventEnd={true}
                eventBackgroundColor="#c771b9"
                eventBorderColor="#7d4875"
                eventContent={renderEventContent}
                eventClick={handleEventClick}
                datesSet={handleDatesSet}
                height="600px"
            />
            <div className="centered-div">
                <Button className="large-pink-button" variant="pink" disabled={pickedSlot == null} onClick={displayClientForm}>Book visit</Button>
            </div>
            
        </div>
    );
}

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <p>{eventInfo.event.title}</p>
        </>
    )
}
export default BookVisit;