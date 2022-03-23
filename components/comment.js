import "./vote-section.js";
import "./reply.js";
import "./reply-input.js";

class Comment extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    }

    static get observedAttributes(){
        return ['initialized'];
    }

    set comment(value) {
        this._comment = value;
        this._replies = value.replies;
    }

    set currentUser(value) {
        this._currentUser = value;
    }

   /* getRepliesSection(){
        return this.shadowRoot.querySelector("#replies");
    }*/

    sortReplies(){
        this._replies.sort((a,b)=>{
            return b.score - a.score;
        });
    }

    appendComments(){
        this.sortReplies();
        this._replies.forEach((reply) => {
            const replyElement =   document.createElement("reply-component");
            replyElement.reply = reply;
           this.RepliesSection.appendChild(replyElement);
            replyElement.setAttribute("initialized","1");
        });
    }
   
    replyThisComment(){

       const replyInput= document.createElement("reply-input");
       //console.log(this._currentUser);
       replyInput.currentUser = this.currentUser;
       replyInput.replyingTo = this._comment.username;
       console.log(replyInput);
       this.RepliesSection.appendChild(replyInput);
       
       replyInput.setAttribute("initialized","1");
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name==="initialized"){
            if(newValue==='1'){
           //     console.log("initialized");
                
            }
        }
    }

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
                            <button class="comment__reply-botton">Reply</button>
                        </div>
                    </footer>
                </article> 
            </section>
            <section id="replies" class="replies">
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

    render(){
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
        
        this.RepliesSection = this.shadowRoot.querySelector("#replies");
       // this.appendComments();

        this.replyButton = this.shadowRoot.querySelector("button");
        this.replyButton.onclick = () => this.replyThisComment();


    }

    connectedCallback(){
        //console.log('hola Mundo!');
        this.render();
    }

}

customElements.define('comment-component',Comment);
