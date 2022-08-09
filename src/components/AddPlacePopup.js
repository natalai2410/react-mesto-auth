import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleLinkChange(e) {
        setLink(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        props.onSubmit({
            name: name,
            link: link
        });
    }

    React.useEffect(() => {
        if (props.isOpen) {
            setName('');
            setLink('');
        }
    }, [props.isOpen]);

    return (
        <PopupWithForm name="new-card" title='Новое место' buttonText='Сохранить'
                       isOpen={props.isOpen}
                       onClose={props.onClose}
                       onSubmit={handleSubmit}
                       onCloseCross={props.onCloseCross}>
            <label className="popup__field">
                <input className="popup__input popup__input_place"
                       type="text"
                       name='input-place'
                       placeholder="Название"
                       id="input-place"
                       value={name}
                       required
                       minLength="2"
                       maxLength="30"
                       onChange={handleNameChange}/>
                <span className="popup__error"
                      id="input-place-error">
      	</span>
            </label>
            <label className="popup__field">
                <input className="popup__input popup__input_link"
                       type="url"
                       name='input-link'
                       placeholder="Ссылка на картинку"
                       id="input-link"
                       value={link}
                       required
                       onChange={handleLinkChange}
                />
                <span className="popup__error"
                      id="input-link-error"/>
            </label>
        </PopupWithForm>
    )
}

export default AddPlacePopup