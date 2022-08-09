import React from 'react';
import '../index.css';

function ImagePopup(props) {
    return (
        <div className={`popup popup_view-card" ${props.card && 'popup_opened'}`} onClick={props.onClose}>
            <figure className="popup__content">
                <button className="popup__btn-close" type="button" aria-label="Выйти из попапа"
                        onClick={props.onCloseCross}/>
                <img className="popup__image" src={props.card?.link}
                     alt={props.card ? props.card.name : ''}/>
                <figcaption className="popup__caption">{props.card ? props.card.name : ''}</figcaption>
            </figure>
        </div>
    )
}

export default ImagePopup;