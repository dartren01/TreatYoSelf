import React, { Component } from "react";
import { render } from "react-dom";

// react alerts: https://www.npmjs.com/package/react-alert
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

// Using HashRouter so reloading don't look into backend
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Cookies from "js-cookie"
import axios from "axios";

import './App.css';
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import Login from "./components/login/Login"
import Register from "./components/register/Register"
import Total from "./components/total/Total"
import All_Transactions from "./components/all_transactions/All_Transactions"
import Create_Transaction from "./components/create_transaction/Create_Transaction";
import Update_Transaction from "./components/update_transaction/Update_Transaction";


// Notes: Need to figure out how to login in before rendering components.
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      isLoggedIn: false,
      loadPage: null
    };
    this.options = {
      // you can also just use 'bottom center'
      position: positions.TOP_CENTER,
      timeout: 5000,
      offset: '30px',
      // you can also just use 'scale'
      transition: transitions.SCALE
    }
    this.nextPath = this.nextPath.bind(this);
    this.setLogin = this.setLogin.bind(this);
    this.deleteLogin = this.deleteLogin.bind(this);
    this.checkLogin = this.checkLogin.bind(this);

  }

  nextPath = (path) => {
    this.props.history.push(path);
  };

  setLogin = (res) => {
    this.setState({
      username: res.data.user.username,
      isLoggedIn: true
    })
  };

  deleteLogin = () => {
    this.setState({
      username: "",
      isLoggedIn: false
    })
  };

  checkLogin = () => {
    if (Cookies.get("token") && !this.state.isLoggedIn) {
      console.log("Cookie has been found and User is not logged in")
      axios.get("/api/auth/user", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${Cookies.get("token")}`
        }
      })
        .then(res => {
          this.setState({
            username: res.data.username,
            isLoggedIn: true,
            loadPage: true
          });
          console.log("CheckLogin: User has Logged In (App)")
        })
        .catch(err => {
          console.log("Checking Logged In Error" + err)
          this.setState({
            loadPage: true
          })
        })
    }
  };

  componentDidMount = () => {
    console.log("App componentDidMount");
    this.checkLogin();
  };


  // Maybe we can use private routes
  render() {
    if (!this.state.loadPage) {
      return <div></div>
    }

    return (
      <AlertProvider template={AlertTemplate} {...this.options}>
        <Router>
          {console.log("App Render")}
          <Navbar
            {...this.props}
            isLoggedIn={this.state.isLoggedIn}
            nextPath={this.nextPath}
            deleteLogin={this.deleteLogin}
          />
          <div className="container">
            <Switch>
              <Route exact path="/" render={props => (
                <Home {...props}
                  username={this.state.username}
                  isLoggedIn={this.state.isLoggedIn}
                  checkLogin={this.checkLogin} />
              )} />
              <Route exact path="/budget/all_transactions" render={props => (
                <All_Transactions {...props}
                  username={this.state.username}
                  isLoggedIn={this.state.isLoggedIn}
                  checkLogin={this.checkLogin} />
              )} />
              <Route exact path="/budget/income" render={props => (
                <Create_Transaction {...props}
                  isLoggedIn={this.state.isLoggedIn}
                  transactionType='Income' />
              )} />
              <Route exact path="/budget/expense" render={props => (
                <Create_Transaction {...props}
                  isLoggedIn={this.state.isLoggedIn}
                  transactionType='Expense' />
              )} />
              <Route exact path="/budget/update" render={props => (
                <Update_Transaction {...props}
                  isLoggedIn={this.state.isLoggedIn} />
              )} />
              <Route path="/register" render={props => (
                <Register {...props}
                  setLogin={this.setLogin}
                />
              )} />
              <Route path="/login" render={props => (
                <Login {...props}
                  setLogin={this.setLogin}
                />
              )} />
              <Route path="/total" render={props => (
                <Total {...props}
                />
              )} />
            </Switch>
          </div>
        </Router>
      </AlertProvider >

    )
  }
}

export default App;

const container = document.getElementById("app");
render(<App />, container);
