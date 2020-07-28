import React, { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

class Landing extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }

    }


    render() {

        return (
            <div>
                <div className="row">
                    <h1>
                        Welcome To Treat Yo Self
                    </h1>
                </div>
                <div className="row">
                    Professional Budgeting made Simple
                </div>
                <div className="row">
                    <div>
                        <Link to='/register'>
                            <button type="button" className="btn btn-info">Get Started Free</button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}


export default Landing;