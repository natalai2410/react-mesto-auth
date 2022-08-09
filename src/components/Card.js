import React from 'react';
import '../index.css';
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Card(props) {
    const currentUser = React.useContext(CurrentUserContext);
    const isLiked = props.card.likes.some(i => i._id === currentUser._id);
    const isOwn = props.card.owner._id === currentUser._id;

    function handleClick() {
        props.onCardClick(props.card);
    }

    function handleLikeClick() {
        props.onCardLike(props.card);
    }

    const cardLikeButtonClassName = (
        `place-item__like ${isLiked ? 'place-item__like_active' : ''}`
    );

    function handleDeleteClick() {
        props.onCardDelete(props.card);
    }

    const cardDeleteButtonClassName = (
        `place-item__bin ${isOwn ? '' : 'place-item__bin_disabled'}`
    );

    return (
        <li className="place-item">
            <button className={cardDeleteButtonClassName} type="button" aria-label="Корзина"
                    onClick={handleDeleteClick}/>
            <img src={props.link} className="place-item__image" alt={props.name} onClick={handleClick}/>
            <div className="place-item__content">
                <h2 className="place-item__title ellipsis-block">{props.name}</h2>
                <div className="place-item__content-like">
                    <button className={cardLikeButtonClassName} type="button" aria-label="Лайк"
                            onClick={handleLikeClick}/>
                    <p className="place-item__count-like">{props.likes}</p>
                </div>
            </div>
        </li>
    );
}

export default Card;