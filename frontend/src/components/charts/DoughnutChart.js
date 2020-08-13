import React, { Component, Fragment } from "react";
import * as d3 from "d3";
import {Doughnut} from "react-chartjs-2";

import { interpolateColors } from "../../static/color_generator";

/**
 * Doughnut chart for monthly income spend and gain
 */

class DoughnutChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
    };

    createDonutChart = () => {
        let incomeCategories = this.props.categoryObj.income_categories_monthly;
        let expenseCategories = this.props.categoryObj.expense_categories_monthly;

        let incomeDataset = [];
        let incomeLabels = [];
        let expenseDataset = [];
        let expenseLabel = [];

        let totalCatIncome = 0;
        for (let key in incomeCategories) {
            if (incomeCategories[key].hasOwnProperty(this.props.monthYearDate)) {
                incomeDataset.push(incomeCategories[key][this.props.monthYearDate]);
                incomeLabels.push(key);
                totalCatIncome += incomeCategories[key][this.props.monthYearDate];
            }
        }
        if (totalCatIncome < this.props.monthlyGained) {
            incomeDataset.push(this.props.monthlyGained - totalCatIncome);
            incomeLabels.push("Unassigned Category Transactions");
        }

        let totalCatExpense = 0;
        for (let key in expenseCategories) {
            if (expenseCategories[key].hasOwnProperty(this.props.monthYearDate)) {
                expenseDataset.push(expenseCategories[key][this.props.monthYearDate]);
                expenseLabel.push(key);
                totalCatExpense += expenseCategories[key][this.props.monthYearDate];
            }
        }
        if (totalCatExpense < this.props.monthlySpent) {
            incomeDataset.push(this.props.monthlySpent - totalCatExpense);
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
            amount: `$${this.props.monthlyGained}`
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
            amount: `$${this.props.monthlySpent}`
        }


        return ([
            incomeData,
            incomeOptions,
            expenseData,
            expenseOptions
        ])
    }

    render() {
        if(this.props.loading){
            return(<div></div>)
        }

        let incomeData = {}, incomeOptions, expenseData = {}, expenseOptions;
        [incomeData, incomeOptions, expenseData, expenseOptions] = this.createDonutChart();

        return (
            <Fragment>
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
            </Fragment>)
    }
}


export default DoughnutChart;