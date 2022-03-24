import "./vote-section.js";
import "./reply.js";
import "./reply-input.js";
import "./editable-reply.js";

class Comment extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    }

    /*static get observedAttributes(){
        return ['initialized'];
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name==="initialized"){
            if(newValue==='1'){
           //     console.log("initialized");
                
            }
        }
    }*/
    
    getTemplate(){
        let template = document.createElement("template");
        template.innerHTML = 
        `
        <section class="comment-n-replies">
            <section class="comment-main">
                <article id="comment_${this._comment.id}" class="comment">
                    <header class="comment__header">
                        <div class="comment__title">
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
                        </div>
                    </header>
                    <p class="comment__content">
                        ${this._comment.content}
                    </p> 
                    <footer class="comment__footer">
                        <div class="comment__score">
                            <vote-section id="vote" score="${this._comment.score}"></vote-section>
                        </div>
                        <div class="comment__reply">
                            <button id="reply-botton_${this._comment.id}" class="comment__reply-botton">Reply</button>
                        </div>
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
            .replies {
                background-color: grey;
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
    }

}

customElements.define('comment-component',Comment);
