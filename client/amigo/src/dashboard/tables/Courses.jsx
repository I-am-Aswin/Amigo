import { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import config from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Courses( {dept, date, setCode}) {

    const [courses, setCourses ] = useState([]);
    const navigate = useNavigate();
    date;

    useEffect( function() {
        
        async function readDates() {
            let dummy = [];
            let resp = await axios.get(`${config.API_URL}/records/data/courses/${dept}/${date}`);
            
            for ( let x of resp["data"] ) {
                let crs = await axios.get(`${config.API_URL}/course/list/${dept}/4/${x["CourseCode"]}}`);
                dummy.push( crs["data"][0] );
            }

            console.log(dummy);
            setCourses(dummy);
            
        }
        readDates();
    }, [dept, date]);

    function handleClick(e) {
        setCode( new Date(e.target.key) );
        navigate( "/dash/")   
    }

    return ( <div className="Dates">
        <table className="dates-table">
            <thead>
                <tr className="trow">
                    <th></th>
                    <th>Day</th>
                    <th>Number of Courses</th>
                </tr>
            </thead>

            <tbody>
                { courses.map( row => {
                    return <tr key={row["Date"]} onClick={handleClick} className="trow">
                        <td>{row["Date"]}</td>
                        <td>{(new Date(row["Date"])).getDay() }</td>
                        <td>{row["Periods"]}</td>
                    </tr>
                })}
            </tbody>

        </table>
    </div> );
}

export default Courses;

Courses.propTypes = {
    dept: PropTypes.string.isRequired,
    setCode: PropTypes.func.isRequired,
}