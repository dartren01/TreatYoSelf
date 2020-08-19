import React, { Component, Fragment } from "react";

import Cookies from "js-cookie"
import axios from "axios";
import { withAlert } from 'react-alert';

import Transaction from './Transaction';
import Pagination from './Pagination';

class All_Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [],
            showSuccessDeleteAlert: false,
            loading: true,
            currentPage: 1,
            transactionsPerPage: 6
        }
    }

    componentDidMount = () => {
        console.log("all transactions componentDidMount");
        axios.get(`/budget/all_transactions`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${Cookies.get("token")}`
            }
        })
            .then(res => {
                console.log(res.data)
                this.setState({
                    transactions: res.data,
                    loading: false
                });
            })
            .catch(err => {
                console.log("transaction get error: " + err)
            })
        console.log(this.state.transactions);
    };

    // calls delete, passing in transaction id.
    // on success, sets state with new transaction array with the 
    // deleted transaction removed from array
    handleDelete = (id) => {
        console.log("Delete transaction ", id);
        axios.delete(`/budget/transaction/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${Cookies.get("token")}`
            }
        })
            .then(res => {
                let arrCopy = [...this.state.transactions]
                const newTransactions = arrCopy.filter(transaction => transaction.id !== id)
                this.setState({
                    transactions: newTransactions
                })
                const alert = this.props.alert;
                alert.success('Transaction Successfully Deleted');
            })
            .catch(err => {
                console.log("transaction delete error: " + err)
            })
    }

    // redirects user to update form, passing in transaction id as state.
    handleUpdateRedirect = (id) => {
        this.props.history.push({
            pathname: '/budget/update',
            state: {
                transactionId: id
            }
        })
    }

    // Pagination Functions
    paginate = (pageNum) => this.setState({currentPage: pageNum});
    nextPage = () => this.setState({currentPage: this.state.currentPage + 1});
    prevPage = () => this.setState({currentPage: this.state.currentPage - 1});


    render() {
        // have a separate page for transaction details?.

        const indexOfLastPost = this.state.currentPage * this.state.transactionsPerPage;
        const indexOfFirstPost = indexOfLastPost - this.state.transactionsPerPage;
        const currentTransactions = this.state.transactions.slice(indexOfFirstPost, indexOfLastPost);
        
        return (
            <div>
                <h1>
                    All Transactions Page
                </h1>
                {this.state.loading === true ?
                    <h1>
                        Loading Transactions . . .
                    </h1> :
                    <div>
                        <Transaction 
                        curTrans={currentTransactions}
                        handleDelete={this.handleDelete}
                        handleUpdateRedirect={this.handleUpdateRedirect}/>

                        <Pagination 
                        transactionsPerPage={this.state.transactionsPerPage}
                        totalTransactions={this.state.transactions.length}
                        currentPage={this.state.currentPage}
                        paginate={this.paginate}
                        nextPage={this.nextPage}
                        prevPage={this.prevPage}/>
                    
                    </div>}
            </div>
        )
    }
}


export default withAlert()(All_Transactions);