import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { startOfWeek, endOfWeek } from 'date-fns'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from "react-bootstrap/Alert";


const EmployeeAvailability = () => {
    const params = useParams();
    const userId = params.userId;
    var date = new Date();
    const start = startOfWeek(date, { weekStartsOn: 1 }).toISOString().split('T')[0];
    const end = endOfWeek(date, { weekStartsOn: 1 }).toISOString().split('T')[0];

    const [events, setEvents] = useState([]);

    const updateEvents = () => {
        axios.get(`http://localhost:8080/employees/${userId}/availabilities?startDate=${start}&endDate=${end}`)
            .then(res => {
                const newEvents = res.data.map(aval => {
                    return { title: "Available", start: `${aval.date}T${aval.startTime}`, end: `${aval.date}T${aval.endTime}`, availibilityId: aval.id };
                });
                setEvents(newEvents);
            }).catch(error => {
                console.error('There was an error!');
            });
    }

    useEffect(() => {
        updateEvents();
    }, []);


    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShowMessage(false);
        setCurrentAvalId("");
        setFormDate("");
        setFormStartTime("");
        setFormEndTime("");
        setValidated(false);
        setShowDelete(false);
        setShow(false);
    }
    const [errorMessage, setErrorMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [currentAvalId, setCurrentAvalId] = useState('');
    const [formDate, setFormDate] = useState('');
    const [formStartTime, setFormStartTime] = useState('');
    const [formEndTime, setFormEndTime] = useState('');
    const [validated, setValidated] = useState(false);

    const handleSave = (event) => {
        const form = event.currentTarget;
        const startT = formStartTime.split(':').map(s => parseInt(s));
        const endT = formEndTime.split(':').map(s => parseInt(s));
        const isTimePeriodInvalid = (startT[0] > endT[0]) || (startT[0] === endT[0] && startT[1] >= endT[1]);
        if (form.checkValidity() === false || isTimePeriodInvalid) {
            //TODO: Display this message to user, Also validate only 15 minutes can be chosen maybe change for time picker
            if (isTimePeriodInvalid) {
                setErrorMessage("Start time needs to be after end time");
                setShowMessage(true);
            }
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();

            var event = { date: event.target.date.value, startTime: event.target.startTime.value, endTime: event.target.endTime.value };
            if(currentAvalId === "") {
                axios.post(`http://localhost:8080/employees/${userId}/availabilities`, event)
                .then(response => {
                    console.log(response);
                    handleClose();
                    updateEvents();
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
                axios.put(`http://localhost:8080/employees/${userId}/availabilities/${currentAvalId}`, event)
                .then(response => {
                    console.log(response);
                    handleClose();
                    updateEvents();
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
        setValidated(true);
    };

    const handleDelete = () => {
        axios.delete(`http://localhost:8080/employees/${userId}/availabilities/${currentAvalId}`)
        .then(response => {
            console.log(response);
            setCurrentAvalId("");
            handleClose();
            updateEvents();
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
        setCurrentAvalId(availabilityId);
        var start = new Date(eventInfo.event._instance.range.start);
        var end = new Date(eventInfo.event._instance.range.end);
        setFormDate(start.toISOString().split('T')[0]);
        setFormStartTime(start.toISOString().substring(11,16));
        setFormEndTime(end.toISOString().substring(11,16));
        setCurrentAvalId(availabilityId);
        setShowDelete(true);
        setShow(true);
    }

    return (
        <div className="book-visit">
            <h2>Availability</h2>
            <Button variant="primary" onClick={handleShow}>
                Add availability
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    {currentAvalId === "" && <Modal.Title> Add new availability</Modal.Title>}
                    {currentAvalId !== "" && <Modal.Title> Edit availability</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    <Alert show={showMessage} variant="danger">
                        Something went wrong! {errorMessage}
                    </Alert>
                    {showDelete && <Button variant="danger" onClick={handleDelete}>Delete</Button>}
                    <Form noValidate validated={validated} onSubmit={handleSave}>
                        <Form.Group className="mb-3" controlId="modalDayControl">
                            <Form.Label>Enter day</Form.Label>
                            <Form.Control required type="date" name="date" autoFocus
                                value={formDate}
                                onChange={e => setFormDate(e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a date.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="modalStartTimeControl">
                            <Form.Label>Enter start time</Form.Label>
                            <Form.Control required type="time" name="startTime"
                                value={formStartTime}
                                onChange={e => setFormStartTime(e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a start time.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="modalEndTimeControl">
                            <Form.Label>Enter end time</Form.Label>
                            <Form.Control required type="time" name="endTime"
                                value={formEndTime}
                                onChange={e => setFormEndTime(e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please provide an end time.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="col-md-12 text-center">
                            <Button type="submit" variant="primary">Save</Button>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
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
                eventContent={renderEventContent}
                eventClick={handleEventClick}
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