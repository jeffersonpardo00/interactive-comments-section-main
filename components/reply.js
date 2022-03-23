import "./vote-section.js";

class Reply extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    }

    static get observedAttributes(){
        return ['initialized'];
    }

    set reply(value) {
        this._reply = value;
    }
   
    attributeChangedCallback(name, oldValue, newValue){
        if (name==="initialized"){
            if(newValue==='1'){
                console.log("entro");
            }
        }
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
                    </div>
                    <p class="comment__date">
                        ${this._reply.createdAt}
                    </p>
                </div>
            </header>
            <p class="comment__content">
                <span class="comment__replyingTo">@${this._reply.user.replyingTo}</span>
                ${this._reply.content}
            </p> 
            <footer class="comment__footer">
                <div class="comment__score">
                    <vote-section id="vote" score="${this._reply.score}"></vote-section>
                </div>
                <div class="comment__reply">
                    <button class="comment__reply-botton">Reply</button>
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

customElements.define('reply-component',Reply);
