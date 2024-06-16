import { useState, useEffect } from "react";
import { PropTypes } from "prop-types"

const CourseTab = ( { courseData, addCourse }) => {
    
    const [disabler, disable] = useState(false);
    const [btnchanger, chbtn] = useState(false);
    const [ course, setCurr ] = useState( {
        Id: "",
        Course: "",
        Abbr: "",
        Credits: "",
        Batch: false
    });

    useEffect(() => {
        if( courseData ) {
            setCurr( courseData );
            disable(true);
            chbtn(true);
        } else {
            disable(false);
        }
    }, [ courseData ]);
    

    let handleChange = ( e ) => {
        setCurr( prev => ({
            ...prev,
            [e.target.name]: (e.target.type=="checkbox")? e.target.checked : e.target.value
        }))
    }

    function handleDivClick(event) {
        if (event.target.type !== "checkbox") {
            let chkbx = event.currentTarget.querySelector('input[type="checkbox"]');
            if (chkbx) {
                let { name, checked } = chkbx;
                setCurr(previous => ({
                    ...previous,
                    [name]: !checked
                }))
            }
        }
    }

    let handleSub = () => {
        if( ! courseData ) {
            addCourse(course);
        } else {
            addCourse(course, courseData.Id);
            disable(true);
        }
    }

    let handleCancel = () => {
        if( !courseData ) {
            addCourse( undefined, undefined );
        } else {
            disable( true );
            setCurr( courseData );
        }
    }

    return ( <div className="p-2">

        <div className="row row-cols-2 p-5 border border-2 w-75 mx-auto">
            <div className="col">
                <label htmlFor="id" className="form-label">Id :</label>
                <input type="text" className="form-control" name="Id" value={course.Id} onChange={handleChange} disabled={disabler}/>
            </div>

            <div className="col">
                <label htmlFor="credits" className="form-label">Credits :</label>
                <input type="text" className="form-control" name="Credits" id="credits" value={course.Credits} onChange={handleChange} disabled={disabler}/>
            </div>

            <div className="col">
                <label htmlFor="CName" className="form-label">Name :</label>
                <input type="text" className="form-control" name="Course" id="Cname" value={course.Course} onChange={handleChange} disabled={disabler}/>
            </div>

            <div className="col">
                <label htmlFor="abbr" className="form-label">Abbreviation :</label>
                <input type="text" className="form-control" name="Abbr" id="abbr" value={course.Abbr} onChange={handleChange} disabled={disabler}/>
            </div>

            <div className="col d-flex gap-1 align-items-center" onClick={handleDivClick}>
                <input type="checkbox" className="form-check" checked={course.Batch} name="Batch" onChange={handleChange} disabled={disabler}/>
                <label htmlFor="batch" className="form-label">Batch Wise Attendance for the Course</label>
            </div>

            { disabler ? <button className="btn btn-secondary" onClick={ () => disable(false)}>Edit</button> :
            <div className="buttons pt-3">
                <button className="btn btn-secondary" onClick={handleSub}> { btnchanger ? "Update" : "Add"} </button>
                <button className="btn btn-secondary mx-2" onClick={handleCancel}>Cancel</button>
            </div> }
        </div>
    </div> );
}
 
export default CourseTab;

CourseTab.propTypes = {
    courseData: PropTypes.object,
    addCourse: PropTypes.func
}