import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEnvelope, faMapLocationDot, faPhoneFlip} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import emailjs from 'emailjs-com';

const Contact = () => {

    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        if (!form.checkValidity()) {
            return;
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        const form = document.getElementById('contact-form');
        form.reset();
        setShowModal(false);
    };

    const handleSendModal = () => {
        const form = document.getElementById('contact-form');
        sendEmail().then(r => console.log(r));
        form.reset();
        setShowModal(false);
    };

    const sendEmail = async () => {
        const templateParams = {
            to_email: process.env.REACT_APP_ORG_EMAIL,
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            reply_to: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
        };

        try {
            await emailjs.send(
                process.env.REACT_APP_SERVICE_ID,
                process.env.REACT_APP_TEMPLATE_ID,
                templateParams,
                process.env.REACT_APP_USER_ID
            );
            console.log('Email sent');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    return (
        <div className="contact-page p-3">
            <section id="contact" className="color-container p-4">
                <h2 className="h1-responsive font-weight-bold text-center my-4">Contact us</h2>
                <p className="text-center w-responsive mx-auto mb-5">
                    Do you have any questions? Please do not hesitate to contact us directly. Our team will come back to you within
                    a matter of hours to help you.
                </p>
                <Row>
                    <Col md={9} className="mb-md-0 mb-5">
                        <Form id="contact-form" name="contact-form" onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="name">
                                        <Form.Label>Your name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter your name" required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="email">
                                        <Form.Label>Your email</Form.Label>
                                        <Form.Control type="email" placeholder="Enter your email" required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Group controlId="subject">
                                        <Form.Label>Subject</Form.Label>
                                        <Form.Control type="text" placeholder="Enter the subject" required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Group controlId="message">
                                        <Form.Label>Your message</Form.Label>
                                        <Form.Control as="textarea" rows={2} placeholder="Enter your message" required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="text-center text-md-left">
                                <Button type="submit" className="btn-pink" id="submit-button">
                                    Send
                                </Button>
                            </div>
                        </Form>
                    </Col>
                    <Col md={3} className="text-center">
                        <ul className="list-unstyled mb-0">
                            <li>
                                <FontAwesomeIcon icon={faMapLocationDot} size="2xl" />
                                <p>Wrocław, Oławska 7, Poland</p>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faPhoneFlip} size="2xl" />
                                <p>+ 01 234 567 89</p>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faEnvelope} size="2xl" />
                                <p>ztw.zuzia@gmail.com</p>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </section>
            <hr className="my-5" />
            <section id="map">
                <h2 className="h1-responsive font-weight-bold text-center my-4">Find us here</h2>
                <div
                    id="map-container-google-1"
                    className="z-depth-1-half map-container"
                    style={{ height: '500px' }}
                >
                    <iframe
                        src="https://maps.google.com/maps?q=Oławska%207, Wrocław&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: '0' }}
                        allowFullScreen=""
                    ></iframe>

                </div>
            </section>


            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm contact</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    By submitting this form, you agree to receive an answer by email.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSendModal}>
                        Send
                    </Button>
                    <Button variant="danger" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Contact;