import React, { Component } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Doughnut } from 'react-chartjs-2';
import * as d3 from "d3";

import Recent_Transactions from "../../recent_transactions/Recent_Transactions";
import { interpolateColors } from "../../../static/color_generator";


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
            transactions: [],
            loading: true,
            isLoggedIn: false
        }
        this.canvas = React.createRef();

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
                console.log(profileObj.monthly_data);
                //figure out how to get monthly to object
                let date = new Date();
                let thisMonthYear = `${date.getMonth() + 1}${date.getFullYear()}`;
                //let rep = profileObj.monthly_data.replace(/\'/g, "\"");
                //let monthData = JSON.parse(profileObj.monthly_data);

                this.setState({
                    totalObject: profileObj,
                    totalAmount: profileObj.total_amount,
                    totalSpent: profileObj.total_amount_spent,
                    totalGained: profileObj.total_amount_gained,
                    monthlySpent: profileObj.monthly_data[thisMonthYear]['monthly_spent'],
                    monthlyGained: profileObj.monthly_data[thisMonthYear]['monthly_gained'],
                    loading: false,
                });
            })
            .catch(err => {
                console.log("total get error: " + err)
                this.setState({
                    loading: false,
                });
            })
        // get transactions, pass to recent transactions js
        axios.get(`/budget/all_transactions`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${Cookies.get("token")}`
            }
        })
            .then(res => {
                this.setState({
                    transactions: res.data,
                });
            })
            .catch(err => {
                console.log("transaction get error: " + err)
            })
    };

    createChart = () => {
        let incomeDataset = this.state.transactions.filter((transaction) => transaction.t_type === "Income").map((transaction) => transaction.amount)
        let incomeLabels = this.state.transactions.filter((transaction) => transaction.t_type === "Income").map((transaction) => transaction.source)

        let expenseDataset = this.state.transactions.filter((transaction) => transaction.t_type === "Expense").map((transaction) => transaction.amount)
        let expenseLabel = this.state.transactions.filter((transaction) => transaction.t_type === "Expense").map((transaction) => transaction.source)

        /*
         * FOR INCOME
         */

        const colorScaleIncome = d3.interpolateGreens;
        let dataLengthIncome = incomeDataset.length;
        const colorRangeInfo = {
            colorStart: 0.3,
            colorEnd: 1,
            useEndAsStart: false,
        };
        let COLORSINCOME = interpolateColors(dataLengthIncome, colorScaleIncome, colorRangeInfo);

        let incomeData = {
            datasets: [{
                data: incomeDataset,
                backgroundColor: COLORSINCOME,
                label: 'Income'
            }],
            labels: incomeLabels,
            borderWidth: 1,
        }
        let incomeOptions = {
            legend: {
                display: false
            },
            maintainAspectRatio: false,
            aspectRatio: 2.5,
            cutoutPercentage: 70,
            responsive: true,
            title: "This Month Income",
            amount: `$${this.state.monthlyGained}`
        }

        /**
         * FOR EXPENSE
         */

        const colorScaleExpense = d3.interpolateReds;
        let dataLengthExpense = expenseDataset.length;
        const colorRangeInfo2 = {
            colorStart: 0.3,
            colorEnd: 1,
            useEndAsStart: false,
        };
        let COLORSEXPENSE = interpolateColors(dataLengthExpense, colorScaleExpense, colorRangeInfo2);

        let expenseData = {
            datasets: [{
                data: expenseDataset,
                backgroundColor: COLORSEXPENSE,
                label: 'Expense'
            }],
            labels: expenseLabel,
            borderWidth: 1,
        }
        let expenseOptions = {
            legend: {
                display: false
            },
            maintainAspectRatio: false,
            aspectRatio: 2.5,
            cutoutPercentage: 70,
            responsive: true,
            title: "This Month Expense",
            amount: `$${this.state.monthlySpent}`
        }


        return ([
            incomeData,
            incomeOptions,
            expenseData,
            expenseOptions
        ])
    }

    chartTextSet = () => {
        Chart.pluginService.register({
            beforeDraw: function (chart) {
                let width = chart.chart.width,
                    height = chart.chart.height,
                    ctx = chart.chart.ctx;

                ctx.restore();
                let fontSize = (height / 250).toFixed(2);
                ctx.font = fontSize + "em sans-serif";
                ctx.textBaseline = "bottom";
                ctx.fillStyle = '#000';

                let title = chart.config.options.title,
                    textX = Math.round((width - ctx.measureText(title).width) / 2),
                    textY = height / 2 - 20;
                ctx.fillText(title, textX, textY);

                let font2Size = (height / 120).toFixed(2);
                ctx.font = font2Size + "em sans-serif";
                ctx.textBaseline = "top";

                let amount = chart.config.options.amount,
                    text2X = Math.round((width - ctx.measureText(amount).width) / 2),
                    text2Y = height / 2 - 15;

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
        let totalText;
        let incomeData = {}, incomeOptions, expenseData = {}, expenseOptions;
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

            [incomeData, incomeOptions, expenseData, expenseOptions] = this.createChart();
            this.chartTextSet();
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
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <Doughnut
                                            data={incomeData}
                                            width={350}
                                            height={350}
                                            options={incomeOptions} />
                                    </td>
                                    <td>
                                        <Doughnut
                                            data={expenseData}
                                            width={350}
                                            height={350}
                                            options={expenseOptions} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="flex-fill">
                        <h2>Recent Transactions</h2>
                        <Recent_Transactions
                            transactions={this.state.transactions} />
                    </div>
                </div>
            </div>
        )
    }
}


export default Overview;
