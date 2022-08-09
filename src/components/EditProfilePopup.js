import React from "react";
import PopupWithForm from './PopupWithForm';
import {CurrentUserContext} from "../contexts/CurrentUserContext";


function EditProfilePopup(props) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const currentUser = React.useContext(CurrentUserContext);

    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, props.isOpen]);

    function handleNameChange(evt) {
        setName(evt.target.value);
    }

    function handleDescriptionChange(evt) {
        setDescription(evt.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        props.onUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm name="edit-profile" title='Редактировать профиль' buttonText='Сохранить'
                       onSubmit={handleSubmit}
                       isOpen={props.isOpen}
                       onClose={props.onClose}
                       onCloseCross={props.onCloseCross}
        >
            <label className="popup__field">
                <input className="popup__input popup__input_title"
                       type="text"
                       name="input-title"
                       value={name || ""}
                       id="input-title"
                       required
                       minLength="2"
                       maxLength="40"
                       onChange={handleNameChange}
                />
                <span className="popup__error"
                      id="input-title-error"/>
            </label>
            <label className="popup__field">
                <input className="popup__input popup__input_job"
                       type="text"
                       name='input-job'
                       value={description || ""}
                       id="input-job"
                       required
                       minLength="2"
                       maxLength="200"
                       onChange={handleDescriptionChange}
                />
                <span className="popup__error"
                      id="input-job-error"/>
            </label>
        </PopupWithForm>
    )
}

export default EditProfilePopup;