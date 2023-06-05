import './styles.css';
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import Contact   from "./pages/Contact";
import BookVisit from "./pages/BookVisit";
import EmployeeLogin from "./pages/EmployeeLogin";
import OurTeam from "./pages/OurTeam";
import EmployeeAvailability from './pages/EmployeeAvailability';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
// import useAuth from "./components/AuthContext";

function App() {  
  
  // const { auth } = useAuth();
  return (
      <Router forceRefresh={true}>
        <div className="App">
            <NavigationBar />
            <div className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/out-team" element={<OurTeam />} />
                    <Route path="/book-visit" element={<BookVisit />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/employee-login" element={<EmployeeLogin />} />
                    <Route path="/availability" element={<EmployeeAvailability />} />
                </Routes>
            </div>
        </div>
      </Router>
  );
}

export default App;
