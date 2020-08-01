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
        if (!this.props.isLoggedIn) {
            leftNavBar = <Link to="/" className="navbar-brand">Home</Link>;
            // can add stuff here for not logged in like about and faq
        }
        else if (this.props.history.location.pathname !== "/total") {
            leftNavBar = <React.Fragment>
                <Link to="/" className="navbar-brand">Home</Link>
                <Link to="/total" className="navbar-brand"> Total </Link>
                <Link to="/budget/all_transactions/" className="navbar-brand">All Transactions</Link>
                <Link to="/budget/create/" className="navbar-brand">New Transaction</Link>
                <Link to="/category" className="navbar-brand">Category</Link>
            </React.Fragment>;
        }
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-sm" >
                {console.log("Navbar Render")}
                {leftNavBar}
                <div className="w-100">
                    <ul className="navbar-nav ml-auto">
                        {this.props.isLoggedIn ?
                            <React.Fragment>
                                <li className="navbar-item">
                                    <button className="logoutButton"
                                        onClick={() => this.handleLogout()}>
                                        Logout
                                    </button>
                                </li>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <li className="navbar-item">
                                    <Link to="/register" className="nav-link" >
                                        Register
                                    </Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/login" className="nav-link">
                                        Login
                                    </Link>
                                </li>
                            </React.Fragment>
                        }
                    </ul>
                </div>
            </nav>
        )
    }

}

export default withRouter(Navbar);