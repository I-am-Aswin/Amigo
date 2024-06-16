import { useState, useEffect, useId} from "react";
import { PropTypes } from "prop-types";

const TtTemplate = ( {period, courses, action, ccode} ) => {

    const [choose, setChoose] = useState("");
    const id = useId();
    
    useEffect( ()=>{
        setChoose( ccode ? ccode.Course : "");
    }, [ccode])

    function handleChange(e) {
        setChoose( e.target.value );
        action( prev => {
            let nArr = [ ...prev ];
            nArr[period-1] = ( e.target.value !== "") ? {Period:period, Course: e.target.value} : undefined;
            return nArr;
        } );
        
    }

    return ( <div className="d-flex align-items-center justify-content-around w-100 my-2">
        <label htmlFor={id} className="form-label">Period - {period} : </label>
        <select name="course" id={id} className="form-select w-75" value={choose} onChange={handleChange}>
            <option value={""}></option>
            { courses.map( crs => {
                return <option key={crs["CourseCode"]} value={crs.CourseCode}>{crs.CourseName} - { crs.CourseCode }</option>
            })}

        </select>

    </div>);

}
 
export default TtTemplate;

TtTemplate.propTypes = {
    period: PropTypes.number,
    courses: PropTypes.array,
    action: PropTypes.func,
    ccode: PropTypes.object
}