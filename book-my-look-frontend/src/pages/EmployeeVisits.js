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

//TODO: create visits calendar instead of availabilities calendar

const EmployeeVisits = () => {
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
    const [showVisitDetails, setShowVisitDetails] = useState(false);

    const [visitData, setVisitData] = useState(
        {
            visitId: '',
            service: '',
            day: '',
            startTime: '',
            endTime: '',
            clientInfo: {}
            // validated: false
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
                    return {
                        title: visit.salonServiceName,
                        start: `${visit.date}T${visit.startTime}`,
                        end: `${visit.date}T${visit.endTime}`,
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
    }, [dateRange]);

    const handleShow = () => setShow(true);
    // const handleClose = () => {
    //     setShow(false);
    //     setShowMessage(false);
    //     resetFormData();
    //     setShowDelete(false);
    // }

    const resetVisitData = () => {
        setVisitData(
            {
                visitId: '',
                service: '',
                day: '',
                startTime: '',
                endTime: '',
                clientInfo: {}
            })
    }

    // const handleSave = (event) => {
    //     const form = event.currentTarget;
    //     const startT = formData.startTime.split(':').map(s => parseInt(s));
    //     const endT = formData.endTime.split(':').map(s => parseInt(s));
    //     const isTimePeriodInvalid = (startT[0] > endT[0]) || (startT[0] === endT[0] && startT[1] >= endT[1]);
    //     const isTimeNotDivisibleByFive = startT[1] % 5 !== 0 || endT[1] % 5 !== 0;
    //     if (form.checkValidity() === false || isTimePeriodInvalid || isTimeNotDivisibleByFive) {
    //         if (isTimePeriodInvalid) {
    //             setErrorMessage("Start time needs to be after end time");
    //             setShowMessage(true);
    //         }
    //         if (isTimeNotDivisibleByFive) {
    //             setErrorMessage("Time must be divisible by 5 minutes");
    //             setShowMessage(true);
    //         }
    //         event.preventDefault();
    //         event.stopPropagation();
    //     } else {
    //         event.preventDefault();

    //         const eventdata = { date: event.target.date.value, startTime: event.target.startTime.value, endTime: event.target.endTime.value };

    //         if (formData.currentAvalId === "") {
    //             axios.post(`http://localhost:8080/employees/${loggedInUser.employeeId}/availabilities`, eventdata, {
    //                 headers: {
    //                     'Authorization': `Bearer ${loggedInUser.id_token}`
    //                 }
    //             })
    //                 .then(response => {
    //                     console.log(response);
    //                     handleClose();
    //                     updateEvents(dateRange);
    //                 })
    //                 .catch(error => {
    //                     if (error.response) {
    //                         setErrorMessage(error.response.data.message);
    //                     } else {
    //                         setErrorMessage(error.message);
    //                     }
    //                     setShowMessage(true);
    //                     console.error('There was an error!');
    //                 });

    //         } else {
    //             axios.put(`http://localhost:8080/employees/${loggedInUser.employeeId}/availabilities/${formData.currentAvalId}`, eventdata, {
    //                 headers: {
    //                     'Authorization': `Bearer ${loggedInUser.id_token}`
    //                 }
    //             })
    //                 .then(response => {
    //                     console.log(response);
    //                     handleClose();
    //                     updateEvents(dateRange);
    //                 })
    //                 .catch(error => {
    //                     if (error.response) {
    //                         setErrorMessage(error.response.data.message);
    //                     } else {
    //                         setErrorMessage(error.message);
    //                     }
    //                     setShowMessage(true);
    //                     console.error('There was an error!');
    //                 });

    //         }

    //     }
    //     setFormData({ ...formData, validated: true });
    // };

    const handleDelete = () => {
        axios.delete(`http://localhost:8080/visits/${visitData.visitId}`, {
            headers: {
                'Authorization': `Bearer ${loggedInUser.id_token}`
            }
        })
            .then(response => {
                console.log(response);
                resetVisitData();
                // handleClose();
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
                day: start.toISOString().split('T')[0],
                startTime: start.toISOString().substring(11, 16),
                endTime: end.toISOString().substring(11, 16),
                clientInfo: clientInfo
                // validated: ''
            })
        setShowDelete(true);
        document.getElementById('calendar').className = "w-75";
        setShowVisitDetails(true);
        setShow(true);
    }


    function handleDatesSet(dateInfo) {
        console.log("Date has been clicked", dateInfo);
        console.log(dateInfo.startStr.split('T')[0]);
        var start = dateInfo.startStr.split('T')[0];
        var end = dateInfo.endStr.split('T')[0];
        setDateRange({ start: start, end: end })

    }

    function handleEdit(event) {
        console.log("MAke fields editable", event);

    }

    return (
        <div className="book-visit">
            <h1>My visits</h1>
            {/* <Modal
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
                                onChange={e => setFormData({ ...formData, day: e.target.value })} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a date.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="modalStartTimeControl">
                            <Form.Label>Enter start time</Form.Label>
                            <Form.Control required type="time" name="startTime"
                                value={formData.startTime}
                                onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a start time.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="modalEndTimeControl">
                            <Form.Label>Enter end time</Form.Label>
                            <Form.Control required type="time" name="endTime"
                                value={formData.endTime}
                                onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
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
            </div> */}
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
                    <div className="visit-header">
                        <h2>Visit</h2>
                        <div className="display-row float-end">
                            <div className="w-50 text-center">
                                <Button variant="pink" onClick={handleEdit}>Edit</Button>
                            </div>
                            <div className="w-50 text-center">
                                <Button variant="danger">Delete</Button>
                            </div>
                        </div>
                    </div>
                    <Form noValidate >
                        <Form.Group className="mb-3" controlId="modalDayControl">
                            <Form.Label>Service</Form.Label>
                            <Form.Control required type="text" name="service" autoFocus readOnly
                                value={visitData.service}
                                onChange={e => setVisitData({ ...visitData, service: e.target.value })} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a date.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="modalDayControl">
                            <Form.Label>Date</Form.Label>
                            <Form.Control required type="date" name="date" autoFocus readOnly
                                value={visitData.day}
                                onChange={e => setVisitData({ ...visitData, day: e.target.value })} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a date.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="form-times">
                            <Form.Group className="w-50" controlId="modalStartTimeControl">
                                <Form.Label>Start time</Form.Label>
                                <Form.Control required type="time" name="startTime" readOnly
                                    value={visitData.startTime}
                                    onChange={e => setVisitData({ ...visitData, startTime: e.target.value })} />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a start time.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="w-50" controlId="modalEndTimeControl">
                                <Form.Label>End time</Form.Label>
                                <Form.Control required type="time" name="endTime"
                                    value={visitData.endTime}
                                    onChange={e => setVisitData({ ...visitData, endTime: e.target.value })} />
                                <Form.Control.Feedback type="invalid">
                                    Please provide an end time.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div>
                            <p>Client</p>
                            <Form.Group className="mb-3" controlId="modalDayControl">
                                <Form.Label>Client name</Form.Label>
                                <Form.Control required type="text" name="client_name" autoFocus readOnly
                                    value={visitData.clientInfo.firstName + " " + visitData.clientInfo.lastName} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="modalDayControl">
                                <Form.Label>Email</Form.Label>
                                <Form.Control required type="text" name="service" autoFocus readOnly
                                    value={visitData.clientInfo.email} />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a date.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="modalDayControl">
                                <Form.Label>Phone number</Form.Label>
                                <Form.Control required type="text" name="service" autoFocus
                                    value={visitData.clientInfo.phoneNumber}
                                    onChange={e => setVisitData({ ...visitData.clientInfo, phoneNumber: e.target.value })} />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a date.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="modalDayControl">
                                <Form.Label>Additional information</Form.Label>
                                <Form.Control required type="text" name="service" autoFocus readOnly
                                    value={visitData.clientInfo.additionalInfo}
                                    onChange={e => setVisitData({ ...visitData.clientInfo, additionalInfo: e.target.value })} />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a date.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                        <div className="col-md-12 text-center">
                            <Button type="submit" variant="pink">Save</Button>
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