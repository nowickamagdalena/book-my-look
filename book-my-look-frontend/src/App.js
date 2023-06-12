import './styles.css';
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import Contact   from "./pages/Contact";
import BookVisit from "./pages/BookVisit";
import EmployeeLogin from "./pages/EmployeeLogin";
import OurTeam from "./pages/OurTeam";
import EmployeeAvailability from './pages/EmployeeAvailability';
import EmployeeVisits from './pages/EmployeeVisits';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {  useState } from "react";

import { AuthContext } from './context/AuthContext';
import FullOffer from "./pages/FullOffer";
import EmployeeProfile from "./pages/EmployeeProfile";
// import useAuth from "./components/AuthContext";

function App() {  
  
  const [currentUser, setCurrentUser] = useState();

  const setAuth = (data) => {
    if(data) {
      localStorage.setItem("user", data);
        setCurrentUser({user: data});
        // console.log('Data in setAuth: ', data);
    } else { 
      localStorage.clear();
      setCurrentUser();
      console.log("Data is not present!!")
    }

  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser: setAuth }}>
      <Router forceRefresh={true}>
        <div className="App">
            <NavigationBar />
            <div className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/out-team" element={<OurTeam />} />
                    <Route path="/employee-profile" element={<EmployeeProfile />} />
                    <Route path="/full-offer" element={<FullOffer />} />
                    <Route path="/book-visit" element={<BookVisit />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/employee-login" element={<EmployeeLogin />} />
                    <Route path="/availability" element={<EmployeeAvailability />} />
                    <Route path="/my-visits" element={<EmployeeVisits />} />
                </Routes>
            </div>
        </div>
      </Router>
      </AuthContext.Provider>
  );
}

export default App;
