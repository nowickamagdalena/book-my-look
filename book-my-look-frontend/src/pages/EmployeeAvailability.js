import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { startOfWeek, endOfWeek } from 'date-fns'
import FullCalendar from '@fullcalendar/react'
// import { Calendar } from '@fullcalendar/core'
import timeGridPlugin from '@fullcalendar/timegrid'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

// const event = { title: 'Manicure', start: "2023-05-23T12:00:00", end: "2023-05-23T14:00:00" };

const EmployeeAvailability = () => {
    const params = useParams();
    const userId = params.userId;
    var date = new Date();
    const start = startOfWeek(date, { weekStartsOn: 1 }).toISOString().split('T')[0];
    const end = endOfWeek(date, { weekStartsOn: 1 }).toISOString().split('T')[0];

    const [events, setEvents] = useState([]);
    useEffect(() => {

        fetch(`http://localhost:8080/employees/${userId}/availabilities?startDate=${start}&endDate=${end}`)
            .then(res => {
                return res.json();
            })
            .then(data => {
                const newEvents = data.map(aval => {
                    return { title: "Available", start: `${aval.date}T${aval.startTime}`, end: `${aval.date}T${aval.endTime}` };
                });
                setEvents(newEvents)
                // console.log("Events", events);
            });
    }, [])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [formStartTime, setFormStartTime] = useState('');
    const [formEndTime, setFormEndTime] = useState('');
    const [validated, setValidated] = useState(false);
    const handleSave = (event) => {
        const form = event.currentTarget;
        const startT = formStartTime.split(':').map(s => parseInt(s));
        const endT = formEndTime.split(':').map(s => parseInt(s));
        if (form.checkValidity() === false || (startT[0] > endT[0]) || (startT[0] === endT[0] && startT[1] >= endT[1])) {
            //TODO: Display this message to user, Also validate only 15 minutes can be chosen maybe change for time picker
            console.log("Display this message to user");
            console.log("Also validate only 15 minutes can be chosen maybe change for time picker");
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: event.target.date.value, startTime: event.target.startTime.value, endTime: event.target.endTime.value })
        };
        fetch(`http://localhost:8080/employees/${userId}/availabilities`, requestOptions)
            .then((res) => res.json())
            .then((post) => console.log(post))
            .catch((err) => {
                //TODO: add error handling message for user
                console.log(err.message);
            });
        // console.log(userId, event.target.date.value, event.target.startTime.value, event.target.endTime.value);

    };

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
                    <Modal.Title>New availability</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSave}>
                        <Form.Group className="mb-3" controlId="modalDayControl">
                            <Form.Label>Enter day</Form.Label>
                            <Form.Control required type="date" name="date" autoFocus />
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
            />
        </div>
    );
}

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    )
}

export default EmployeeAvailability;