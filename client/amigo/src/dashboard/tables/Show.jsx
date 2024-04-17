import { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import axios from "axios";
import config from "../../config";

function Show( {cDetails, date, dept }) {

    let [studs, setStuds] = useState({});
    let [checks, setChecks] = useState({});

    useEffect(function () {

        async function readStuds() {
            const res = await axios.get(`${config.API_URL}/student/list/2026/18A`);
            setStuds(res["data"]);

            const att = await axios.get(`${config.API_URL}/records/data/${date}/${cDetails.cCode}`);
            if (att["data"].length > 0) {
                let dummy = {};
                for (let { RollNo, status } of att["data"]) {
                    dummy[RollNo] = status;
                }
                setChecks(dummy);
            }
        }
        readStuds();
    }, [cDetails, dept, date]);

    return ( <div>

        <table className="dates-table">
            <thead>
            <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Mail Id</th>
                <th>Date</th>
                <th>CourseCode</th>
                <th>Status</th>
            </tr>
            </thead>

            <tbody>
            {Object.values(studs).map( student => {
                return (
                    <tr key={student["RollNo"]} className={"trow " + ((checks[student["RollNo"]] == 0) ? "abs": "")} >
                        <td>{student["RollNo"]}</td>
                        <td>{student["Name"]}</td>
                        <td>{student["MailId"]}</td>
                        <td>{date}</td>
                        <td>{cDetails.cCode}</td>
                        <td>{ (checks[student["RollNo"]] == 1) ? "Present" : "Absent" }</td>

                    </tr>
                )
            })}
            </tbody>
        </table>

    </div> );
}

Show.propTypes = {
    cDetails: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    dept: PropTypes.string.isRequired
}

export default Show;