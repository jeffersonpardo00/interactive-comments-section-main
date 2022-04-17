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
        <article id="comment_${this._reply.id}" class="comment">
            <header class="comment__header">
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
            </header>
            <p class="comment__content">
                <span class="comment__replyingTo">@${this._reply.replyingTo}</span>
                ${this._reply.content}
            </p> 
            <aside class="comment__aside">
                <vote-section comment-id="${this._reply.id}" score="${this._reply.score}"></vote-section>
            </aside>
            <footer class="comment__footer">
                <button id="reply-botton_${this._reply.id}" class="comment__reply-botton">
                    <img class="comment__reply-icon" src="./images/icon-reply.svg" alt="reply icon">
                    <span class="comment__reply-text">Reply</span>
                </button>
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
        .comment{
            background-color: white;
            padding: 1.5em;
            margin-bottom: 1em;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
            grid-template-areas: 
                "header header"
                "main main"
                "aside footer";
       
        }
        .replies {
            padding-left: 1em;
        }
        .comment__header{
            display: flex;
            align-items: center;
            grid-area: header;
        }
        .comment__user
        {
            display: flex;
            align-items: center;
        }
        .comment__name
        {
            margin: 0;
            padding: 0 0.5em;
            color: var(--title-letter-color);
            font-size: 1em;
        }
        .comment__photo
        {
            width: 2em;
        }
        .comment__photo-img{
            width: 100%;
        }
        .comment__content{
            grid-area: main;
            color: var(--content-letter-color);
            line-height: 1.5em;
            padding: 1em 0;
        }
        .comment__aside{
            grid-area: aside;
            display: flex;
            align-items: center;
        }
        .comment__footer{
            grid-area: footer;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        .comment__date{
            color: var(--content-letter-color);
        }

        .comment__reply-botton{
            background: none;
            border: none;
            color: var(--functional-letter-color);
            cursor: pointer;
        }

        .comment__reply-text{
            font-family: var(--primary-font);
            font-weight: 500;
            font-size: 1.17em;
        }

        .comment__reply-icon{
            width: 0.85em;
            margin-right: 0.2em;
        }
        .comment__reply-botton:hover *{
            opacity: 0.7;
        }

        .comment__replyingTo{
            color: var(--functional-letter-color);
            font-weight: 500;
        }

        @media (min-width: 375px) {
            .comment{
                grid-template-columns: 3em 3fr 1fr;
                grid-template-areas: 
                    "aside header footer"
                    "aside main main";
            }
            .comment__content{
                padding: 0;
            }
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
