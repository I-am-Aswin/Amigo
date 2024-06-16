import {useState, useEffect} from "react";
import {PropTypes} from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config.js";


const StudData = ( {dept} ) => {

    const [pass, setPass] = useState(""); 
    const [ bat, setBatch ] = useState("");
    const [file, setFile] = useState(null);
    const [heads, setHeads] = useState({
        roll: "",
        name: "",
        mailId: "",
    
    });
    
    const navigate = useNavigate();

    useEffect( () => {
        if( !dept ) { navigate("/login") }
    }, [dept, navigate]);

    const handleCh = ( event ) => {
        setHeads( (prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    const handleSubmit = async ( e ) => {
        e.preventDefault();

        if( ! pass.match( /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/ ) ) {
            window.alert("Invalid Password");
            return;
        }

        let body = new FormData();
        body.append( 'student_datasheet', file);
        body.append( 'password', pass);
        body.append( 'department', dept);
        body.append( 'batch', bat );
        body.append( 'key_heads', JSON.stringify([heads.roll, heads.name, heads.mailId]));

        try {
            let res = await axios.post(`${config.API_URL}/student/list/update`, body, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if( res["data"].ok ) {
                window.alert("Data Uploaded Successfully");
            } else {
                window.alert("Error Uploading Data");
            }
        } catch ( err ) {
            console.log(err);
        }

    }

    return ( <div className="row m-auto">
        <form onSubmit={handleSubmit}>
            <div className="d-flex">
                <label htmlFor="File" className="form-label">CSV file Containing Student Data : </label>
                <input type="file" accept=".csv" className="form-file" onChange={ (e) => setFile(e.target.files[0])} required/>
            </div>

            <div className="row-cols-3">
                <div className="col">
                    <label htmlFor="RollNo" className="form-label d-block">Roll No: </label>
                    <input type="text" className="form-control " id="RollNo" name="roll" value={heads.roll} onChange={handleCh} required/>
                </div>
                <div className="col">
                    <label htmlFor="Name" className="form-label d-block">Name: </label>
                    <input type="text" className="form-control " id="Name" name="name" value={heads.name} onChange={handleCh} required/>
                </div>
                <div className="col">
                    <label htmlFor="mailId" className="form-label d-block">MailId: </label>
                    <input type="text" className="form-control " id="mailId" name="mailId" value={heads.mailId} onChange={handleCh} required/>
                </div>
            </div>

            <div>
                <label htmlFor="batch" className="form-label">Batch : </label>
                <input type="number" className="form-control" id="batch" name="batch" min={(new Date()).getFullYear()} max={ (new Date()).getFullYear() + 4} value={bat} onChange={(e) => setBatch( e.target.value )} required/>
            </div>
            <div>
                <label htmlFor="password" className="form-label">Default Password : </label>
                <input type="password" className="form-control" id="password" name="password" value={pass} onChange={(e) => setPass( e.target.value )} required/>
            </div>

            <input type="submit" className="btn btn-primary" />

        </form>
    </div> );
}
 
export default StudData;

StudData.propTypes = {
    dept: PropTypes.string
}