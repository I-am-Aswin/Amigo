import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import Adder from "../rec_components/Adder.jsx";
import Display from "./Display.jsx";
// import config from "../config.js";

function DashBoard( {rep, loggedIn } ) {

    const navigate = useNavigate();
    
    useEffect( function() {
        if( !loggedIn ) {
            navigate("/login");
        }
    }, [loggedIn, navigate]);

    return ( 
        <>
            <NavBar rep={rep} />
            <Routes>
                <Route path="/*" element={ <Display dept={rep.Department}/>} />
                <Route path="/adder/*" element={ <Adder dept={rep["Department"]} sem={4} loggedIn={loggedIn}/> }/>
            </Routes>
        </>
     );
}

export default DashBoard;

DashBoard.propTypes = {
    rep: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
}