import React, { Component, Fragment } from "react";

import Overview from "./home_components/Overview";
import Landing from "./home_components/Landing";

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }

    }

    componentDidMount = () => {
        console.log("Home componentDidMount");
    };

    render() {
        // we can render another component when the user is not logged in, like a front page
        // when user is logged in, we can render this or a separate home page.

        let loggedInComponent;
        if (this.props.isLoggedIn) {
            loggedInComponent = <Overview />;
        } else {
            loggedInComponent = <Landing />;
        }

        return (
            <Fragment>
                {loggedInComponent}
            </Fragment>
        )
    }
}


export default Home;