import { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import config from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dates( {dept, setDate}) {

    const [dates, setDates ] = useState([]);
    const navigate = useNavigate();

    useEffect( function() {
        
        async function readDates() {
            let resp = await axios.get(`${config.API_URL}/records/data/dates/${dept}`);
            setDates(resp["data"]);
        }
        readDates();
    }, [dept]);

    function handleClick(e) {
        setDate( new Date(e.target.key) );
        navigate( "/dash/data");
    }

    return ( <div className="Dates">
        <table className="dates-table">
            <thead>
                <tr className="trow">
                    <th>Date</th>
                    <th>Day</th>
                    <th>Number of Courses</th>
                </tr>
            </thead>

            <tbody>
                { dates.map( row => {
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

export default Dates;

Dates.propTypes = {
    dept: PropTypes.string.isRequired,
    setDate: PropTypes.func.isRequired,
}