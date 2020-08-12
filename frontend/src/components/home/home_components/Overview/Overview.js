import React, { Component } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Doughnut, Bar } from 'react-chartjs-2';
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
            categoryObj: "",
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

    // Create CHARTS

    createBarChart = () => {
        let date = new Date();
        let currentMonthYear = parseInt(`${date.getMonth() + 1}${date.getFullYear()}`);

        let expenseCatBudget = this.state.categoryObj.expense_categories_budget;
        let expenseCatSpending = this.state.categoryObj.expense_categories_monthly;

        let expenseBudgetLabels = Object.keys(expenseCatBudget);
        let expenseBudgets = Object.values(expenseCatBudget);

        let expenseSpending = [];
        for (let key in expenseCatSpending) {
            if (expenseCatSpending[key].hasOwnProperty(currentMonthYear)) {
                expenseSpending.push(expenseCatSpending[key][currentMonthYear]);
            }
            else {
                expenseSpending.push(0);
            }
        }


        let expenseBarData = {
            datasets: [{
                data: expenseBudgets,
                backgroundColor: "green",
                label: 'budget'
            }, {
                data: expenseSpending,
                backgroundColor: "red",
                label: 'spending'
            }],
            labels: expenseBudgetLabels,
            borderWidth: 1,
        }
        let barOptions = {
            legend: {
                display: false
            },
            maintainAspectRatio: false,
            aspectRatio: 2.5,
            responsive: true,
            title: {
                display: true,
                text: "Budget Vs Spending"
            }
        }

        return ([
            expenseBarData,
            barOptions
        ])
    }

    createDonutChart = () => {
        let date = new Date();
        let currentMonthYear = parseInt(`${date.getMonth() + 1}${date.getFullYear()}`);

        let incomeCategories = this.state.categoryObj.income_categories_monthly;
        let expenseCategories = this.state.categoryObj.expense_categories_monthly;

        let incomeDataset = [];
        let incomeLabels = [];
        let expenseDataset = [];
        let expenseLabel = [];

        let totalCatIncome = 0;
        for (let key in incomeCategories) {
            if (incomeCategories[key].hasOwnProperty(currentMonthYear)) {
                incomeDataset.push(incomeCategories[key][currentMonthYear]);
                incomeLabels.push(key);
                totalCatIncome += incomeCategories[key][currentMonthYear];
            }
        }
        if(totalCatIncome < this.state.monthlyGained){
            incomeDataset.push(this.state.monthlyGained - totalCatIncome);
            incomeLabels.push("Unassigned Category Transactions");
        }

        let totalCatExpense = 0;
        for (let key in expenseCategories) {
            if (expenseCategories[key].hasOwnProperty(currentMonthYear)) {
                expenseDataset.push(expenseCategories[key][currentMonthYear]);
                expenseLabel.push(key);
                totalCatExpense += expenseCategories[key][currentMonthYear];
            }
        }
        if(totalCatExpense < this.state.monthlySpent){
            incomeDataset.push(this.state.monthlySpent - totalCatExpense);
            incomeLabels.push("Unassigned Category Transactions");
        }

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
                if (chart.config.type === "bar") {
                    return;
                }
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
<<<<<<< HEAD
        // if (this.state.loading) {
        //     totalText = <h1>Loading</h1>;
        // } else {
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
        // }
=======
        let incomeData = {}, incomeOptions, expenseData = {}, expenseOptions;
        let expenseBarData = {}, expenseBudgetOptions;
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
                    <br/>
                </div>;


            [incomeData, incomeOptions, expenseData, expenseOptions] = this.createDonutChart();
            this.chartTextSet();
            [expenseBarData, expenseBudgetOptions] = this.createBarChart();
        }
>>>>>>> f720ec4c38404d19164bd13d39a5d1524b3aa3f3



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
                        <h2>Budgeting Vs Spending</h2>
                        <div>
                            <Bar
                            data={expenseBarData}
                            width={300}
                            height={200}
                            options={expenseBudgetOptions}/>
                        </div>
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