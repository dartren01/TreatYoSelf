import React, { Component, Fragment, useState, useEffect } from "react";
import "./SpendingChart.css"

const Progress = (props) => {
    const [style, setStyle] = useState();
    useEffect(() => {
        let isMounted = true;
        setTimeout(() => {
            const newStyle = {
                opacity: 1,
                width: `${props.remainingWidth}%`
            }
            if (isMounted) setStyle(newStyle)
        }, 100);
        return () => {
            isMounted = false;
        }
    })

    return (
        <div className="progress">
            <div className="progress-done" style={style}>
                {/* ${props.remaining} left */}
            </div>
        </div>
    )
};
class SpendingChart extends Component {
    constructor(props) {
        super(props);
    }
    getTotalBudget = () => {
        let categories = this.props.categoryObj;
        let totalBudget = 0;
        for (let category in categories.expense_categories_budget) {
            totalBudget += parseFloat(categories.expense_categories_budget[category])
        }
        console.log(totalBudget)
        return (totalBudget)
    }


    render() {
        if (this.props.loading) {
            return (<div></div>)
        }
        let totalBudget = this.getTotalBudget();
        let remaining = totalBudget - this.props.monthlySpent;

        let date = new Date();
        let month = date.getMonth();
        let year = date.getFullYear();

        let daysInMonth = new Date(year, month + 1, 0).getDate();
        let remainingDays = daysInMonth - date.getDate();

        let remainingWidth = (1 - (remaining / totalBudget)) * 100
        return (
            <div className="spendingChart">
                <h2>
                    {this.props.monthName} Budget
                </h2>
                <p>
                    You have ${remaining} left for the next {remainingDays} day(s).
                </p>
                <Progress
                    remainingWidth={remainingWidth}
                    remaining={remaining}>
                </Progress>
                <h4>
                    Today
                </h4>
            </div>
        )
    }
}


export default SpendingChart;
