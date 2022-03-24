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
        <article class="comment">
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
                        <span class="comment__you">you</span>
                    </div>
                    <p class="comment__date">
                        ${this._reply.createdAt}
                    </p>
                </div>
            </header>
            <p class="comment__content">
                <span class="comment__replyingTo">@${this._reply.replyingTo}</span>
                ${this._reply.content}
            </p> 
            <footer class="comment__footer">
                <div class="comment__score">
                    <vote-section id="vote" score="${this._reply.score}"></vote-section>
                </div>
                <div class="comment__reply">
                    <button class="comment__delete-botton">Delete</button>
                    <button class="comment__edit-botton">Edit</button>
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
            .hola {
                color: red;
            }
        </style>
        `;
    }

    render(){
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
    }

    connectedCallback(){
        this.render();
    }

}

customElements.define('editable-reply',EditableReply);
