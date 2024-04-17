import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    navigate("/login")
    return ( <></> );
}

export default Home;