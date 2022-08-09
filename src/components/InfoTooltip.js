import React from "react";
import '../index.css';

function InfoTooltip(props) {
    return (
        <div className={`popup ${props.isOpen ? 'popup_opened' : ''}`} onClick={props.onClose}>
            <div className="popup__info">
                <button className="popup__btn-close" type="button" aria-label="Выйти из попапа"
                        onClick={props.onCloseCross}/>
                <img className="popup__status" src={props.image} alt={props.title}/>
                <h2 className="popup__message">{props.title}</h2>
            </div>
        </div>
    );
}

export default InfoTooltip;