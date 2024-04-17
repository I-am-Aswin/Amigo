import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Routes, Route, useNavigate } from "react-router-dom";
import TimeTable from "./TimeTable";
import Show from "./Show.jsx";
import config from "../../config.js";


function Disp({ dept, sem , loggedIn}) {
    let days = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        0: "Sunday",
    };
    const [periods, setPeriods] = useState({});
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [day, setDay] = useState(new Date().getDay());
    const [classDet, setDetails] = useState({});
    const navigate = useNavigate();

    useEffect( function() {
        if( ! loggedIn ) {
            navigate("/login");
        }
    })

    useEffect(
        function () {

            let data = {};
            if( day === 0 || day === 6 ) {
                setPeriods({});
                setDetails({});
                return;
            }
            axios
                .get(`${config.API_URL}/tt/list/${dept}/${day}/`)
                .then(async (response) => {
                    for (let period of response["data"]) {
                        let resp = await axios.get(
                            `${config.API_URL}/course/list/${dept}/${sem}/${period["CourseId"]}`
                        );
                        data[period["Period"]] = resp["data"][0];
                    }
                    setPeriods(data);
                    setDetails({
                        period: Object.keys(data)[0],
                        cCode: data[Object.keys(data)[0]]["CourseCode"],
                        cName: data[Object.keys(data)[0]]["CourseName"],
                        prev: undefined
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        [day, dept, sem ]
    );

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center attendace">
            <form action="" className="w-100">
                <div className="d-flex justify-content-end justify-content-evenly mt-4">

                    <div className="d-flex align-items-center gap-3">
                        <label htmlFor="date">Date </label>
                        <input
                            className="form-control w-100 px-4 py-2"
                            type="date"
                            id="date"
                            name="date"
                            max={new Date().toISOString().split("T")[0]}
                            value={date}
                            onChange={(e) => {
                                setDate(new Date(e.target.value).toISOString().split("T")[0]);
                                setDay(new Date(e.target.value).getDay());
                                navigate("/dash/");
                            }}
                        />
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <label htmlFor="day">Date </label>
                        <input
                            className="form-control w-100 py-2 bg-white"
                            type="text"
                            id="day"
                            value={days[day]}
                            disabled
                        />
                    </div>
                </div>

            </form>

            
            <Routes>
                {periods && <Route path="/" element={<TimeTable periods={periods} details={setDetails}/>}/>}
                <Route path="show" element={ <Show
                    cDetails = {classDet}
                    date={date}
                    dept={"18A"}
                    /> } />
            </Routes>
        </div>
    )
}

Disp.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    dept: PropTypes.string,
    sem: PropTypes.number,
    children: PropTypes.element
};

export default Disp;
