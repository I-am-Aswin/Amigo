import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import axios from "axios";
import CourseTab from "./CouseTab.jsx";
import config from "../config.js";

const CourseData = ( {dept} ) => {

    let semRef = useRef();
    const [ courses, setCourses ] = useState( [] );
    const [ newc, setnewc ] = useState( false );
    const navigate = useNavigate();

    useEffect( ()=>{
        if( !dept ) {
            navigate('/login');
        }
    }, [navigate, dept])

    let addCourses = ( course, id ) => {
        if( !course ) { setnewc(false); return; }
        if( !id ) {
            setCourses( prev => {
                prev.push(course);
                return prev;
            })
            setnewc(false);
        } else {
            setCourses( prev => {
                prev = prev.map( crs => {
                    if( crs.Id === id ) {return course; }
                    else return crs; 
                });
                return prev;
            })
        }
    }

    let handleSubmit = async (e) => {
        e.preventDefault();

        let body = new FormData();
        body.append('sem', semRef.current.value);
        body.append('dept', dept);
        body.append('courses', JSON.stringify(courses));

        let resp = await axios.post( `${config.API_URL}/course/create`, body);
        if( resp["data"].ok ) {
            window.alert("Data Added Successfully");
            navigate("/dash");
        } else {
            window.alert("Error Uploading Data");
            navigate("/course/upload");
        }
    }

    return ( <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="Semester" className="form-label">Semester : </label>
            <input type="number" className="form-control" min={1} max={8} id="Semester" ref={semRef} />

            <p className="h3">Add Course Details : </p>
            { courses.map( course => (
                <CourseTab key={course.Id} courseData={course} addCourse={addCourses}/>
            ))}

            { newc ? <CourseTab addCourse={addCourses} /> :
            <button className="btn btn-outline-success p-3 w-min mx-auto rounded display-1 text-center" onClick={ () => setnewc( true )}><h1>+</h1></button> }
        
            <input type="submit" className="btn btn-primary" />
        </form>

        { JSON.stringify(courses) }
         

    </div> );
}
 
export default CourseData;

CourseData.propTypes = {
    dept: PropTypes.string
}