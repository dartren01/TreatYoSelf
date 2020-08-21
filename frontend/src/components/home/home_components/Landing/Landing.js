import React, { Component } from "react";
import { Link } from "react-router-dom";
import Main from "./Main/Main";
import Features from "./Features/Features";
import HowItWorks from "./HowItWorks/HowItWorks";
import Team from "./Team/Team";
import Navbar2 from "../../../navbar2/Navbar2";
import Future from "../Landing/Future/Future";
import Copyright from "../Landing/Copyright/Copyright";
import "./Landing.css";
class Landing extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }

    }


    render() {

        return (
            <div className="Landing">
                <Navbar2 />
                <Main />
                <Features />
                <HowItWorks />
                <Team />
                <Future />
                <Copyright />

            </div>
        )
    }
}


export default Landing;