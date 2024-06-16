import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import DashBoard from "./dashboard/DashBoard.jsx";
import Login from "./login/Login.jsx";
import Logout from "./login/Logout.jsx";
import Register from "./login/Register.jsx";
import Home from "./dashboard/Home.jsx";
import StudData from "./DataUploads/StudData.jsx";
import CourseData from "./DataUploads/CourseData.jsx";
import TtSuper from "./DataUploads/TtSuper.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "./App.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


function App () {

  const [rep, setRep ] = useState({});
  const [loggedIn, setLogIn ] = useState(false);

  function dashNav( data ) {
    setLogIn(true);
    setRep( data );
  }

  function logout() {
    setLogIn(false);
    setRep({});
  }

  return (
    <>
      <Router>
        <Routes> 
          <Route path="/" element= { <Home /> }/>
          <Route path="/login" element={ <Login onSuccess={dashNav} loggedIn={loggedIn}/>} />
          <Route path="/student/uploads" element={ <StudData dept={rep.Department} />} />
          <Route path="/course/uploads" element={ <CourseData dept={rep.Department} />} />
          <Route path="/tt/uploads" element={ <TtSuper dept={rep.Department} />} />
          <Route path="/register" element={ <Register method={0}/> } />
          <Route path="/change" element={ <Register method={1} rep={rep} loggedIn={loggedIn}/> } />
          <Route path="/logout" element={ <Logout setLoggedIn={logout} /> } />
          <Route path="/dash/*" element={ <DashBoard rep={rep} loggedIn={loggedIn} />} />
        </Routes>
      </Router>

    </>
  );
}

export default App;