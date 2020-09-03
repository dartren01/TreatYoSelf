import React, { Component } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import Recent_Transactions from "../recent_transactions/Recent_Transactions";
import DoughnutChart from "../charts/DoughnutChart";
import BarChart2 from "../charts/BarChart2";
import LineChart from "../charts/LineChart";
import SpendingChart from "../charts/SpendingChart";
import CashFlow from "../charts/CashFlow";
import './Analytics.css';



class Analytics extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totalObject: "",
            totalAmount: "",
            monthlySpent: "",
            monthlyGained: "",
            categoryObj: "",
            monthYearDate: "",
            loading: true,
        }
        this.canvas = React.createRef();

    }

    componentDidMount = () => {
        console.log("Analytics componentDidMount");
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
                console.log(profileObj)
                this.setState({
                    totalObject: profileObj,
                    totalAmount: profileObj.total_amount,
                    monthlySpent: profileObj.monthly_data[thisMonthYear]['monthly_spent'],
                    monthlyGained: profileObj.monthly_data[thisMonthYear]['monthly_gained'],
                    monthYearDate: parseInt(thisMonthYear)
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
                console.log("category obj: ", res.data[0]);
            })
            .catch(err => {
                console.log("category get error: " + err)
            })


        // get transactions, pass to recent transactions js
    }

    render() {
        return (
            <div className="analytics">
                <h1>
                    Analytics
                </h1>
                {this.state.loading === true ?
                    <h1>
                        Loading Analytics . . .
                    </h1> :
                    <div className="row">
                        <div>
                            <h4>Budget vs. Spending <span className="spendingCategory">(Per Spending Category)</span></h4>
                            <LineChart {...this.state} />
                            <div className="charts">
                                <div>
                                    <BarChart2 {...this.state} />
                                </div>
                                <div>
                                    <SpendingChart {...this.state}
                                        monthName={this.props.monthName}
                                    />
                                </div>
                                <div>
                                    <CashFlow
                                        monthName={this.props.monthName}
                                        monthlyGained={this.state.monthlyGained}
                                        monthlySpent={this.state.monthlySpent}
                                    ></CashFlow>
                                </div>
                            </div>
                        </div>
                    </div>}
            </div>

        )
    }
}


export default Analytics;