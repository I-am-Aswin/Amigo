import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./NavBar.css"

function NavBar( { rep } ) {
    return ( <nav className="navbar mt-0 pt-0">
        <div className="container-fluid nav-bar d-flex justify-content-between align-items-center px-5 pt-3">
            <span className="brand h1 mx-5"><Link className="LINK" to="/dash">Amigo</Link></span>

            <div className="d-inline-flex align-items-center">
                <div className="nav-item dropdown mx-5">
                    <Link to="#" className="LINK LINK-nav nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="true">
                        <div className="text-center">
                            <span className="d-block">{rep["Name"]}</span>
                            <span className="d-block">{rep["MailId"]}</span>
                        </div>
                    </Link>
                    <ul className="dropdown-menu">
                        <li><Link to="/change" className="dropdown-item">Update Rep Data</Link></li>
                        <li><hr className="dropdown-divider"/></li>
                        <li><Link to="/logout" className="dropdown-item" >LogOut</Link></li>
                    </ul>
                </div>

                <Link to="#submenu" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="submenu"><span className="navbar-toggler-icon"></span></Link>
            </div>
        </div>

        <div className="submenu collapse collapse-horizontal" id="submenu">
            <span className="h3 mx-auto">Menu</span>
            <ul className="submenu-list">
                <div className="top-links-submenu">
                    <li><Link className="LINK">Student details</Link></li>
                    <li><Link className="LINK">Ccourse Details</Link></li>
                    <li><Link className="LINK">TimeTable </Link></li>
                    <li><Link className="LINK">Export Data</Link></li>
                    <li><Link className="LINK">Import Data</Link></li>
                </div>

                <div className="bot-links-submenu">
                    <li><Link className="LINK">Documentation</Link></li>
                    <li><Link className="LINK">FAQ</Link></li>
                    <li><Link className="LINK">About</Link></li>
                </div>



            </ul>
        </div>

    </nav> );
}

export default NavBar;

NavBar.propTypes = {
    rep: PropTypes.object.isRequired,
}