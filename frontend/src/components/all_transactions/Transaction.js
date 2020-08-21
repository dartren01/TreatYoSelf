import React, {Component, Fragment} from 'react';

class Transaction extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const transactions = this.props.curTrans;

        return(
            <Fragment>
                <ul className="list-group flex-column ">
                            {transactions.map((transaction) => (
                                <Fragment key={transaction.id}>
                                    <li className="list-group-item flex-grow-1 align-items-stretch">
                                        <div className="row">
                                            <div className="col-sm">
                                                <h1>{transaction.source}</h1>
                                            </div>
                                            <div className="col-sm text-center">
                                                <h1>{transaction.category}</h1>
                                            </div>
                                            <div className="col-sm text-right">
                                                {transaction.t_type === "Expense" ?
                                                    <h1 style={{ color: "red" }}>-${transaction.amount}</h1>
                                                    :
                                                    <h1 style={{ color: "limegreen" }}>+${transaction.amount}</h1>}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm text-black-50">
                                                {transaction.date_posted}
                                            </div>
                                            <div className="col-sm text-right text-black-50">
                                                {transaction.t_type}
                                            </div>
                                        </div>
                                        <div className="row pt-2">
                                            <div className="col-lg text-black-50 text-wrap">
                                                {transaction.notes}
                                            </div>
                                            <div>
                                                <button onClick={() => this.props.handleUpdateRedirect(transaction.id)} className="btn btn-info">Update</button>
                                                <button onClick={() => this.props.handleDelete(transaction.id)} className="btn btn-danger">Delete</button>
                                            </div>
                                        </div>
                                    </li>
                                </Fragment>
                            ))}
                        </ul>
            </Fragment>
        )
    }
}

export default Transaction;