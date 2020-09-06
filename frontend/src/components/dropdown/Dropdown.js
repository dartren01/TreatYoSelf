import React, { useState, useEffect, useRef, Component } from "react";
import "./Dropdown.css"

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
            <div className="nav-item">
                <button onClick={() => setOpen(!open)} onMouseDown={() => setColor(!color)} className={color ? props.opened : props.className}>
                    {props.personName}
                    <img src={props.image} className={props.imageName}></img>
                </button>
                {open && props.children}
            </div>
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
        <a className={props.className} onClick={props.onClick} style={{ cursor: "pointer" }}>
            <span className="icon-button">{props.leftIcon}</span>
            {props.children}
            <span className="icon-right">{props.rightIcon}</span>
        </a>
    );
}

export { NavItem, DropdownItem, DropdownMenu }