import React, { Component, Fragment } from "react";
import {Bar} from "react-chartjs-2";

/**
 * Budget VS Spending Chart
 */

class BarChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
    };

    createBarChart = () => {
        let expenseCatBudget = this.props.categoryObj.expense_categories_budget;
        let expenseCatSpending = this.props.categoryObj.expense_categories_monthly;

        let expenseBudgetLabels = Object.keys(expenseCatBudget);
        let expenseBudgets = Object.values(expenseCatBudget);

        let expenseSpending = [];
        for (let key in expenseCatSpending) {
            if (expenseCatSpending[key].hasOwnProperty(this.props.monthYearDate)) {
                expenseSpending.push(expenseCatSpending[key][this.props.monthYearDate]);
            }
            else {
                expenseSpending.push(0);
            }
        }


        let expenseBarData = {
            datasets: [{
                data: expenseBudgets,
                backgroundColor: "green",
                label: 'Budget'
            }, {
                data: expenseSpending,
                backgroundColor: "rgba(232, 187, 39, 1)",
                label: 'Spending'
            }],
            labels: expenseBudgetLabels,
            borderWidth: 1,
        }
        let barOptions = {
            legend: {
                display: true
            },
            maintainAspectRatio: false,
            aspectRatio: 2.5,
            responsive: true,
            title: {
                display: false,
            }
        }

        return ([
            expenseBarData,
            barOptions
        ])
    }


    render() {
        if(this.props.loading){
            return(<div></div>)
        }
        let expenseBarData = {}, expenseBudgetOptions;
        [expenseBarData, expenseBudgetOptions] = this.createBarChart();
        return (
            <Fragment>
                <Bar
                    data={expenseBarData}
                    width={300}
                    height={200}
                    options={expenseBudgetOptions} />
            </Fragment>)
    }
}


export default BarChart;
