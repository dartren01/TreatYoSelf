import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Card.css";
const Card = props => {
    return (
        <React.Fragment>
            <link href="https://fonts.googleapis.com/css2?family=Questrial&display=swap" rel="stylesheet"></link>
            <div className="card one text-center">
                <div className="overflow">
                    <img src={props.imgsrc} alt="Image" className="card-img-top" />
                </div>
                <div className="card-body text-dark">
                    <h4 className="card-title">{props.title}</h4>
                    <p className="card-text text-secondary">{props.text}</p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Card;