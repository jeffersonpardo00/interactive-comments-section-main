import "./vote-section.js";

class EditableReply extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});

    }

    set reply(value) {
        this._reply = value;
    }

    getTemplate(){
        let template = document.createElement("template");
        template.innerHTML = 
        `
        <article  id="reply_${this._reply.id}" class="editable-reply">
            <header class="editable-reply__header">
                    <div class="editable-reply__user">
                        <div class="editable-reply__photo">
                            <img class="editable-reply__photo-img"
                            src="${this._reply.user.image.png}" 
                            alt="photo of ${this._reply.user.username}">
                        </div>
                        <h3 class="editable-reply__name">
                            ${this._reply.user.username}
                        </h3>
                    </div>
                    <p class="editable-reply__date">
                        ${this._reply.createdAt}
                    </p>
            </header>
            
            <section id="reply-main_${this._reply.id}" class="editable-reply__main">
                <p id="content_${this._reply.id}" class="editable-reply__content"><span class="editable-reply__replyingTo">@${this._reply.replyingTo}</span> ${this._reply.content}</p> 
            </section>

            <aside class="editable-reply__aside">
                <vote-section editable-reply-id="${this._reply.id}" score="${this._reply.score}"></vote-section>
            </aside>
            <section id="editReplyActions_${this._reply.id}" class="editable-reply__actions">
                <button id="delete-botton_${this._reply.id}" class="editable-reply__delete-botton">
                    <img class="editable-reply__reply-icon" src="./images/icon-delete.svg" alt="reply icon">delete
                </button>
                <button id="edit-botton_${this._reply.id}" class="editable-reply__edit-botton">
                    <img class="editable-reply__reply-icon" src="./images/icon-edit.svg" alt="reply icon">
                edit</button>
            </section>
            <footer id="updateSection_${this._reply.id}" class="editable-reply__footer hide-section">
                <button id="update-botton_${this._reply.id}" class="editable-reply__update-botton">Update</button>
            </footer>
        </article> 

            ${this.getStyles()}
        `;
        return template;
    }

    getStyles(){
        return `
        <style>
        *{
            box-sizing: border-box;
        }
        :host{
        }
        p{
            margin:0;
        }
        .editable-reply{
            background-color: white;
            padding: 1.5em;
            margin-bottom: 1em;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
            grid-template-areas: 
                "header header"
                "main main"
                "aside action"
                "footer footer";
        }
        .replies {
            padding-left: 1em;
        }
        .editable-reply__header{
            display: flex;
            align-items: center;
            grid-area: header;
            flex-wrap: wrap;
        }
        .editable-reply__main{
            grid-area: main;
        }
        .editable-reply__user
        {
            display: flex;
            align-items: center;
        }
        .editable-reply__name
        {
            margin: 0;
            padding: 0 0.5em;
            color: var(--title-letter-color);
            font-size: 1em;
        }
        .editable-reply__photo
        {
            width: 2em;
        }
        .editable-reply__photo-img{
            width: 100%;
        }
        .editable-reply__content{
            grid-area: main;
            color: var(--content-letter-color);
            line-height: 1.5em;
            padding: 1em 0;
        }
        .editable-reply__aside{
            grid-area: aside;
            display: flex;
            align-items: center;
        }
        .editable-reply__actions{
            grid-area: action;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        .editable-reply__footer{
            grid-area: footer;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-top: 0.5em;
        }
        .editable-reply__date{
            color: var(--content-letter-color);
        }

        .editable-reply__delete-botton,
        .editable-reply__edit-botton{
            background: none;
            border: none;
            color: var(--functional-letter-color);
            cursor: pointer;
            font-family: var(--primary-font);
            font-weight: 500;
            opacity: 0.7;
        }

        .editable-reply__delete-botton:active,
        .editable-reply__edit-botton:active,
        .editable-reply__delete-botton:hover,
        .editable-reply__edit-botton:hover {
            opacity: 1;
        }

        .editable-reply__delete-botton
        {
            color: hsl(358, 79%, 66%);
        }

        .editable-reply__reply-text{
            font-family: var(--primary-font);
            font-weight: 500;
            font-size: 1.17em;
        }

        .editable-reply__reply-icon{
            width: 0.85em;
            margin-right: 0.2em;
        }
        .editable-reply__reply-botton:hover *{
            opacity: 0.7;
        }

        .editable-reply__replyingTo{
            color: var(--functional-letter-color);
            font-weight: 500;
        }

        .editable-reply__update-botton
            {
                border: none;
                color: white;
                border-radius: 0.4em;
                background-color: var(--primary-color);
                padding: 0.8em;
                width: 6.5em;
                font-size: 0.8em;
                font-weight: 500;
                font-family: var(--primary-font);
            }
         
        .editable-reply__textarea
            {
                width: 100%;
                padding: 0.5em;
                border-radius: 0.4em;
                color: var(--strong-letter-color);
                resize: none;
                border-color: var(--strong-letter-color);
            }
        .editable-reply__editable-content{
            postion: relative;
            width: 100%;
        }

        .hide-section{
            display:none;
        }

        @media (min-width: 375px) {
            .editable-reply{
                grid-template-columns: 3em 1fr 1fr;
                grid-template-areas: 
                    "aside header action"
                    "aside main main"
                    "footer footer footer";
                
            }
            .editable-reply__content{
                padding: 0;
            }
        }
        </style>
        `;
    }

    deleteThisReply(){
        
        const deleteReplyEvent = new CustomEvent("deleteReply", {
            bubbles: true,
            composed: true
          });

       this.dispatchEvent(deleteReplyEvent);
    }

    toogleUpdateEdit(){
        const actionsElement = this.shadowRoot.querySelector(`#editReplyActions_${this._reply.id}`);
        actionsElement.classList.toggle("hide-section");
        const updateElement = this.shadowRoot.querySelector(`#updateSection_${this._reply.id}`);
        updateElement.classList.toggle("hide-section");
    }

    editThisReply(){

        const mainElement = this.shadowRoot.querySelector(`#reply-main_${this._reply.id}`);
        mainElement.innerHTML =`
        <p id="editable-content_${this._reply.id}" class="editable-reply__editable-content">
            <textarea class="editable-reply__textarea" name="reply__TextArea_${this._reply.id}" id="reply-TextArea_${this._reply.id}" cols="30" rows="10">@${this._reply.replyingTo} ${this._reply.content}</textarea>
        </p> 
        `;
        this.toogleUpdateEdit();
    }

    updateThisReply(){
        this._reply.content = this.shadowRoot.querySelector(`#reply-TextArea_${this._reply.id}`).value.replace(`@${this._reply.replyingTo} `, '');
        const mainElement = this.shadowRoot.querySelector(`#reply-main_${this._reply.id}`);
        mainElement.innerHTML =`
        <p id="content_${this._reply.id}" class="editable-reply__content">
            <span class="editable-reply__replyingTo">@${this._reply.replyingTo}</span>
            ${this._reply.content}
        </p> 
        `;
        this.toogleUpdateEdit();
    }

    inicializeDOMElements(){
        this.deleteButton = this.shadowRoot.querySelector(`#delete-botton_${this._reply.id}`);
        this.deleteButton.onclick = () => this.deleteThisReply();
        this.editButton = this.shadowRoot.querySelector(`#edit-botton_${this._reply.id}`);
        this.editButton.onclick = () => this.editThisReply();
        this.updateButton = this.shadowRoot.querySelector(`#update-botton_${this._reply.id}`);
        this.updateButton.onclick = () => this.updateThisReply();
    }

    render(){
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
    }

    connectedCallback(){
        this.render();
        this.inicializeDOMElements();
    }

    disconnectedCallback() {
        this.deleteButton.onclick = null;
        this.editButton.onclick = null;
    }

}

customElements.define('editable-reply',EditableReply);
