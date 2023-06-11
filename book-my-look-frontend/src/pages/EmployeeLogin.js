import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from 'axios';
import getLoggedUser from "../context/auth";
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import Alert from "react-bootstrap/Alert";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const EmployeeLogin = () => {
    const [user, setUser] = useState({});
    const { setCurrentUser } = useAuth();
    const navigate = useNavigate();
    const loggedInUser = getLoggedUser();
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {

        if (loggedInUser) {
            setUser(loggedInUser);
            document.getElementById("sign-in-button").hidden = true;
            document.getElementById("sign-in-prompt").hidden = true;
        }
        /* global google */
        google.accounts.id.initialize({
            client_id: "455697851341-vji54tpi9uqtrqfd06eo59najah4tbk3.apps.googleusercontent.com",
            callback: handleGoogleCallbackResponse
        })

        google.accounts.id.renderButton(
            document.getElementById("sign-in-button"),
            { theme: "filled_black", size: "large" }
        )
    }, [setCurrentUser]);

    function handleGoogleCallbackResponse(response) {
        console.log("Encoded JWT ID token: " + response.credential);
        const id_token = response.credential;
        const decodedUser = jwt_decode(response.credential);

        axios.get(`http://localhost:8080/employees/${decodedUser.email}/details`, {
            headers: {
                'Authorization': `Bearer ${id_token}`
            }
        })
            .then((res) => {
                const userData = res.data;
                const userObject = { employeeId: userData.id, firstName: userData.firstName, lastName: userData.lastName, email: userData.email, id_token: id_token };
                setUser(userObject);
                setCurrentUser(JSON.stringify(userObject));
                setShowAlert(false)
                setErrorMessage('')
                navigate("/availability");
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage(error.response.data.message)
                setShowAlert(true)
            })

    }

    function handleSignOut(response) {
        document.getElementById("sign-in-button").hidden = false;
        setUser(null);
        setCurrentUser();
        navigate("/");
        navigate(0);
        // TODO: fix this refreshing so the navbar will update like during sign in
    }


    return (
        <div className="employee-login page">
            <div className="employee-panel-container">
                {loggedInUser && <div id="sign-out-div"><Button id="sign-out-button" className="float-right" variant="secondary" onClick={(e) => handleSignOut(e)}>Sign out</Button></div>}
                <div className="employee-panel">
                    <h2>Employee panel</h2>
                    <div id="sign-in-prompt"><p>Click the button below to sign in with your Google account</p></div>
                    <div id="sign-in-div">
                        <div id="sign-in-button"></div>
                    </div>

                    {loggedInUser && <div className="employee-info">
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label column >First name</Form.Label>
                                <Form.Control column type="text" readOnly
                                    value={loggedInUser.firstName} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control type="text" readOnly
                                    value={loggedInUser.lastName} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="text" readOnly
                                    value={loggedInUser.email} />
                            </Form.Group>
                        </Form>
                    </div>}
                </div>
            </div>
            <Alert show={showAlert} variant="danger">
                <Alert.Heading>Something went wrong!</Alert.Heading>
                {errorMessage}
            </Alert>
        </div>
    );
}

export default EmployeeLogin;