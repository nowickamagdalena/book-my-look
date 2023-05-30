import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from 'axios';
import getLoggedUser from "../auth/auth";
import Button from 'react-bootstrap/Button';

const EmployeeLogin = () => {
    const [user, setUser] = useState({});

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "455697851341-vji54tpi9uqtrqfd06eo59najah4tbk3.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large" }
        )

        const loggedInUser = getLoggedUser();
        if (loggedInUser) {
          setUser(loggedInUser);
          document.getElementById("signInDiv").hidden = false;
        }
    }, []);

    function handleCallbackResponse(response) {
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
                document.getElementById("signInDiv").hidden = true;
                setUser(userObject);
                localStorage.setItem("user", JSON.stringify(userObject));
            })
            .catch((error) => {
                //TODO: display error to user
                console.error(error);
            })

    }

    function handleSignOut(response) {
        setUser({});
        localStorage.clear();
        document.getElementById("signInDiv").hidden = false;
    }


    return (
        <div className="employee-login">
            <h2>EmployeeLogin</h2>
            <div id="signInDiv"></div>
            {
                user && <div id="logoutDiv"></div>
            }
            {Object.keys(user).length !== 0 &&
             <Button variant="secondary" onClick={(e) => handleSignOut(e)}>Sign out</Button>
            }
        </div>
    );
}

export default EmployeeLogin;