import React from 'react';
import '../index.css';

function PopupWithForm(props) {

    return (
        <div className={`popup popup_${props.name}  ${props.isOpen && 'popup_opened'}`} onClick={props.onClose}>
            <div className="popup__content popup__content_common">
                <button className="popup__btn-close" type="button" aria-label="Выйти из попапа" onClick={props.onCloseCross}/>
                <h2 className="popup__title">{props.title}</h2>
                <form className="popup__form" name={props.form} noValidate onSubmit={props.onSubmit}>
                    {props.children}
                    <button className="popup__btn-save" type="submit">{props.buttonText}</button>
                </form>
            </div>
        </div>
    )
}

export default PopupWithForm;