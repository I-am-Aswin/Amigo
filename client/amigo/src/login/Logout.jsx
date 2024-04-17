import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";

function Logout({ setLoggedIn }) {
    const navigate = useNavigate();
    setLoggedIn();

    navigate("/login");

    return (<></>);
}

export default Logout;

Logout.propTypes = {
    setLoggedIn: PropTypes.func.isRequired,
}