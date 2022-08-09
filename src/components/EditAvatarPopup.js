import React from "react";
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {
    const avatarRef = React.useRef();

    function handleSubmit(e) {
        e.preventDefault();

        props.onUpdateAvatar({
            avatar: avatarRef.current.value
        });
    }

    React.useEffect(() => {
        avatarRef.current.value = '';
    }, [props.isOpen]);

    return (
        <PopupWithForm name="edit-avatar" title='Обновить аватар' buttonText='Сохранить'
                       isOpen={props.isOpen}
                       onClose={props.onClose}
                       onSubmit={handleSubmit}
                       onCloseCross={props.onCloseCross}>
            <label className="popup__field">
                <input className="popup__input popup__input_avatar-link"
                       type="url"
                       name='avatar-link'
                       placeholder="Ссылка на картинку"
                       id="avatar-link"
                       ref={avatarRef}
                       required/>
                <span className="popup__error"
                      id="avatar-link-error"/>
            </label>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;