import React, { Component } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import DoughnutChart2 from "../charts/DoughnutChart2";
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

    chartTextSet = () => {
        Chart.pluginService.register({
            beforeDraw: function (chart) {
                if (chart.config.type !== "doughnut") {
                    return;
                }
                let width = chart.chart.width,
                    height = chart.chart.height,
                    ctx = chart.chart.ctx;

                ctx.restore();
                let fontSize = (height / 200).toFixed(2);
                ctx.font = fontSize + "em Quicksand";
                ctx.textBaseline = "bottom";
                ctx.fillStyle = '#000';

                let title = chart.config.options.title,
                    textX = Math.round((width - ctx.measureText(title).width) / 2),
                    textY = height / 2 - 5;
                ctx.fillText(title, textX, textY);

                let font2Size = (height / 180).toFixed(2);
                ctx.font = font2Size + "em Lato";
                ctx.textBaseline = "top";

                let amount = chart.config.options.amount,
                    text2X = Math.round((width - ctx.measureText(amount).width) / 2),
                    text2Y = height / 2;

                ctx.fillText(amount, text2X, text2Y);

                ctx.save();
            },

            afterDraw: function (chart) {
                if (chart.data.datasets.length === 0) {
                    // No data is present
                    let ctx = chart.chart.ctx;
                    let width = chart.chart.width;
                    let height = chart.chart.height;
                    chart.clear();

                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = "16px normal 'Helvetica Nueue'";
                    ctx.fillText('No data to display', width / 2, height / 2);
                    ctx.restore();
                }
            }
        });
    }


    render() {
        this.chartTextSet();
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
                                <div>
                                    <DoughnutChart2 {...this.state} />
                                </div>
                            </div>
                        </div>
                    </div>}
            </div>

        )
    }
}


export default Analytics;