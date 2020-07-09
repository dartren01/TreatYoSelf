import React, {Component} from "react"
import axios from "axios"
import Cookies from "js-cookie"

class Total extends Component{
    constructor(props){
        super(props);
        this.state = {
            total_amount:0
        }

        this.totalChange = this.totalChange.bind(this)
        console.log(`Token ${Cookies.get("token")}`);
    }


    totalChange = (e) => {
        this.setState({
            total_amount:e.target.value
        })
        console.log(this.state.total_amount)
    }

    handleTotal = (e) => {
        e.preventDefault()
        console.log("New Handle Total");
        const totalBudget = {
            initial_amount: this.state.total_amount,
            total_amount: this.state.total_amount
        };
        console.log(totalBudget);
        axios.post("api/total", totalBudget, {headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${Cookies.get("token")}`
          }})
            .then(res => {
                console.log(res)
                this.props.history.push("/") 
            })
            .catch(err => {
                console.log("Budgeting Total Error ", err);
            })
    }



    render(){
        return(
            <div className = "container">
                <fieldset className = "form-group">
                    <legend className = "border-bottom mb-4">
                        Enter Current Balance
                    </legend>
                    <div className = "form-group">
                        <label>
                            Initial Balance*
                        </label>
                        <input type = "number" name = "total" className = "numberinput form-control"
                                placeholder = "Total Amount" onChange = {(e) => this.totalChange(e)} />
                    </div>

                </fieldset>
                <div className = "form-group">
                    <button className = "btn btn-outline-info" type = "submit" onClick = {(e) => this.handleTotal(e)}>
                        Confirm Current Balance
                    </button>
                    
                </div>
            </div>
        )
    }
}

export default Total;