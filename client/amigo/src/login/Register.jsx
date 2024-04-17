import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { PropTypes } from "prop-types";
import config from "../config";

function Register({ method, rep, loggedIn }) {
    const [details, setDetails] = useState({});
    const [password, setPassword] = useState({});
    const [depts, setDepts] = useState([]);
    const [validity, setValidity] = useState({});

    const navigate = useNavigate();

    let pass_tip =
        "Should Contain \n=> Atleast 1 UpperCase\n=> Atleast 1 LowerCase\n=> Atleast 1 Number\n=> Atleast 1 from @ | $ _ #";

    useEffect(() => {

        if (method == 1 && !loggedIn) {
            navigate("/login");
        }

        async function readData() {
            const resp = await axios.get(`${config.API_URL}/dept/depts`);
            const dummy = [];
            for (let x of resp["data"]) {
                dummy.push({ deptId: x["DeptId"], dept: x["Abb"] });
            }
            setDepts(dummy);
        }
        readData();

        setDetails({
            name: "",
            rollNo: "",
            mailId: "",
            year: "2Y",
            dept: "",
            representative: "",
        });

        setPassword({
            pass: "",
            cpass: "",
        });

        if (method == 1) {
            setDetails(prev => ({
                ...prev,
                dept: rep.Department,
                representative: rep.Id[5],
                name: rep.Name,
                rollNo: rep.RollNo,
                mailId: rep.MailId
            }))
        }

        setValidity({ roll: "", mail: "", pass: "", cpass: "" });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleSelectChange(e) {
        const { name, value } = e.target;

        setDetails((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleChange(e) {
        const { name, value } = e.target;

        setPassword((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function validate() {
        if (!details.rollNo.match(/^7177221([1-9]{1})([Ll1-3]{1})([\d]{2})$/)) {
            setValidity((prev) => ({
                ...prev, roll: "is-invalid"
            })); return false;
        } else {
            setValidity((prev) => ({
                ...prev, roll: ""
            }))
        }

        let tempMail = `${details.name.toLowerCase().slice(0, 4)}.${details.rollNo}@gct.ac.in`;
        if (!(details.mailId === tempMail)) {
            setValidity((prev) => ({
                ...prev, mail: "is-invalid"
            })); return false;
        } else {
            setValidity((prev) => ({
                ...prev, mail: ""
            }))
        }

        if (!password.pass.match(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        )
        ) {
            setValidity((prev) => ({
                ...prev, pass: "is-invalid"
            })); return false;
        } else {
            setValidity((prev) => ({
                ...prev, pass: ""
            }))
        }

        if (!(password.pass == password.cpass)) {
            setValidity((prev) => ({
                ...prev, cpass: "is-invalid"
            })); return false;
        } else {
            setValidity((prev) => ({
                ...prev, cpass: ""
            }))
        }

        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        try {
            let body = {
                id: (details.year + details.dept + details.representative),
                data: JSON.stringify({
                    ...details,
                    password: password.pass
                })
            };

            if (method == 0) {
                let rep = await getRep();
                if (rep["Password"] != null) {
                    window.alert("Representative Regiestered Already");
                } else {
                    await axios.post(`${config.API_URL}/rep/data/update`, body);
                    window.alert("Representative Registered Successfully");
                }
            } else {
                await axios.post(`${config.API_URL}/rep/data/update`, body);
                if (method == 0)
                    window.alert("Representative Registered Successfully");
                else
                    window.alert("Representative Data Updated Successfully");
            }

        } catch (err) {
            console.log(err);
        } finally {
            if (method == 0)
                navigate("/login");
            else
                navigate("/dash");
        }

    }

    async function getRep() {
        let repId = (details.year + details.dept + details.representative);
        let resp = await axios.get(`${config.API_URL}/rep/data/${repId}`);

        return resp["data"][0];
    }

    return (
        <div className="reg-div border mx-auto px-5 pb-4 mt-5 pt-4">
            <h2 className="mb-5 text-center">Amigo</h2>

            <form onSubmit={handleSubmit} className="reg-form mx-auto mt-3 mb-3">
                {method == 0 && <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                    <label htmlFor="year" className="form-label">
                        Year :{" "}
                    </label>
                    <select
                        name="year"
                        id="year"
                        className="form-select d-inline reg-inp"
                        defaultValue={details.year}
                        onChange={handleSelectChange}
                        required
                    >
                        <option value={details.year}>II - Year </option>
                    </select>
                </div>}

                {method == 0 && <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                    <label htmlFor="dept" className="form-label">
                        Department :{" "}
                    </label>
                    <select
                        name="dept"
                        id="dept"
                        className="form-select d-inline reg-inp"
                        defaultValue={details.dept}
                        onChange={handleSelectChange}
                        required
                    >
                        <option></option>
                        {depts.map(function (obj) {
                            return (
                                <option key={obj.deptId} value={obj.deptId}>
                                    {obj.dept}
                                </option>
                            );
                        })}
                    </select>
                </div>}

                {method == 0 && <div className=" d-flex justify-content-between align-items-center w-100 mb-4">
                    <label htmlFor="representative" className="form-label">
                        Representative :{" "}
                    </label>
                    <select
                        name="representative"
                        id="representative"
                        className="form-select d-inline reg-inp"
                        defaultValue={details.representative}
                        onChange={handleSelectChange}
                        required
                    >
                        <option></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </div>}

                <div className=" d-flex justify-content-between align-items-center w-100 mb-3">
                    <label htmlFor="rollNo" className="form-label">
                        Register Number :{" "}
                    </label>
                    <input
                        type="text"
                        id="rollNo"
                        className={"form-control d-inline reg-inp " + validity.roll}
                        placeholder="Register Number"
                        name="rollNo"
                        value={details.rollNo}
                        onChange={handleSelectChange}
                        required
                    />
                    <div className="invalid-feedback">Invalid Register Number</div>
                </div>

                <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                    <label htmlFor="name" className="form-label">
                        Name :{" "}
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="form-control d-inline reg-inp"
                        value={details.name}
                        name="name"
                        placeholder="Name"
                        onChange={handleSelectChange}
                        required
                    />
                </div>


                <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                    <label htmlFor="mailid" className="form-label">
                        Email ID:{" "}
                    </label>
                    <input
                        type="email"
                        className={"form-control d-inline reg-inp " + validity.mail}
                        value={details.mailId}
                        name="mailId"
                        placeholder="MailID"
                        onChange={handleSelectChange}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="GCT Mail ID"
                        required
                    />
                </div>
                <div className="invalid-feedback visibile">Invalid GCT Mail Address </div>

                <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                    <label htmlFor="pass" className="form-label">
                        Password :{" "}
                    </label>
                    <input
                        type="password"
                        className={"form-control d-inline reg-inp " + validity.pass}
                        id="pass"
                        value={password.pass}
                        name="pass"
                        placeholder="Password"
                        onChange={handleChange}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title={pass_tip}
                        required
                    />
                    <div className="invalid-feedback">Invalid Password </div>
                </div>

                <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                    <label htmlFor="pass" className="form-label">
                        Confirm Password :{" "}
                    </label>
                    <input
                        type="text"
                        className={"form-control d-inline reg-inp " + validity.cpass}
                        id="pass"
                        value={password.cpass}
                        name="cpass"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title={pass_tip}
                        required
                    />
                    <div className="invalid-feedback">Passwords Do Not Match</div>
                </div>

                <div className="mx-auto mt-4">
                    <input
                        type="submit"
                        value={(method == 0) ? "Register" : "Update"}
                        className="btn btn-lavendar w-100"
                    />
                </div>
            </form>
            {method == 0 && (<hr></hr>)}

            {method == 0 && (<div className="d-flex justify-content-center mt-3">
                <Link to="/login" className="Link">Already Registered ? Login</Link>
            </div>)}
        </div>
    );
}

export default Register;


Register.propTypes = {
    method: PropTypes.number.isRequired,
    rep: PropTypes.object,
    loggedIn: PropTypes.bool
}