
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Main.css";
import bannerIMG from "../images/banner.png";
import laptopIMG from "../images/laptop.png";
import piggyIMG from "../images/piggy.svg";

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <div className="mainSection" id="main">
                <img src={bannerIMG} id="bannerBG"></img>
                <img src={piggyIMG} id="piggyBG"></img>
                <img src={laptopIMG} id="laptopBG"></img>
                <div className="main-wrapper">
                    <div class="row" id="mainRow1">
                        <div class="col-md-6">
                            <p class="promo-title">Professional budgeting, made <span id="simple"> simple.</span></p>
                            <p class="promo-slogan">A simple, but powerful budgeting tool for the casual spender.</p>
                            <Link to="/register" className="nav-link" id="get_started_link">
                                <button className="get_started">
                                    Get Started Free
                                    </button>
                            </Link>
                        </div>
                    </div>
                    <div class="row" id="mainRow2">
                        <div class="col-md-6"></div>
                        <div class="col-md-6">
                            <p class="promo2-title"><span id="you">You </span>are in control of your finances.</p>
                            <p class="promo2-slogan">Time to say goodbye to cluttered receipts and hello to secure virtual transactions.
                             Our beautiful UI will allow you to keep track of your transactions and finally acheive your financial goals.</p>
                        </div>

                    </div>

                </div>
            </div>

        )
    }
}

export default Main;