import React, { Component } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import Recent_Transactions from "../../../recent_transactions/Recent_Transactions";


class Overview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totalObject: "",
            totalAmount: "",
            totalSpent: "",
            totalGained: "",
            monthlySpent: "",
            monthlyGained: "",
            loading: true,
            isLoggedIn: false
        }

    }

    componentDidMount = () => {
        console.log("Home componentDidMount");
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
                let rep = profileObj.monthly_data.replace(/\'/g, "\"");
                let monthData = JSON.parse(rep);

                this.setState({
                    totalObject: profileObj,
                    totalAmount: profileObj.total_amount,
                    totalSpent: profileObj.total_amount_spent,
                    totalGained: profileObj.total_amount_gained,
                    monthlySpent: monthData[thisMonthYear]['monthly_spent'],
                    monthlyGained: monthData[thisMonthYear]['monthly_gained'],
                    loading: false,
                });
                console.log(res.data)
            })
            .catch(err => {
                console.log("total get error: " + err)
                this.setState({
                    loading: false,
                });
            })
    };

    render() {

        let totalText;
        if (this.state.loading) {
            totalText = <h1>Loading</h1>;
        } else {
            totalText =
                <div>
                    <h1>
                        Current Balance
                            </h1>
                    <br />
                    <h2>
                        ${this.state.totalAmount}
                    </h2>
                    <br />
                    <p>
                        Total spent: ${this.state.totalSpent}
                    </p>
                    <p>
                        Total gained: ${this.state.totalGained}
                    </p>
                    <p>
                        Monthly spent: ${this.state.monthlySpent}
                    </p>
                    <p>
                        Monthy gained: ${this.state.monthlyGained}
                    </p>
                </div>;
        }

        return (
            <div>
                <div className="row">
                    <h1>
                        {console.log("Home Render")}
                        {console.log(this.props.username)}
                        Monthly Overview
                    </h1>
                </div>
                <div className="row">
                    {totalText}
                </div>
                <div className="row">
                    <div>
                        <h2>Spending vs. Budgeting Goal</h2>
                        Add graph component here (bar graph with budget, donut graph)
                    </div>
                </div>
                <div className="row">
                    <div className="flex-fill">
                        <h2>Recent Transactions</h2>
                        <Recent_Transactions />
                    </div>
                </div>
            </div>
        )
    }
}


export default Overview;