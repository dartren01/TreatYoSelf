import React, { useState, useEffect, useRef, Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";
import axios from "axios";
import { useLocation } from 'react-router-dom'
import logo from "./images/logo.svg";
import homeIMG from "./images/home.svg";
import transactionsIMG from "./images/transactions.svg";
import categoryIMG from "./images/category.svg";
import analyticsIMG from "./images/analytics.svg";

import gHomeIMG from "./images/gHome.svg";
import gTransactionsIMG from "./images/gTransactions.svg";
import gCategoryIMG from "./images/gCategory.svg";
import gAnalyticsIMG from "./images/gAnalytics.svg";

import pfp from "./images/profilePic.svg";
import bell from "./images/bell.svg";
import dropArrow from "./images/dropArrow.svg";

import rightArrow from "./images/rightArrow.svg";
import logout from "./images/logout.svg";
import settings from "./images/settings.svg";
import help from "./images/help.svg";

import "./Navbar.css"

const NavItem = (props) => {
    const [open, setOpen] = useState(false);
    const [color, setColor] = useState(false);
    const node = useRef();
    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);
    const handleClick = e => {
        if (!node.current.contains(e.target)) {
            setOpen(false);
            setColor(false);
        }
    }

    return (
        <div ref={node}>
            <li className="nav-item">
                <button onClick={() => setOpen(!open)} onMouseDown={() => setColor(!color)} className={color ? props.opened : props.className}>
                    {props.personName}
                    <img src={props.image} className={props.imageName}></img>
                </button>
                {open && props.children}
            </li>
        </div>
    );
}

const DropdownMenu = (props) => {

    return (
        <div className="dropdown">{props.children}</div>
    )
}

const DropdownItem = (props) => {
    return (
        <a href='#' className={props.className} onClick={props.onClick}>
            <span className="icon-button">{props.leftIcon}</span>
            {props.children}
            <span className="icon-right">{props.rightIcon}</span>
        </a>
    );
}

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.setOpen = this.setOpen.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.getPage = this.getPage.bind(this);
        this.state = {
            loading: true,
            totalAmount: "",
            whichPage: 1,
            open: false,
        };
    }
    getPage = () => {
        if (this.props.history.location.pathname === "/") {
            console.log("home")
            this.setState({ whichPage: 1 })
        } else if (this.props.history.location.pathname === "/analytics") {
            console.log("analytics")
            this.setState({ whichPage: 2 })

        } else if (this.props.history.location.pathname === "/budget/all_transactions/") {
            console.log("transactions")
            this.setState({ whichPage: 3 })
        } else if (this.props.history.location.pathname === "/category") {
            console.log("category")
            this.setState({ whichPage: 4 })
        }
    }
    componentDidMount = () => {
        this.getPage();
        console.log("Navbar componentDidMount");
        console.log(this.props.firstname, this.props.lastname)
        window.addEventListener("hashchange", this.getPage);
        axios.get(`/api/total/get`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${Cookies.get("token")}`
            }
        })
            .then(res => {
                let profileObj = res.data[0];
                console.log(profileObj)
                this.setState({
                    totalAmount: profileObj.total_amount,
                    loading: false,
                });
            })
            .catch(err => {
                console.log("total get error: " + err)
                this.setState({
                    loading: false,
                });
            })

    }
    componentWillUnmount = () => {
        window.removeEventListener("hashchange", this.getPage);
    }

    handleLogout = () => {
        Cookies.remove("token");
        this.props.deleteLogin();
        this.props.history.push("/")
        window.location.reload();
    };

    setOpen = () => {
        this.setState({ open: !this.state.open })
        console.log(this.state.open)
    }

    render() {
        let header;
        if (this.state.loading) {
            header = <h1>Loading</h1>;
        } else {
            header =
                <div className="sidebar-header">
                    <h4>
                        Balance
                    </h4>
                    <p>
                        $ {this.state.totalAmount}
                    </p>
                    <Link to="/budget/create/">
                        <button className="tranButtonStyling">
                            New Transaction
                            </button>
                    </Link>
                </div>;
        }

        let whichHome;
        if (this.state.whichPage === 1) {
            whichHome = gHomeIMG;
        } else {
            whichHome = homeIMG;
        }
        let whichAnalytics;
        if (this.state.whichPage === 2) {
            whichAnalytics = gAnalyticsIMG;
        } else {
            whichAnalytics = analyticsIMG;
        }
        let whichTransactions;
        if (this.state.whichPage === 3) {
            whichTransactions = gTransactionsIMG;
        } else {
            whichTransactions = transactionsIMG;
        }
        let whichCategories;
        if (this.state.whichPage === 4) {
            whichCategories = gCategoryIMG;
        } else {
            whichCategories = categoryIMG;
        }
        let isTotal;
        if (this.props.history.location.pathname === "/total") {
            return (<React.Fragment>
            </React.Fragment>)
        }
        return (

            <React.Fragment>
                {isTotal}
                <div className="topbar">
                    <nav className="navbar navbar-expand-xl navbar-dark" >
                        <div className="container-fluid">
                            <div className="navbar-brand">
                                <img src={logo} className="logo" /> Treat Yo'Self
                            </div>
                            <ul className="navbar-nav ml-auto">
                                <NavItem
                                    className="profile"
                                    image={pfp}
                                    imageName="pfp"
                                    personName={this.props.firstname}
                                    opened="profile"
                                >
                                    <DropdownMenu>

                                    </DropdownMenu>
                                </NavItem>
                                <NavItem
                                    className="topButton"
                                    image={bell}
                                    imageName="bell"
                                    opened="opened"
                                >
                                    <DropdownMenu>

                                    </DropdownMenu>
                                </NavItem>
                                <NavItem
                                    className="topButton"
                                    image={dropArrow}
                                    imageName="dropArrow"
                                    opened="opened"
                                >
                                    <DropdownMenu>
                                        <DropdownItem
                                            className="big-menu-item">
                                            <img className="bigPfp" src={pfp}></img>
                                            <h2>{this.props.firstname + " " + this.props.lastname}</h2>
                                        </DropdownItem>
                                        <DropdownItem
                                            className="menu-item"
                                            leftIcon={<img src={settings}></img>}
                                            rightIcon={<img src={rightArrow}></img>}>
                                            <p>
                                                Settings &amp; Privacy
                                            </p>
                                        </DropdownItem>
                                        <DropdownItem
                                            className="menu-item"
                                            leftIcon={<img src={help}></img>}
                                            rightIcon={<img src={rightArrow}></img>}>
                                            <p>
                                                Help &amp; Support
                                            </p>
                                        </DropdownItem>
                                        <DropdownItem
                                            className="menu-item"
                                            leftIcon={<img src={logout}></img>}
                                            onClick={this.handleLogout}>
                                            <p>
                                                Logout
                                            </p>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </NavItem>

                            </ul>
                        </div>
                    </nav>
                </div>
                <nav className="sidebar" id="sidebar">
                    <div className="wrapper">
                        {header}
                        <ul className="list-unstyled components">
                            <li className={this.state.whichPage === 1 ? "active" : "home"}>

                                <Link to="/" className="nav-link">
                                    <img src={whichHome} className="homeIMG" /> Home
                                </Link>
                            </li>
                            <li className={this.state.whichPage === 2 ? "active" : "analytics"}>
                                <Link to="/analytics" className="nav-link">
                                    <img src={whichAnalytics} className="homeIMG" /> Analytics
                                </Link>
                            </li>
                            <li className={this.state.whichPage === 3 ? "active" : "transactions"}>
                                <Link to="/budget/all_transactions/" className="nav-link">
                                    <img src={whichTransactions} className="homeIMG" /> Transactions
                                </Link>
                            </li>
                            <li className={this.state.whichPage === 4 ? "active" : "categories"}>
                                <Link to="/category" className="nav-link">
                                    <img src={whichCategories} className="categoryIMG" /> Categories
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </React.Fragment >
        )
    }

}

export default withRouter(Navbar);