import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Card2.css";
const Card2 = props => {
    return (
        <React.Fragment>
            <link href="https://fonts.googleapis.com/css2?family=Questrial&display=swap" rel="stylesheet"></link>
            <div className="card two text-center">
                <div className="overflow">
                    <img src={props.imgsrc} alt="Image" className="card-img-top" />
                </div>
                <div className="card-body">
                    <h4 className="card-title">{props.name}</h4>
                    <h5 className="card-subtitle">{props.title} </h5>
                    <p className="card-text text-secondary">" {props.text} "</p>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Card2;