import { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import TtTemplate from "./TtTemplate.jsx";

const TtData = ( {courses, data, update} ) => {   

    const [periods, setPeriods] = useState([]);

    useEffect( ()=> {
        setPeriods(data);
    }, [data]);

    return ( <div className="d-flex flex-column border py-3 px-5 w-100 gap-2 my-3">
        { JSON.stringify(periods) }
        { courses && [1,2,3,4,5,6,7,8].map( hour => (
            <TtTemplate key={hour} period={ hour } courses={ Object.values(courses) } action={setPeriods} ccode={periods[hour-1]} />
        ))}
        <button className="btn btn-primary px-3 py-2" type="button" onClick={ () => update(periods) }> { data.length > 0 ? "Modify" : "Add"} </button>
    </div>
    );
}


export default TtData;

TtData.propTypes = {
    courses: PropTypes.array,
    data: PropTypes.array,
    update: PropTypes.func
}