import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import axios from "axios";
import config from "../config.js";
import TtData from "./TtData.jsx";

const TtSuper = ( {dept} ) => {

    let weekDays = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday"
    };

    const [day, setDay ] = useState(1);
    const [courses, setCourses] = useState([]);
    const [ tt, setTT ] = useState( { 1:[], 2:[], 3:[], 4:[], 5:[] } );
    const [ completion, setCompletion ] = useState(false);
    const navigate = useNavigate();

    
    useEffect( ()=> {
        if( !dept ) { navigate("/login");return; }
        (async () => {
            let resp = await axios.get(`${config.API_URL}/course/list/${dept}/4`);
            setCourses( resp["data"] );
        })();
    }, [dept, navigate]);

    useEffect( () => {
        if( Object.values(tt).filter( x => x.length > 0 ).length === 5 ) {
            setCompletion(true);
        }
    }, [ tt ]);

    let handleSub = async (e) => {
        e.preventDefault();

        let newtt = { ...tt };
        for( let [key, val] of Object.entries( newtt ) ) {
            newtt[key] = val.filter( x => x );
        }

        let body = new FormData();
        body.append('dept', dept);
        body.append('tt', JSON.stringify(newtt) );

        let resp = await axios.post(`${config.API_URL}/tt/create`, body);

        if( resp["data"].ok ) {
            window.alert("TimeTable Uploaded Succesfully");
            navigate('/dash')
        } else {
            window.alert("Error Uploading Timetable");
        }
    }

    let handlettUpd = ( period ) => {

        // period = period.filter( x => x !== null );
        setTT( prev => {
            let nr = {...prev};
            nr[day] = period;
            return nr;
        });
        window.alert( `Timetable for ${weekDays[day]} is updated Successfully...!`);
    }

    return ( <div className="mt-5">
        <form className="d-flex flex-column align-items-center justify-content-center border w-75 mx-auto p-5" onSubmit={handleSub}>
            <div className="d-flex align-items-center justify-content-around w-100" >
                <label htmlFor="day" className="form-label">Day : </label>
                <select name="day" id="day" className="form-select w-50" defaultValue={day} onChange={ (e)=>{ setDay(e.target.value) }}>
                    {Object.entries(weekDays).map( ([ key, val ]) => (
                        <option key={key} value={key}>{val}</option>
                    ))}
                </select>
            </div>

            <TtData courses={courses} data={tt[day]} update={handlettUpd} day={day}/>

            <input type="submit" className="btn btn-primary py-3 px-4 w-25" value="Upload" disabled={!completion}/>
        </form>
    </div> );
}
 
export default TtSuper;

TtSuper.propTypes = {
    dept: PropTypes.string
}