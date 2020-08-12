
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Team.css";
import Card2 from "./Card2";
import bannerIMG from "./images/teamBanner.svg";
import timmyIMG from "./images/timmy.png";
import darrenIMG from "./images/darren.png";
import andrewIMG from "./images/andrew.png";

class Team extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <div className="teamSection" id="team">
                <img src={bannerIMG} id="teamBG"></img>
                <div id="team-wrapper">
                    <div className="row" id="row21">
                        <div className="col-md-6">
                        </div>
                        <div className="col-md-6">
                            <p className="team-title">Our Team</p>
                            <p className="team-slogan">Meet the 3 nerds behind Treat Yo’ Self.
                            Feel free to get in contact with any of us through our social media.  </p>
                        </div>
                    </div>
                    <div className="row" id="row22">
                        <div className="col-md-4" id="colQuestion">
                            <h2 className="team-question"> Have a Question?</h2>
                            <p className="team-contact">In case you have any questions,  concerns, or business inquiries about Treat Yo’ Self,
                                <Link className="team-contact-us"> contact us</Link> and we would be happy to help. </p>
                        </div>
                        <div className="col-md-4.5">
                            <Card2
                                imgsrc={timmyIMG}
                                name="Timothy Simanhadi"
                                title="Developer"
                                text="Tbh I spent wayyyy too long designing this section of the website." />
                        </div>
                        <div className="col-md-2.5">
                            <Card2
                                imgsrc={darrenIMG}
                                name="Darren Lim"
                                title="Developer"
                                text="I love burgers and game dev, but I gave web dev a try and I’m kinda good at that too no cap." />
                        </div>
                        <div className="col-md-2.5">
                            <Card2
                                imgsrc={andrewIMG}
                                name="Andrew Kwon"
                                title="Developer"
                                text="My react skills are too strong. Someone stop me before I become too powerful." />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Team;