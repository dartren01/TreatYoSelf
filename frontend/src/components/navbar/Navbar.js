import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import { useLocation } from 'react-router-dom'

import "./Navbar.css"

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogout = () => {
        Cookies.remove("token");
        this.props.deleteLogin();
        this.props.history.push("/")
        window.location.reload();
    };

    render() {
        console.log(this.props.history.location.pathname);
        let leftNavBar;
        if (this.props.history.location.pathname !== "/total") {
            leftNavBar = <React.Fragment>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/total" className="nav-link"> Total </Link>
                <Link to="/budget/all_transactions/" className="nav-link">All Transactions</Link>
                <Link to="/budget/create/" className="nav-link">New Transaction</Link>
                <Link to="/category" className="nav-link">Category</Link>
            </React.Fragment>;
        }
        return (
            <div className="navbar1">
                <nav className="navbar navbar-dark bg-dark navbar-expand-sm" >
                    {console.log("Navbar Render")}
                    {leftNavBar}
                    {/* <div className="w-100"> */}
                    <ul className="navbar-nav ml-auto">
                        {this.props.isLoggedIn ?
                            <React.Fragment>
                                <li className="nav-item">
                                    <button className="logoutButton"
                                        onClick={() => this.handleLogout()}>
                                        Logout
                                    </button>
                                </li>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link" >
                                        Register
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">
                                        Login
                                    </Link>
                                </li>
                            </React.Fragment>
                        }
                    </ul>
                    {/* </div> */}
                </nav>
            </div>
        )
    }

}

export default withRouter(Navbar);