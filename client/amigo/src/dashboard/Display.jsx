// import { useState } from "react";
import { PropTypes } from "prop-types";
import { Routes, Route, Link } from "react-router-dom"
import Disp from "./tables/Disp.jsx";

function Display( {dept} ) {

    // const [ date, setDate ] = useState(new Date().toISOString().split("T")[0]);
    // const [ cCode, setCCode ] = useState("");cCode;


    return ( <div>

        <div className="disp-content">
            <Routes>
                {/* <Route path="/" element={ <Dates dept={dept} setDate={setDate}/> } />
                <Route path="/courses" element={ <Courses dept={dept} date={date} setCode={setCCode}/> } />
                <Route path="/data" element= { <Data/> }/> */}
                <Route path="/*" element={ <Disp dept={dept} sem={4} loggedIn={true}/> } />
            </Routes>
        </div>

        <Link to="/dash/adder" className="add-records btn p-3"> Add Records </Link>
    </div> );
}

export default Display;

Display.propTypes = {
    dept: PropTypes.string.isRequired,
}