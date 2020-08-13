import React, { Component, Fragment } from "react";
import {Line} from "react-chartjs-2";

/**
 * Total spent over one year? chart
 */

class LineChart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
    };

    createLineChart = () => {
        let monthlyData = this.props.totalObject.monthly_data;
        let monthLabels = [], monthlySpent = [], monthlyGained = [];
        for (let key in monthlyData){
            let splitIndex = key.length - 4;
            monthLabels.push(key.substring(0, splitIndex) + "/" + key.substring(splitIndex));
            monthlyGained.push(monthlyData[key]['monthly_gained']);
            monthlySpent.push(monthlyData[key]['monthly_spent']);
        }

        
        let totalLineData = {
            datasets: [{
                data: monthlySpent,
                borderColor: "rgba(232, 187, 39, 1)",
                fill: false,
                label: 'Amount Spent',
                pointRadius: 5,
                pointHitRadius: 5
            }, {
                data: monthlyGained,
                borderColor: "green",
                fill: false,
                label: 'Amount Gained',
                pointRadius: 5,
                pointHitRadius: 5
            }],
            labels: monthLabels,
            borderWidth: 1,
        }
        let lineOptions = {
            legend: {
                display: true
            },
            maintainAspectRatio: true,
            aspectRatio: 2.5,
            responsive: true,
            title: {
                display: true,
                fontSize: 32,
                text: "Monthly Spending And Gain"
            },
        }

        return ([
            totalLineData,
            lineOptions
        ])
    }


    render() {
        if(this.props.loading){
            return(<div></div>)
        }
        let totalLineData = {}, totalLineOptions;
        [totalLineData, totalLineOptions] = this.createLineChart();

        return (
            <Fragment>
                <Line
                    data={totalLineData}
                    width={100}
                    height={100}
                    options={totalLineOptions} />
            </Fragment>)
    }
}


export default LineChart;
