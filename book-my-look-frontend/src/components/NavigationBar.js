import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";
import getLoggedUser from '../context/auth';
// import getLoggedUser from '../auth/auth';
// import useAuth from "./AuthContext";

function NavigationBar() {
    // const { user } = useAuth();
    const user = getLoggedUser();
    // console.log("user:" + user);

    function loggedInNav() {
        return (
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/availability" style={{ color: 'white' }}>Availability</Nav.Link>
                            <Nav.Link href="/my-visits" style={{ color: 'white' }}>My visits</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link href="/employee-login" style={{ color: 'white' }}>
                                <FontAwesomeIcon icon={faUserLock} />
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
        )
    }

    function guestNav() {
        return (
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/" style={{ color: 'white' }}>Home</Nav.Link>
                            <Nav.Link href="/full-offer" style={{ color: 'white' }}>Full offer</Nav.Link>
                            <Nav.Link href="/out-team" style={{ color: 'white' }}>Our team</Nav.Link>
                            <Nav.Link href="/book-visit" style={{ color: 'white' }}>Book visit</Nav.Link>
                            <Nav.Link href="/contact" style={{ color: 'white' }}>Contact</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link href="/employee-login" style={{ color: 'white' }}>
                                <FontAwesomeIcon icon={faUserLock} />
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
        )
    }

    return (
        <Navbar collapseOnSelect expand="lg" fixed="top" variant="dark" className="navbar-color">
            <Container fluid>
                <Navbar.Brand>BookMyLook</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                { user !== null ? loggedInNav(): guestNav() }
                </Container>
            </Navbar>
    )
}

export default NavigationBar;
