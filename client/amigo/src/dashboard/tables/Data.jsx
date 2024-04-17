import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config.js";

function Data() {

    const [status, setStatus ] = useState([]);

    useEffect( function() {
        async function readSts( ) {
            let resp = await axios.get(`${config.API_URL}/records/data/2024-04-04/22IES412`)
            setStatus( resp["data"]);
        }
        readSts;
    }, [])

    return ( <div>
        {JSON.stringify(status)};
    </div> );
}

export default Data;