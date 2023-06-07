import { useEffect, useState } from "react";
import axios from 'axios';
import { startOfWeek, endOfWeek } from 'date-fns'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from "react-bootstrap/Alert";
import getLoggedUser from "../context/auth";

//TODO: create visits calendar instead of availabilities calendar

const EmployeeVisits = () => {
    const loggedInUser = getLoggedUser();
    // console.log(loggedInUser);
    const [dateRange, setDateRange] = useState(
        { start: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().split('T')[0], end: endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString().split('T')[0] }
    )
    const [events, setEvents] = useState([]);

    const [showConfirm, setShowConfirm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [showVisitDetails, setShowVisitDetails] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [visitData, setVisitData] = useState(
        {
            visitId: '',
            serviceId: '',
            service: '',
            visitDuration: '',
            day: '',
            startTime: '',
            endTime: '',
            clientInfo: {},
            validated: ''
        }
    )

    const updateEvents = (dateRange) => {
        axios.get(`http://localhost:8080/visits/employee/${loggedInUser.employeeId}?startDate=${dateRange.start}&endDate=${dateRange.end}`, {
            headers: {
                'Authorization': `Bearer ${loggedInUser.id_token}`
            }
        })
            .then(res => {
                const newEvents = res.data.map(visit => {
                    console.log(visit.duration);

                    return {
                        title: visit.salonServiceName,
                        start: `${visit.date}T${visit.startTime}`,
                        end: `${visit.date}T${visit.endTime}`,
                        visitDuration: visit.duration,
                        serviceId: visit.salonServiceId,
                        visitId: visit.id,
                        clientInfo: visit.client
                    };
                });
                setEvents(newEvents);
            }).catch(error => {
                console.error('There was an error!' + error);
            });
    }

    useEffect(() => {
        updateEvents(dateRange);
    }, [dateRange, showVisitDetails]);

    const resetVisitData = () => {
        setVisitData(
            {
                visitId: '',
                service: '',
                serviceId: '',
                day: '',
                startTime: '',
                endTime: '',
                visitDuration: '',
                clientInfo: {}
            })
    }

    const handleSave = (event) => {
        const form = event.currentTarget;
        const startT = visitData.startTime.split(':').map(s => parseInt(s));
        const isTimeNotDivisibleByFive = startT[1] % 5 !== 0;
        if (form.checkValidity() === false || isTimeNotDivisibleByFive) {
            if (isTimeNotDivisibleByFive) {
                setErrorMessage("Time must be divisible by 5 minutes");
                setShowMessage(true);
                setVisitData({ ...visitData, validated: false });
            }
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();

            const visitUpdate = {
                date: event.target.date.value,
                startTime: event.target.startTime.value,
                employeeId: loggedInUser.employeeId,
                salonServiceId: visitData.serviceId,
                client: visitData.clientInfo
            };


            axios.put(`http://localhost:8080/visits/${visitData.visitId}`, visitUpdate, {
                headers: {
                    'Authorization': `Bearer ${loggedInUser.id_token}`
                }
            })
                .then(response => {
                    console.log(response);
                    finishEdit();
                    setVisitData({ ...visitData, validated: '' });
                    updateEvents(dateRange);
                    setShowMessage(false);
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
        setVisitData({ ...visitData, validated: true });
    };

    const handleShowConfirm = () => setShowConfirm(true);
    const handleCloseConfirm = () => setShowConfirm(false);

    const handleDelete = () => {
        axios.delete(`http://localhost:8080/visits/${visitData.visitId}`, {
            headers: {
                'Authorization': `Bearer ${loggedInUser.id_token}`
            }
        })
            .then(response => {
                console.log(response);
                resetVisitData();
                handleClose();
                handleCloseConfirm();
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
        const eventExtendedProps = eventInfo.event._def.extendedProps
        const visitId = eventExtendedProps.visitId;
        const clientInfo = eventExtendedProps.clientInfo;
        console.log("Event has been clicked", eventInfo);
        var start = new Date(eventInfo.event._instance.range.start);
        var end = new Date(eventInfo.event._instance.range.end);
        setVisitData(
            {
                visitId: visitId,
                service: eventInfo.event._def.title,
                serviceId: eventExtendedProps.serviceId,
                visitDuration: eventExtendedProps.visitDuration,
                day: start.toISOString().split('T')[0],
                startTime: start.toISOString().substring(11, 16),
                endTime: end.toISOString().substring(11, 16),
                clientInfo: clientInfo
                // validated: ''
            })
        document.getElementById('calendar').className = "w-75";
        setShowVisitDetails(true);
    }


    function handleDatesSet(dateInfo) {
        console.log("Date has been clicked", dateInfo);
        console.log(dateInfo.startStr.split('T')[0]);
        var start = dateInfo.startStr.split('T')[0];
        var end = dateInfo.endStr.split('T')[0];
        setDateRange({ start: start, end: end })

    }

    function handleClose() {
        resetVisitData();
        setShowVisitDetails(false);
        setShowMessage(false);
        setErrorMessage('');
        document.getElementById('calendar').className = "w-100";
    }

    function handleEdit() {
        setIsEditMode(true);

        var controls = [document.getElementById("form_date"), document.getElementById("form_startTime")];
        console.log(controls);

        controls.forEach(element => {
            element.readOnly = false;
            element.disabled = false;
        });
    }

    function finishEdit() {
        setIsEditMode(false);

        var controls = [document.getElementById("form_date"), document.getElementById("form_startTime")];
        console.log(controls);

        controls.forEach(element => {
            element.readOnly = true;
            element.disabled = true;
        });
    }

    function setVisitTimes(event) {
        const start = event.target.value
        var startDateTime = new Date(`${visitData.day + 'T' + start}`);
        var newDateObj = new Date(startDateTime.getTime() + visitData.visitDuration * 60000);
        setVisitData({ ...visitData, startTime: start, endTime: newDateObj.toLocaleString("pl-PL").substring(11, 16) })
    }

    return (
        <div className="book-visit">
            <h1>My visits</h1>
            <div className="visit-calendar">
                <div className="w-100" id="calendar">
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
                {showVisitDetails && <div className="visit-details float-end w-25">
                    <Modal show={showConfirm} onHide={handleCloseConfirm} animation={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>Deleting visit</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to delete this visit?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseConfirm}>
                                Close
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <div>
                        <Button variant="secondary" className="btn-close float-end" onClick={handleClose}></Button>
                    </div>
                    <div className="visit-header">
                        <h2>Visit</h2>
                        <div className="display-row float-end">
                            <div className="w-50 text-center">
                                <Button variant="danger" onClick={handleShowConfirm}>Delete</Button>
                            </div>
                            <div className="w-50 text-center">
                                <Button variant="pink" onClick={handleEdit}>Edit</Button>
                            </div>
                        </div>
                    </div>
                    <Alert show={showMessage} variant="danger">
                        Something went wrong! {errorMessage}
                    </Alert>
                    <Form noValidate validated={visitData.validated} onSubmit={handleSave}>
                        <Form.Group className="mb-3" controlId="modalDayControl">
                            <Form.Label>Service</Form.Label>
                            <h3>{visitData.service}</h3>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="modalDayControl">
                            <Form.Label>Date</Form.Label>
                            <Form.Control required type="date" name="date" id="form_date" autofocus disabled readOnly
                                value={visitData.day}
                                onChange={e => setVisitData({ ...visitData, day: e.target.value })} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a date.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="modalStartTimeControl">
                                <Form.Label>Start time</Form.Label>
                                <Form.Control required type="time" name="startTime" id="form_startTime" disabled readOnly
                                    value={visitData.startTime}
                                    onChange={e => setVisitTimes(e)} />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a start time.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} controlId="modalEndTimeControl">
                                <Form.Label>End time</Form.Label>
                                <Form.Control required type="time" name="endTime" id="form_endTime" disabled readOnly
                                    value={visitData.endTime}
                                    onChange={e => setVisitData({ ...visitData, endTime: e.target.value })} />
                                <Form.Control.Feedback type="invalid">
                                    Please provide an end time.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        {isEditMode &&
                            <div className="col-md-12 text-center">
                                <Button type="submit" variant="pink">Save</Button>
                            </div>
                        }
                        <div>
                            <fieldset>
                                <legend>Client</legend>
                                <Form.Group className="mb-3" controlId="modalDayControl">
                                    <Form.Label>Client name</Form.Label>
                                    <Form.Control required type="text" name="client_name" disabled readOnly
                                        value={visitData.clientInfo.firstName + " " + visitData.clientInfo.lastName} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="modalDayControl">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control required type="text" name="email" disabled readOnly
                                        value={visitData.clientInfo.email} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="modalDayControl">
                                    <Form.Label>Phone number</Form.Label>
                                    <Form.Control required type="text" name="phoneNumber" disabled readOnly
                                        value={visitData.clientInfo.phoneNumber} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="modalDayControl">
                                    <Form.Label>Additional information</Form.Label>
                                    <Form.Control required type="text" name="additionalInfo" autoFocus disabled readOnly
                                        value={visitData.clientInfo.additionalInfo} />
                                </Form.Group>
                            </fieldset>
                        </div>
                    </Form>

                </div>
                }
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


export default EmployeeVisits;