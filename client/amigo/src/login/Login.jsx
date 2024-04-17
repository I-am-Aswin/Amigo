import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import config from "../config.js";


function Login( { onSuccess }) {

    const [ depts, setDepts ] = useState([]);
    const [ password, setPassword ] = useState("");
    const [ details, setDetails ] = useState( {} );
    const [ pValidity, setPValidity ] = useState({ class: "", message:"" })
    const navigate = useNavigate();

    let pass_tip = "Should Contain \n=> Atleast 1 UpperCase\n=> Atleast 1 LowerCase\n=> Atleast 1 Number\n=> Atleast 1 from @ | $ _ #";

    useEffect( function( ) {
        async function readData() {
            const resp = await axios.get(`${config.API_URL}/dept/depts`);
            const dummy = []
            for( let x of resp["data"] )
            {
                dummy.push( { deptId: x["DeptId"], dept: x["DeptName"]});
            }
            setDepts(dummy);
        }
        readData();

        setDetails( {
            year: "2Y",
            dept: "",
            representative: "",
        });
    }, [])

    function handleSelectChange( e ) {
        const { name, value } = e.target;

        setDetails( previous => ({
            ...previous,
            [name]: value
        }));
    }

    async function getRep() {
        let repId = (details.year + details.dept + details.representative);
        let resp = await axios.get(`${config.API_URL}/rep/data/${repId}`);
        console.log("SUccess");
        return resp["data"][0];
    }
    
    async function handleSubmit( e ) {
        e.preventDefault();

        if( password.match( /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/ ) ) {
            setPValidity({ class: "", message:""});
            
            let rep = await getRep();

            if( rep["Password"] == null ) {
                setPValidity( { class: "is-invalid", message: "Representative is not registered"});
                return;
            }

            let valid = await axios.post( `${config.HASH_URL}/`, {password: password, storedHash: rep["Password"]});
            if ( !valid["data"] ) {
                setPValidity({ class: "is-invalid", message:"Incorrect Password"});
                return;
            }
            onSuccess( rep );
            navigate("/dash");
        } else {
            setPValidity({ class: "is-invalid", message: "Invalid password" });
        }

    }

    return (
        <div className="content border p-5 w-50 mx-auto mt-5" >
            <h2 className="mb-4 text-center">Amigo</h2>
            
            <form onSubmit={handleSubmit} className="w-75 mx-auto mb-4" >
                <div className="mb-3">
                    <label htmlFor="year" className="form-label">Year : </label>
                    <select name="year" id="year" className="form-select" defaultValue={details.year} onChange={handleSelectChange} required>
                        <option value={details.year}>II - Year </option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="dept" className="form-label">Department : </label>
                    <select name="dept" id="dept" className="form-select" defaultValue={details.dept} onChange={handleSelectChange} required>
                        <option></option>
                        { depts.map( function( obj ) {
                            return <option key={obj.deptId} value={obj.deptId}>{obj.dept}</option>
                        })}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="representative" className="form-label">Representative : </label>
                    <select name="representative" id="representative" className="form-select" defaultValue={details.representative} onChange={handleSelectChange} required>
                        <option></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </div>
                
                <div className="mb-3">
                    <label htmlFor="pass" className="form-label">Password : </label>
                    <div className="form-floating">
                        <input type="password" className={"form-control " +  pValidity.class}  placeholder="Password" value={password} data-toggle="tooltip" data-placement="bottom" title={pass_tip} onChange={(e) => setPassword( e.target.value )} required/>
                        <label htmlFor="pass" className="form-label">Password </label>
                        <div className="invalid-feedback">{pValidity.message}</div>
                    </div>
                </div>
                
                <div className="mx-auto mt-4">
                    <input type="submit" value="Log In" className="btn btn-lavendar w-100 mx-auto"/>
                </div>
            </form><hr/>

            <div className="d-flex w-100 justify-content-center">
                <Link className="LINK link-primary mx-auto" to="/register">Register Representative !</Link>

            </div>
            
            
        </div>
    )

}

export default Login;

Login.propTypes = {
    onSuccess: PropTypes.func.isRequired,
}