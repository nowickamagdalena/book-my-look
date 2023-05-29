import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

const EmployeeLogin = () => {
    const [user, setUser] = useState({});

    function handleCallbackResponse(response) {
        console.log("Encoded JWT ID token: " + response.credential);
        var userObject = jwt_decode(response.credential);
        console.log(userObject);
        document.getElementById("signInDiv").hidden = true;
        setUser(userObject);
    }

    function handleSignOut(response) {
        setUser({});
        document.getElementById("signInDiv").hidden = false;
    }

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

    }, []);

    return (
        <div className="employee-login">
            <h2>EmployeeLogin</h2>
            <div id="signInDiv"></div>
            {
                user && <div id="logoutDiv"></div>
            }
            {Object.keys(user).length != 0 &&
                <button onClick={(e) => handleSignOut(e)}>Sign out</button>
            }
        </div>
    );
}

export default EmployeeLogin;