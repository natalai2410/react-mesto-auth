import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import React, {useEffect} from "react";
import PopupWithForm from './PopupWithForm';
import ImagePopup from "./ImagePopup";
import {api} from "../utils/Api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

import * as auth from "../utils/auth";

import { Route, Routes, useHistory} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import InfoTooltip from "./InfoTooltip";
import resolve from "../images/resolve.svg";
import reject from "../images/reject.svg";


import Register from "./Register";
import Login from './Login'
import {useNavigate} from "react-router-dom";

/**
 * @return {boolean}
 */
function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);

    const [loggedIn, setLoggedIn] = React.useState(false);
    const [email, setEmail] = React.useState(null);
    const history = useHistory();
    const navigate =  useNavigate();

    //_______________
    const [popupImage, setPopupImage] = React.useState("");
    const [popupTitle, setPopupTitle] = React.useState("");
    const [infoTooltip, setInfoTooltip] = React.useState(false);
    //_______________

    const tokenCheck = () => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            return
        }
        auth.getContent(jwt)
            .then((res) => {
                if (res) {
                    setLoggedIn(true);
                    setEmail(res.data.email);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    React.useEffect(() => {
        tokenCheck();
    }, []);

    React.useEffect(() => {
        history.push('/');
    }, [loggedIn]);

    const onLogin = (email, password) => {
        return auth.authorize({email, password})
            .then(({jwt, user: {email}}) => {
                localStorage.setItem("jwt", jwt);
                setLoggedIn(true);
                setEmail(email);
                navigate("/");
            }).catch(() => {
                setPopupImage(reject);
                setPopupTitle("Что-то пошло не так");
                handleInfoTooltip();
            });
    };

    const onRegister = (email, password) => {
        return auth.register({email, password})
            .then(() => {
                setPopupImage(resolve);
                setPopupTitle("Вы успешно зарегистрировались!");
                history.push("/signin");
                navigate("/signin");
            }).catch(() => {
                setPopupTitle("Что-то пошло не так");
            });
    };

    const onLoggedOut = () => {
        setLoggedIn(false);
        setEmail(null);
        navigate("/signin");
        localStorage.removeItem("jwt");
        history.push("/signin")
    };

    //-------------------------------------------------//
    React.useEffect(() => {
        Promise.all([api.getUserInfo(), api.getInitialCards()])
            .then(([userData, cards]) => {
                setCurrentUser(userData);
                setCards(cards);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function handleInfoTooltip() {
        setInfoTooltip(true);
    }

    function handleEditAvatarClick(e) {
        e.stopPropagation();
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setSelectedCard(null);
    }

    function handleUpdateUser(data) {
        api.sendUserInfo(data.name, data.about)
            .then((newUser) => {
                setCurrentUser(newUser);
                closeAllPopups();
            }).catch((err) => {
            console.error(err);
        });
    }

    function handleUpdateAvatar(data) {
        api.changeAvatar(data.avatar)
            .then((newAvatar) => {
                setCurrentUser(newAvatar);
                closeAllPopups();
            }).catch((err) => {
            console.error(err);
        });
    }

    function handlePopupCloseClick(e) {
        if (e.target.classList.contains('popup')) {
            closeAllPopups();
        }
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        if (!isLiked) {
            api.putLike(card._id, !isLiked)
                .then((newCard) => {
                    setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
                }).catch((err) => {
                console.error(err);
            });
        } else {
            api.deleteLike(card._id).then((newCard) => {
                setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
            }).catch((err) => {
                console.error(err);
            });
        }
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id).then(() => {
            setCards((state) => state.filter((c) => c._id !== card._id));
        }).catch((err) => {
            console.error(err);
        });
    }

    function handleAddPlaceSubmit(data) {
        api.addNewCard(data.name, data.link,)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            }).catch((err) => {
            console.error(err);
        });
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <div className="page__content">
                    <Routes>

                        <Route path="/signin" element={
                            <>
                                <Header title="Регистрация" route="/signup"/>
                                <Login onLogin={onLogin}/>
                            </>
                        }/>

                        <Route path="/signup" element={
                            <>
                                <Header title="Войти" route="/signin"/>
                                <Register onRegister={onRegister}/>
                            </>
                        }/>

                        < Route exact path="/" element={
                            <>
                                <Header title="Выйти" mail={email} onClick={onLoggedOut} route=""/>
                                <ProtectedRoute
                                    component={Main}
                                    LoggedIn={loggedIn}
                                    onEditProfile={handleEditProfileClick}
                                    onAddPlace={handleAddPlaceClick}
                                    onEditAvatar={handleEditAvatarClick}
                                    onCardClick={handleCardClick}
                                    cards={cards}
                                    onCardLike={handleCardLike}
                                    onCardDelete={handleCardDelete}
                                />
                                < Footer/>
                            </>
                        }/>
                    </Routes>

                    <EditProfilePopup
                        isOpen={isEditProfilePopupOpen}
                        onClose={handlePopupCloseClick}
                        onUpdateUser={handleUpdateUser}
                        onCloseCross={closeAllPopups}
                    />

                    <AddPlacePopup
                        isOpen={isAddPlacePopupOpen}
                        onClose={handlePopupCloseClick}
                        onSubmit={handleAddPlaceSubmit}
                    />
                    <EditAvatarPopup
                        isOpen={isEditAvatarPopupOpen}
                        onClose={handlePopupCloseClick}
                        onUpdateAvatar={handleUpdateAvatar}
                        onCloseCross={closeAllPopups}
                    />
                    <PopupWithForm name="delete-card" title='Вы уверены?' buttonText='Да'>
                    </PopupWithForm>
                    <ImagePopup
                        card={selectedCard}
                        onClose={handlePopupCloseClick}
                        onCloseCross={closeAllPopups}
                    />
                    <InfoTooltip
                        image={popupImage}
                        title={popupTitle}
                        isOpen={infoTooltip}
                        onClose={handlePopupCloseClick}
                        onCloseCross={closeAllPopups}
                    />
                </div>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
