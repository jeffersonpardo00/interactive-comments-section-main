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
            <article id="reply_${this._reply.id}" class="comment">
                <header class="comment__header">
                    <div class="comment__title">
                        <div class="comment__user">
                            <div class="comment__photo">
                                <img class="comment__photo-img"
                                src="${this._reply.user.image.png}" 
                                alt="photo of ${this._reply.user.username}">
                            </div>
                            <h3 class="comment__name">
                                ${this._reply.user.username}
                            </h3>
                        </div>
                        <p class="comment__date">
                            ${this._reply.createdAt}
                        </p>
                    </div>
                </header>

                <section id="reply-main_${this._reply.id}" class="comment__main">
                    <p id="content_${this._reply.id}" class="comment__content"><span class="comment__replyingTo">@${this._reply.replyingTo}</span>${this._reply.content}</p> 
                </section>
                
                <div id="editReplyActions_${this._reply.id}" class="comment__actions">
                        <button id="edit-botton_${this._reply.id}" class="comment__edit-botton">edit</button>
                        <button id="delete-botton_${this._reply.id}" class="comment__edit-botton">delete</button>
                </div>
                <footer class="comment__footer">
                    <div class="comment__score">
                        <vote-section id="vote" score="${this._reply.score}"></vote-section>
                    </div>
                    <div id="updateSection_${this._reply.id}" class="comment__update hide-section">
                        <button id="update-botton_${this._reply.id}" class="comment__update-botton">Update</button>
                    </div>
                </footer>
                
            </article> 
            ${this.getStyles()}
        `;
        return template;
    }

    getStyles(){
        return `
        <style>
            .hide-section {
                display: none;
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
        <p id="editable-content_${this._reply.id}" class="comment__editable-content">
            <span class="comment__replyingTo">@${this._reply.replyingTo}</span>
            <textarea name="reply__TextArea_${this._reply.id}" id="reply-TextArea_${this._reply.id}" cols="30" rows="10">${this._reply.content}</textarea>
        </p> 
        `;
        this.toogleUpdateEdit();
    }

    updateThisReply(){
        this._reply.content = this.shadowRoot.querySelector(`#reply-TextArea_${this._reply.id}`).value;
        const mainElement = this.shadowRoot.querySelector(`#reply-main_${this._reply.id}`);
        mainElement.innerHTML =`
        <p id="content_${this._reply.id}" class="comment__content">
            <span class="comment__replyingTo">@${this._reply.replyingTo}</span>
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
