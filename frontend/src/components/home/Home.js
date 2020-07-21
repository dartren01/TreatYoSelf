import React, { Component } from "react";
import Cookies from "js-cookie"
import axios from "axios"


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totalObject: "",
            totalAmount: "",
            totalSpent: "",
            totalGained: "",
            loading: true
        }

    }

    componentDidMount = () => {
        console.log("Home componentDidMount");
        this.props.checkLogin()
        axios.get(`/api/total/get`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${Cookies.get("token")}`
            }
        })
            .then(res => {
                this.setState({
                    totalObject: res.data[0],
                    totalAmount: res.data[0].total_amount,
                    totalSpent: res.data[0].total_amount_spent,
                    totalGained: res.data[0].total_amount_gained,
                    loading: false
                });
                console.log(res.data)
            })
            .catch(err => {
                console.log("total get error: " + err)
            })
    };

    render() {
        return (
            <div>
                <h1>
                    {console.log("Home Render")}
                    {console.log(this.props.username)}
                </h1>
                Home Page
                {this.state.loading === true ?
                    <h1>
                        Loading
                    </h1> :
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
                        <br />
                        <p>
                            Total gained: ${this.state.totalGained}
                        </p>
                    </div>}
            </div>

        )
    }
}


export default Home;