import { useEffect, useState } from "react";
import axios from 'axios';
import { startOfWeek, endOfWeek } from 'date-fns'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from "react-bootstrap/Alert";
import getLoggedUser from "../context/auth";


const EmployeeAvailability = () => {
    const loggedInUser = getLoggedUser();
    // console.log(loggedInUser);
    const [dateRange, setDateRange] = useState(
        { start: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().split('T')[0], end: endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().split('T')[0] }
        )
    const [events, setEvents] = useState([]);

    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [formData, setFormData] = useState(
        {
            currentAvalId: '',
            day: '',
            startTime: '',
            endTime: '',
            validated: false
        }
    )

    const updateEvents = (dateRange) => {
        axios.get(`http://localhost:8080/employees/${loggedInUser.employeeId}/availabilities?startDate=${dateRange.start}&endDate=${dateRange.end}`, {
            headers: {
                'Authorization': `Bearer ${loggedInUser.id_token}`
            }
        })
            .then(res => {
                const newEvents = res.data.map(aval => {
                    return { title: "Available", start: `${aval.date}T${aval.startTime}`, end: `${aval.date}T${aval.endTime}`, availibilityId: aval.id };
                });
                setEvents(newEvents);
            }).catch(error => {
                console.error('There was an error!' + error);
            });
    }

    useEffect(() => {
        updateEvents(dateRange);
    }, [dateRange]);

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setShowMessage(false);
        resetFormData();
        setShowDelete(false);
    }

    const resetFormData = () => {
        setFormData(
            {
                currentAvalId: '',
                day: '',
                startTime: '',
                endTime: '',
                validated: false
            })
    }

    const handleSave = (event) => {
        const form = event.currentTarget;
        const startT = formData.startTime.split(':').map(s => parseInt(s));
        const endT = formData.endTime.split(':').map(s => parseInt(s));
        const isTimePeriodInvalid = (startT[0] > endT[0]) || (startT[0] === endT[0] && startT[1] >= endT[1]);
        const isTimeNotDivisibleByFive = startT[1] % 5 !== 0 || endT[1] % 5 !== 0;
        if (form.checkValidity() === false || isTimePeriodInvalid || isTimeNotDivisibleByFive) {
            if (isTimePeriodInvalid) {
                setErrorMessage("Start time needs to be after end time");
                setShowMessage(true);
            }
            if (isTimeNotDivisibleByFive) {
                setErrorMessage("Time must be divisible by 5 minutes");
                setShowMessage(true);
            }
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();

            const eventdata = { date: event.target.date.value, startTime: event.target.startTime.value, endTime: event.target.endTime.value };

            if (formData.currentAvalId === "") {
                axios.post(`http://localhost:8080/employees/${loggedInUser.employeeId}/availabilities`, eventdata, {
                    headers: {
                        'Authorization': `Bearer ${loggedInUser.id_token}`
                    }
                })
                    .then(response => {
                        console.log(response);
                        handleClose();
                        updateEvents(dateRange);
                    })
                    .catch(error => {
                        if (error.response) {
                            setErrorMessage(error.response.data.message);
                        } else {
                            setErrorMessage(error.message);
                        }
                        setShowMessage(true);
                        console.error('There was an error!');
                    });

            } else {
                axios.put(`http://localhost:8080/employees/${loggedInUser.employeeId}/availabilities/${formData.currentAvalId}`, eventdata, {
                    headers: {
                        'Authorization': `Bearer ${loggedInUser.id_token}`
                    }
                })
                    .then(response => {
                        console.log(response);
                        handleClose();
                        updateEvents(dateRange);
                    })
                    .catch(error => {
                        if (error.response) {
                            setErrorMessage(error.response.data.message);
                        } else {
                            setErrorMessage(error.message);
                        }
                        setShowMessage(true);
                        console.error('There was an error!');
                    });

            }

        }
        setFormData({...formData, validated: true});
    };

    const handleDelete = () => {
        axios.delete(`http://localhost:8080/employees/${loggedInUser.employeeId}/availabilities/${formData.currentAvalId}`, {
            headers: {
                'Authorization': `Bearer ${loggedInUser.id_token}`
            }
        })
            .then(response => {
                console.log(response);
                setFormData({...formData, currentAvalId: ''});
                handleClose();
                updateEvents(dateRange);
            })
            .catch(error => {
                if (error.response) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage(error.message);
                }
                setShowMessage(true);
                console.error('There was an error!');
            });
    }

    function handleEventClick(eventInfo) {
        const availabilityId = eventInfo.event._def.extendedProps.availibilityId;
        console.log("Event has been clicked", eventInfo.event._instance.range);
        var start = new Date(eventInfo.event._instance.range.start);
        var end = new Date(eventInfo.event._instance.range.end);
        setFormData(
            {
                currentAvalId: availabilityId,
                day: start.toISOString().split('T')[0],
                startTime: start.toISOString().substring(11, 16),
                endTime: end.toISOString().substring(11, 16),
                validated: ''
            })
        setShowDelete(true);
        setShow(true);
    }


    function handleDatesSet(dateInfo) {
        console.log("Date has been clicked", dateInfo);
        console.log(dateInfo.startStr.split('T')[0]);
        var start = dateInfo.startStr.split('T')[0];
        var end = dateInfo.endStr.split('T')[0];
        setDateRange({ start: start, end: end })

    }

    return (
        <div className="book-visit">
            <h2>My availability</h2>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    {formData.currentAvalId === "" && <Modal.Title> Add new availability</Modal.Title>}
                    {formData.currentAvalId !== "" && <Modal.Title> Edit availability</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    <Alert show={showMessage} variant="danger">
                        Something went wrong! {errorMessage}
                    </Alert>
                    {showDelete && <div className="delete-button-div"><Button variant="danger" className="float-end" onClick={handleDelete}>Delete</Button></div>}
                    <Form noValidate validated={formData.validated} onSubmit={handleSave}>
                        <Form.Group className="mb-3" controlId="modalDayControl">
                            <Form.Label>Enter day</Form.Label>
                            <Form.Control required type="date" name="date" autoFocus
                                value={formData.day}
                                onChange={e => setFormData({...formData, day: e.target.value})} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a date.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="modalStartTimeControl">
                            <Form.Label>Enter start time</Form.Label>
                            <Form.Control required type="time" name="startTime"
                                value={formData.startTime}
                                onChange={e => setFormData({...formData, startTime: e.target.value})} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a start time.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="modalEndTimeControl">
                            <Form.Label>Enter end time</Form.Label>
                            <Form.Control required type="time" name="endTime"
                                value={formData.endTime}
                                onChange={e => setFormData({...formData, endTime: e.target.value})} />
                            <Form.Control.Feedback type="invalid">
                                Please provide an end time.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="col-md-12 text-center">
                            <Button type="submit" variant="pink">Save</Button>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            <div className="col-md-12 text-center">
                <Button variant="pink" onClick={handleShow}>
                    Add availability
                </Button>
            </div>
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
                events={events}
                eventDisplay="block"
                displayEventEnd={true}
                eventBackgroundColor="#c771b9"
                eventBorderColor="#7d4875"
                eventContent={renderEventContent}
                eventClick={handleEventClick}
                datesSet={handleDatesSet}
            />
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


export default EmployeeAvailability;