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
                {/* <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta> */}
                <link href="https://fonts.googleapis.com/css2?family=Questrial&display=swap" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@700&display=swap" rel="stylesheet"></link>
                <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
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