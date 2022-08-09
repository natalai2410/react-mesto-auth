import React from 'react';
import headerLogo from '../images/logo_d.svg';
import '../index.css';
import {Link} from "react-router-dom";

function Header(props) {
    return (
        <div className="header">
            <img className="logo" src={headerLogo} alt="логотип"/>
            <nav className="header__auth">
                <p className="header__text">{props.mail}</p>
                <Link to={props.route} className="header__link" type="button"
                      onClick={props.onClick}>{props.title}</Link>
            </nav>
        </div>
    );
}

export default Header;