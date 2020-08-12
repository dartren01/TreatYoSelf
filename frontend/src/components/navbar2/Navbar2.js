import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import logo from "../navbar2/images/logo.svg";
import "./Navbar2.css";
import { Link as ScrLink } from "react-scroll";

class Navbar2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        console.log(this.props.history.location.pathname);
        let leftNavbar;
        leftNavbar = <React.Fragment>
            <ScrLink
                className="navbar-left"
                activeClass="active"
                to="main"
                spy={true}
                smooth={true}
                offset={-100}
                duration={1000}
            ><img src={logo} /></ScrLink>
            <ScrLink
                className="navbar-brand"
                activeClass="active"
                to="main"
                spy={true}
                smooth={true}
                offset={-100}
                duration={1000}
            >Treat Yo' Self</ScrLink>
        </React.Fragment>;

        let midNavbar;
        midNavbar = <React.Fragment>

            <ScrLink
                className="nav-link"
                activeClass="active"
                to="features"
                spy={true}
                smooth={true}
                offset={-40}
                duration={1000}
            >Features</ScrLink>
            <ScrLink
                className="nav-link"
                activeClass="active"
                to="how"
                spy={true}
                smooth={true}
                offset={-90}
                duration={1000}
            >How It Works</ScrLink>
            <ScrLink
                className="nav-link"
                activeClass="active"
                to="team"
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
            >Team</ScrLink>
            <ScrLink
                className="nav-link"
                activeClass="active"
                to="features"
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
            >Future</ScrLink>


        </React.Fragment >;
        return (
            <nav className="navbar navbar-expand-lg navbar-light" >
                <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@700&display=swap" rel="stylesheet"></link>
                {leftNavbar}
                <button className="navbar-toggler" data-toggle="collapse" data-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <div className="navContainer">
                        {midNavbar}
                        <Link to="/login">
                            <button className="login">
                                Log in
                            </button>
                        </Link>
                        <Link to="/register" >
                            <button className="signup">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            </nav >
        )
    }
}

export default withRouter(Navbar2);