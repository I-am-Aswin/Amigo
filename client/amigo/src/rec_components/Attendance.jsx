import { PropTypes } from "prop-types"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import config from "../config";


function Attendance({ cDetails, batch, dept, date }) {

    const { period, cCode, cName, prev } = cDetails;

    let [studs, setStuds] = useState({});
    let [checks, setChecks] = useState({});
    const navigate = useNavigate();

    useEffect(function () {

        async function readStuds() {
            const res = await axios.get(`${config.API_URL}/student/list/${batch}/${dept}`);
            setStuds(res["data"]);

            let dummy = {};
            for (let stud of res["data"]) {
                dummy[stud["RollNo"]] = true;
            }
            setChecks(dummy);
        }
        readStuds();
    }, [batch, dept, date]);

    async function getPrevious(e) {
        let { checked } = e.target;

        if (checked) {
            let resp = await axios.get(`${config.API_URL}/records/data/${date}/${prev}`);

            if (resp["data"].length > 0) {
                let dummy = {};
                for (let { RollNo, status } of resp["data"]) {
                    dummy[RollNo] = status;
                }
                setChecks(dummy);
            }
        } else reset();
    }

    function handleChange(event) {
        let { name, checked } = event.target;
        setChecks(previous => ({
            ...previous,
            [name]: checked
        }));
    }

    function handleDivClick(event) {
        if (event.target.type !== "checkbox") {
            let chkbx = event.currentTarget.querySelector('input[type="checkbox"]');
            if (chkbx) {
                let { name, checked } = chkbx;
                setChecks(previous => ({
                    ...previous,
                    [name]: !checked
                }))
            }
        }
    }

    async function handleSubmit() {

        let status = [];
        for (let [key, val] of Object.entries(checks)) {
            status.push({ "RollNo": key, "Status": val });
        }

        let body = {
            cCode: cCode,
            period: period,
            date: date,
            dept: dept,
            status: JSON.stringify(status)
        }

        try {
            let process = await axios.post(`${config.API_URL}/records/data/add`, body, { timeout: 5000 });
            if (!process["data"]) {
                window.alert("Current Attendance Record Added Already");
            }
        } catch (err) {
            console.log(err);
        } finally {
            navigate("/dash/adder");
        }
    }

    function strCapitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    function reset() {
        let dummy = [];
        for (let key of Object.keys(checks)) {
            dummy[key] = true;
        }
        setChecks(dummy);
        document.querySelector("#getprevious").checked = false;
    }

    return (
        <div className="container d-flex justify-content-center flex-column attendance w-100 mt-4 mx-auto">


            <div className="row fs-4">
                <div className="col-12 details d-flex gap-2 justify-content-evenly">
                    <p className="d-inline">CourseCode : {cCode}</p>
                    <p className="d-inline" >CourseName : {cName}</p>
                </div>
            </div>

            <div className="row">
                <form className="d-flex flex-column mt-3 mb-5" onSubmit={(e) => e.preventDefault()}>

                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <label className="fs-5 fw-bold">Students List :</label>
                        {prev && <div className="form-check form-switch">
                            <input type="checkbox" className="form-check-input" onChange={getPrevious} id="getprevious" defaultChecked={false} />
                            <label className="form-check-label">Get Previous Attendance</label>
                        </div>}
                    </div>

                    <div className="d-flex justify-content-evenly align-items-center">
                        <div className="d-flex gap-3 align-items-center my-3">
                            <label htmlFor="present">Present </label>
                            <input className="form-control bg-white w-50" type="text" value={Object.values(checks).filter(ele => ele).length} disabled />
                        </div>

                        <div className="d-flex gap-3 align-items-center">
                            <label htmlFor="absent">Absent </label>
                            <input className="form-control bg-white w-50" type="text" value={Object.values(checks).filter(ele => !ele).length} disabled />
                        </div>

                        <input className="btn btn-lavendar w-25" type="submit" value="Submit" onClick={handleSubmit} />

                        <button className="reset-btn" onClick={reset}><i className="fas fa-undo"></i></button>


                    </div>

                    <div className="row row-cols-3row-cols-lg-6 row-cols-md-5 mb-3" >
                        {studs && Object.values(studs).map(function (element) {
                            return <div key={element["RollNo"]} className={"chkbx col text-center p-2 m-3 border " + (checks[element["RollNo"]] ? "green-glow" : "red-glow")} onClick={handleDivClick}>
                                <input
                                    type="checkbox"
                                    name={element["RollNo"]}
                                    checked={checks[element["RollNo"]]}
                                    onChange={handleChange}
                                    className="col"
                                    hidden
                                />
                                <label htmlFor={element["RollNo"]}>{element["RollNo"].slice(8, 11)} </label>
                                <label className="d-block"> {strCapitalize(element["Name"].split(' ')[0])}</label>
                            </div>
                        })}
                    </div>

                </form>
            </div>
        </div>
    );
}

Attendance.propTypes = {
    cDetails: PropTypes.object.isRequired,
    batch: PropTypes.string.isRequired,
    dept: PropTypes.string,
    date: PropTypes.string.isRequired,
};

export default Attendance;
