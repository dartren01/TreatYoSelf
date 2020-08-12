import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "./Card";
import payment_img from "../images/payments.svg";
import visibility_img from "../images/visibility.svg";
import category_img from "../images/categories.svg";
import history_img from "../images/history.svg";
import simplicity_img from "../images/simplicity.svg";
import rewards_img from "../images/rewards.svg";
import ovalIMG from "../images/oval.svg";
import smallOvalIMG from "../images/small oval.svg";
import "./Features.css";

class Features extends Component {
    render() {
        return (


            <div className="featuresSection" id="features">
                <img src={ovalIMG} id="ovalBG"></img>
                <img src={smallOvalIMG} id="smallOvalBG"></img>
                <div id="features-wrapper">
                    <p class="features-title"><span id="app">App </span>Features</p>
                    <p class="features-slogan">Everything you wished were in your banking app</p>
                    <p class="features-slogan-more">...and more</p>
                    <div className="row" id="row1">
                        <div className="col-md-4">
                            <Card
                                imgsrc={category_img}
                                title="Categories"
                                text="Create your own personalized spending and income stream categories." />
                        </div>
                        <div className="col-md-4">
                            <Card
                                imgsrc={visibility_img}
                                title="Visibility"
                                text="Track your spending and income with beautiful and simple graphs and charts." />
                        </div>
                        <div className="col-md-4">
                            <Card
                                imgsrc={payment_img}
                                title="Payments"
                                text="Never miss another payment. Schedule upcoming payments and we'll notify you before they're due." />
                        </div>
                    </div>
                    <div className="row" id="row2">
                        <div className="col-md-4">
                            <Card
                                imgsrc={history_img}
                                title="History"
                                text="Never assume again. All past activity is secure and saved in your account." />
                        </div>
                        <div className="col-md-4">
                            <Card
                                imgsrc={simplicity_img}
                                title="Simplicity"
                                text="Our seemless UI is simple to use and easy to navigate." />
                        </div>
                        <div className="col-md-4">
                            <Card
                                imgsrc={rewards_img}
                                title="Rewards"
                                text="We show you much you improved in spending/earning every month! 
                                    If you beat your goals, it’s time to Treat Yo’ Self!" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Features;
