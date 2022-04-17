import "./vote-section.js";

class EditableComment extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});

    }

    set comment(value) {
        this._comment = value;
    }

    getTemplate(){
        let template = document.createElement("template");
        template.innerHTML = 
        `
        <article  id="comment_${this._comment.id}" class="editable-comment">
            <header class="editable-comment__header">
                    <div class="editable-comment__user">
                        <div class="editable-comment__photo">
                            <img class="editable-comment__photo-img"
                            src="${this._comment.user.image.png}" 
                            alt="photo of ${this._comment.user.username}">
                        </div>
                        <h3 class="editable-comment__name">
                            ${this._comment.user.username}
                        </h3>
                    </div>
                    <p class="editable-comment__date">
                        ${this._comment.createdAt}
                    </p>
            </header>
            
            <section id="comment-main_${this._comment.id}" class="editable-comment__main">
                <p id="content_${this._comment.id}" class="editable-comment__content">${this._comment.content}</p> 
            </section>

            <aside class="editable-comment__aside">
                <vote-section editable-comment-id="${this._comment.id}" score="${this._comment.score}"></vote-section>
            </aside>
            <section id="editCommentActions_${this._comment.id}" class="editable-comment__actions">
                <button id="delete-botton_${this._comment.id}" class="editable-comment__delete-botton">
                    <img class="editable-comment__comment-icon" src="./images/icon-delete.svg" alt="comment icon">delete
                </button>
                <button id="edit-botton_${this._comment.id}" class="editable-comment__edit-botton">
                    <img class="editable-comment__comment-icon" src="./images/icon-edit.svg" alt="comment icon">
                edit</button>
            </section>
            <footer id="updateSection_${this._comment.id}" class="editable-comment__footer hide-section">
                <button id="update-botton_${this._comment.id}" class="editable-comment__update-botton">Update</button>
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
        .editable-comment{
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
        .editable-comment__header{
            display: flex;
            align-items: center;
            grid-area: header;
            flex-wrap: wrap;
        }
        .editable-comment__main{
            grid-area: main;
        }
        .editable-comment__user
        {
            display: flex;
            align-items: center;
        }
        .editable-comment__name
        {
            margin: 0;
            padding: 0 0.5em;
            color: var(--title-letter-color);
            font-size: 1em;
        }
        .editable-comment__photo
        {
            width: 2em;
        }
        .editable-comment__photo-img{
            width: 100%;
        }
        .editable-comment__content{
            grid-area: main;
            color: var(--content-letter-color);
            line-height: 1.5em;
            padding: 1em 0;
        }
        .editable-comment__aside{
            grid-area: aside;
            display: flex;
            align-items: center;
        }
        .editable-comment__actions{
            grid-area: action;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        .editable-comment__footer{
            grid-area: footer;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-top: 0.5em;
        }
        .editable-comment__date{
            color: var(--content-letter-color);
        }

        .editable-comment__delete-botton,
        .editable-comment__edit-botton{
            background: none;
            border: none;
            color: var(--functional-letter-color);
            cursor: pointer;
            font-family: var(--primary-font);
            font-weight: 500;
            opacity: 0.7;
        }

        .editable-comment__delete-botton:active,
        .editable-comment__edit-botton:active,
        .editable-comment__delete-botton:hover,
        .editable-comment__edit-botton:hover {
            opacity: 1;
        }

        .editable-comment__delete-botton
        {
            color: hsl(358, 79%, 66%);
        }

        .editable-comment__comment-text{
            font-family: var(--primary-font);
            font-weight: 500;
            font-size: 1.17em;
        }

        .editable-comment__comment-icon{
            width: 0.85em;
            margin-right: 0.2em;
        }
        .editable-comment__comment-botton:hover *{
            opacity: 0.7;
        }

        .editable-comment__commentingTo{
            color: var(--functional-letter-color);
            font-weight: 500;
        }

        .editable-comment__update-botton
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
         
        .editable-comment__textarea
            {
                width: 100%;
                padding: 0.5em;
                border-radius: 0.4em;
                color: var(--strong-letter-color);
                resize: none;
                border-color: var(--strong-letter-color);
            }
        .editable-comment__editable-content{
            postion: relative;
            width: 100%;
        }

        .hide-section{
            display:none;
        }

        @media (min-width: 375px) {
            .editable-comment{
                grid-template-columns: 3em 1fr 1fr;
                grid-template-areas: 
                    "aside header action"
                    "aside main main"
                    "footer footer footer";
                
            }
            .editable-comment__content{
                padding: 0;
            }
        }
        </style>
        `;
    }

    deleteThisComment(){
        
        const deleteCommentEvent = new CustomEvent("deleteComment", {
            bubbles: true,
            composed: true
          });

       this.dispatchEvent(deleteCommentEvent);
    }

    toogleUpdateEdit(){
        const actionsElement = this.shadowRoot.querySelector(`#editCommentActions_${this._comment.id}`);
        actionsElement.classList.toggle("hide-section");
        const updateElement = this.shadowRoot.querySelector(`#updateSection_${this._comment.id}`);
        updateElement.classList.toggle("hide-section");
    }

    editThisComment(){

        const mainElement = this.shadowRoot.querySelector(`#comment-main_${this._comment.id}`);
        mainElement.innerHTML =`
        <p id="editable-content_${this._comment.id}" class="editable-comment__editable-content">
            <textarea class="editable-comment__textarea" name="comment__TextArea_${this._comment.id}" id="comment-TextArea_${this._comment.id}" cols="30" rows="10">${this._comment.content}</textarea>
        </p> 
        `;
        this.toogleUpdateEdit();
    }

    updateThisComment(){
        this._comment.content = this.shadowRoot.querySelector(`#comment-TextArea_${this._comment.id}`).value;
        const mainElement = this.shadowRoot.querySelector(`#comment-main_${this._comment.id}`);
        mainElement.innerHTML =`
        <p id="content_${this._comment.id}" class="editable-comment__content">
            ${this._comment.content}
        </p> 
        `;
        this.toogleUpdateEdit();
    }

    inicializeDOMElements(){
        this.deleteButton = this.shadowRoot.querySelector(`#delete-botton_${this._comment.id}`);
        this.deleteButton.onclick = () => this.deleteThisComment();
        this.editButton = this.shadowRoot.querySelector(`#edit-botton_${this._comment.id}`);
        this.editButton.onclick = () => this.editThisComment();
        this.updateButton = this.shadowRoot.querySelector(`#update-botton_${this._comment.id}`);
        this.updateButton.onclick = () => this.updateThisComment();
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

customElements.define('editable-comment',EditableComment);
