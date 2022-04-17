import "./vote-section.js";
import "./reply.js";
import "./reply-input.js";
import "./editable-reply.js";
import "./modal-prompt.js";

class Comment extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    }

    getTemplate(){
        let template = document.createElement("template");
        template.innerHTML = 
        `
        <section class="comment-n-replies">
            <section class="comment-main">
                <article id="comment_${this._comment.id}" class="comment">
                    <header class="comment__header">
                     
                            <div class="comment__user">
                                <div class="comment__photo">
                                    <img class="comment__photo-img"
                                    src="${this._comment.user.image.png}" 
                                    alt="photo of ${this._comment.user.username}">
                                </div>
                                <h3 class="comment__name">
                                    ${this._comment.user.username}
                                </h3>
                            </div>
                            <p class="comment__date">
                                ${this._comment.createdAt}
                            </p>
                       
                    </header>
                    <p class="comment__content">
                        ${this._comment.content}
                    </p> 
                    <aside class="comment__aside">
                        <vote-section comment-id="${this._comment.id}" score="${this._comment.score}"></vote-section>
                    </aside>
                    <footer class="comment__footer">
                        <button id="reply-botton_${this._comment.id}" class="comment__reply-botton">
                            <img class="comment__reply-icon" src="./images/icon-reply.svg" alt="reply icon">
                            <span class="comment__reply-text">Reply</span>
                        </button>
                    </footer>
                </article> 
            </section>
            <section id="replies_${this._comment.id}" class="replies">
               
            </section>
        </section>

        
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
                border-radius: 0.3em;
           
            }
            .replies {
                padding-left: 3em;
                position: relative;
            }
            .replies::before {
                display: block;
                background-color: var(--ligth-letter-color);
                width: 3px;
                height: 100%;
                content: "";
                position: absolute;
                top: 0;
                left: 1.5em;
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

            modal-prompt{
                --acept-color: hsl(358, 79%, 66%);
                --cancel-color: var(--content-letter-color);
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

    set comment(value) {
        this._comment = value;
        this._replies = value.replies;
    }

    set currentUser(value) {
        this._currentUser = value;
    }

    getRepliesSection(){
        return this.shadowRoot.querySelector(`#replies_${this._comment.id}`);
    }

    sortReplies(){
        this._replies.sort((a,b)=>{
            return b.score - a.score;
        });
    }

    appendReplies(){
        this.sortReplies();
        this._replies.forEach((reply) => {
            const replyElement =   document.createElement("reply-component");
            replyElement.reply = reply;
            this.getRepliesSection().appendChild(replyElement);
            replyElement.setAttribute("initialized","1");
        });
    }
   
    replyThisComment(){

        const replyInput= document.createElement("reply-input");
        replyInput.currentUser = this._currentUser;
        replyInput.replying ={id:this._comment.id , username:this._comment.user.username};
        this.getRepliesSection().appendChild(replyInput);

    }

    replyAReply(toReply){

        const replyInput= document.createElement("reply-input");
        replyInput.currentUser = this._currentUser;
        replyInput.replying = toReply;
        this.getRepliesSection().appendChild(replyInput);

    }

    appendDeletePrompt(){
        const modalPrompt = document.createElement("modal-prompt");
        modalPrompt.title = 'Delete comment';
        modalPrompt.text = `Are you sure you want to delete this comment? This will
        remove the comment and can't be undone`;
        modalPrompt.aceptTextBut = 'YES, DELETE';
        modalPrompt.cancelTextBut = 'NO, CANCEL';
        this.shadowRoot.appendChild(modalPrompt);
    }

    handleEvent(event) {

        if (event.type === "replySended")
        {
            event.target.remove();
            this.createEditableReply(event.detail);
        }
        if (event.type === "replyEvent")
        {
            this.replyAReply(event.detail);
        }
        if (event.type === "deleteReply")
        {
            this.appendDeletePrompt();
            this.deleteTarget = event.target;
        }
        if(event.type === "promptResponse"){
            if(event.detail.response){
                this.deleteTarget.remove()
            }
         //   console.log(event.target);
            event.target.remove();
        }
        
    }  

    createEditableReply(replySended){

        const reply = 
        {
            id: 3,
            content: replySended.reply,
            createdAt: "today",
            score: 0,
            replyingTo: replySended.replyingTo,
            user: this._currentUser
        };
        
        const EditableReply = document.createElement("editable-reply");
        EditableReply.reply = reply;
        this.getRepliesSection().appendChild(EditableReply);
    }

    inicializeDOMElements(){
        this.replyButton = this.shadowRoot.querySelector(`#reply-botton_${this._comment.id}`);
        this.replyButton.onclick = () => this.replyThisComment();
        this.shadowRoot.addEventListener("replyEvent", this);
        this.shadowRoot.addEventListener("replySended", this);
        this.shadowRoot.addEventListener("deleteReply", this);
        this.shadowRoot.addEventListener("promptResponse", this);
    }

    render(){
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
        this.appendReplies();
    }

    connectedCallback(){
        //console.log('hola Mundo!');
        this.render();
        this.inicializeDOMElements();
    }

    disconnectedCallback() {
        this.replyButton.onclick = null;
        this.shadowRoot.removeEventListener("replyEvent", this);
        this.shadowRoot.removeEventListener("replySended", this);
        this.shadowRoot.removeEventListener("deleteReply", this);
        this.shadowRoot.removeEventListener("promptResponse", this);
    }

}

customElements.define('comment-component',Comment);
