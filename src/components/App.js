import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import React from "react";
import PopupWithForm from './PopupWithForm';
import ImagePopup from "./ImagePopup";
import {api} from "../utils/Api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

import * as auth from "../utils/auth";

import {useHistory} from "react-router-dom";


import ProtectedRoute from "./ProtectedRoute";

import InfoTooltip from "./InfoTooltip";

import success from "../images/success.svg";
import fail from "../images/fail.svg";


import Register from "./Register";
import Login from './Login'
import Switch from "react-router-dom/es/Switch";
import Route from "react-router-dom/es/Route";


import Redirect from "react-router-dom/es/Redirect";


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
        return auth.authorize(email, password)
            .then((res) => {
                localStorage.setItem("jwt", res.token);
                setLoggedIn(true);
                setEmail(email);
                history.push("/");
            }).catch(() => {
                setPopupImage(fail);
                setPopupTitle("Что-то пошло не так!\n" +
                    "Попробуйте ещё раз.");
                handleInfoTooltip();
            });
    };

    const onRegister = (email, password) => {
        return auth.register(email, password)
            .then(() => {
                setPopupImage(success);
                setPopupTitle("Вы успешно зарегистрировались!");
                history.push("/signin");
            }).catch(() => {
                setPopupImage(fail);
                setPopupTitle("Что-то пошло не так");
                handleInfoTooltip();
            });
    };

    const onLoggedOut = () => {
        setLoggedIn(false);
        setEmail(null);
        localStorage.removeItem("jwt");
        //history.push("/signin")
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
        setInfoTooltip(false);
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
                    <Switch>
                        <Route path="/signin">
                            <Header title="Регистрация" route="/signup"/>
                            <Login onLogin={onLogin}/>
                        </Route>

                        <Route path="/signup">
                            <Header title="Войти" route="/signin"/>
                            <Register onRegister={onRegister}/>
                        </Route>

                        <Route path="/">
                            <Header title="Выйти" mail={email} onClick={onLoggedOut} route=""/>
                            <ProtectedRoute exact path="/"
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
                        </Route>

                        <Route exact path="*">
                            {loggedIn ? <Redirect to="/"/> : <Redirect to="/signin"/>}
                        </Route>

                    </Switch>

                    {loggedIn && < Footer/>}

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
