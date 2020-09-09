import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./RightComponent.css";
import SpendingChart from "../charts/SpendingChart";
import openTab from "./images/openTab.svg";
import closeTab from "./images/closeTab.svg"

class RightComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalObject: "",
            totalAmount: "",
            monthlySpent: "",
            monthlyGained: "",
            monthYearDate: "",
            categoryObj: "",
            loading: true,
            isButtonOpen: false,
            buttonExists: false,
        };
    }
    componentDidMount = () => {
        this.getDimensions();
        window.addEventListener("resize", this.getDimensions);
        console.log("RightComponent componentDidMount");
        axios.get(`/api/total/get`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${Cookies.get("token")}`
            }
        })
            .then(res => {
                let profileObj = res.data[0];
                //figure out how to get monthly to object
                let date = new Date();
                let thisMonthYear = `${date.getMonth() + 1}${date.getFullYear()}`;
                //let rep = profileObj.monthly_data.replace(/\'/g, "\"");
                //let monthData = JSON.parse(profileObj.monthly_data);
                this.setState({
                    totalObject: profileObj,
                    totalAmount: profileObj.total_amount,
                    monthlySpent: profileObj.monthly_data[thisMonthYear]['monthly_spent'],
                    monthlyGained: profileObj.monthly_data[thisMonthYear]['monthly_gained'],
                    monthYearDate: parseInt(thisMonthYear),
                });
            })
            .catch(err => {
                console.log("total get error: " + err)
                this.setState({
                    loading: false,
                });
            })
        // get categories
        axios.get("budget/category/get/", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${Cookies.get("token")}`
            }
        })
            .then(res => {
                this.setState({
                    categoryObj: res.data[0],
                    loading: false,
                });
            })
            .catch(err => {
                console.log("category get error: " + err)
            })
    }

    componentWillUnmount = () => {
        window.removeEventListener("resize", this.getDimensions);
    };

    getDimensions = () => {
        if (window.innerWidth >= 568 && window.innerWidth <= 1200 && window.innerHeight <= 1366 && window.innerHeight > 300) {
            this.setState({ buttonExists: true })
            // } else if (window.innerWidth >= 1200) {
            //     this.setState({ donutWidth:  })
            //     this.setState({ isDesktopversion: true })
        } else {
            this.setState({ buttonExists: false })
        }
    }


    render() {
        let toggleRight;
        let arrowRight;
        if (this.state.buttonExists && this.state.isButtonOpen) {
            toggleRight = "rightbar opened-shadow";
            arrowRight = true;
        } else if (this.state.buttonExists && !this.state.isButtonOpen) {
            toggleRight = "rightbar closed";
            arrowRight = false;
        } else if (!this.state.buttonExists) {
            toggleRight = "rightbar opened";

        }
        let isTotal;
        if (this.props.history.location.pathname === "/total") {
            return (<React.Fragment>
            </React.Fragment>)
        }
        return (
            <React.Fragment>
                {isTotal}
                <div className={toggleRight} id="rightbar">

                    {this.state.buttonExists ? <button onClick={() => this.setState({
                        isButtonOpen: !this.state.isButtonOpen
                    })}
                        className="toggleButton"> <img src={arrowRight ? closeTab : openTab} className="openTab"></img> </button> : <div></div>}
                    <div className="spending">
                        <SpendingChart {...this.state}
                            monthName={this.props.monthName}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }

}

export default withRouter(RightComponent);