import "./vote-section.js";

class Reply extends HTMLElement
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
            <p class="comment__content">
                <span class="comment__replyingTo">@${this._reply.replyingTo}</span>
                ${this._reply.content}
            </p> 
            <footer class="comment__footer">
                <div class="comment__score">
                    <vote-section id="vote" score="${this._reply.score}"></vote-section>
                </div>
                <div class="comment__reply">
                    <button id="reply-botton_${this._reply.id}" class="comment__reply-botton">Reply</button>
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

    replyThisReply(){
        
        const replyEvent = new CustomEvent("replyEvent", {
            detail: {
                id: this._reply.id,
                username:  this._reply.user.username
            },
            bubbles: true,
            composed: true
          });

       this.dispatchEvent(replyEvent);
    }

    inicializeDOMElements(){
        this.replyButton = this.shadowRoot.querySelector(`#reply-botton_${this._reply.id}`);
        this.replyButton.onclick = () => this.replyThisReply();
    }

    render(){
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
    }

    connectedCallback(){
        this.render();
        this.inicializeDOMElements();
    }

    disconnectedCallback() {
        this.replyButton.onclick = null;
    }

}

customElements.define('reply-component',Reply);
