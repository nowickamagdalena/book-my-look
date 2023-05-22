import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserLock} from "@fortawesome/free-solid-svg-icons";

const NavigationBar = () => {
    return (
        <Navbar collapseOnSelect expand="lg" fixed="top" variant="dark" className="navbar-color">
            <Container fluid>
                <Navbar.Brand>BookMyLook</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/" style={{ color: 'white' }}>Home</Nav.Link>
                        <Nav.Link href="/out-team" style={{ color: 'white' }}>Our team</Nav.Link>
                        <Nav.Link href="/book-visit" style={{ color: 'white' }}>Book visit</Nav.Link>
                        <Nav.Link href="/contact" style={{ color: 'white' }}>Contact</Nav.Link>
                        <Nav.Link href="/availability/1" style={{ color: 'white' }}>Availability</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href="/employee-login" style={{ color: 'white' }}>
                            <FontAwesomeIcon icon={faUserLock} />
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
