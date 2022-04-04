import "./editable-comment.js";
import "./comment.js";
import "./comment-input.js";
import "./modal-prompt.js";

class commentsSection extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    }

    static get observedAttributes(){
        return ['fetched'];
    }

    set comments(value) {
        this._comments = value;
    }
    set currentUser(value) {
        this._currentUser = value;
    }

    getTemplate(){
        let template = document.createElement("template");
        template.innerHTML = 
        `
            <div id="container" class="container">
                <div id="commentsSection" class="comments-section">
                </div>
                <div id="newComment" class="new-comments">
                </div>
            </div>
            ${this.getStyles()}
        `;
        return template;
    }

    getStyles(){
        return `
        <style>
            :host {
                --title-letter-color: hsl(212, 24%, 26%);
                --content-letter-color: hsl(211, 10%, 45%);
                --ligth-letter-color: hsl(239, 57%, 85%);
                --score-background-color: hsl(228, 33%, 97%);
                --functional-letter-color: hsl(238, 40%, 52%);
                --primary-font: 'Arial';
                --primary-color: hsl(238, 40%, 52%);
                --strong-letter-color: hsl(212deg 23% 32%);
                display: block;
                padding: 2em 1em;
                /*background-color: #e7e9eb;*/
                background-color: hsl(223, 19%, 93%);
            }
            *{
                box-sizing: border-box;
            }
            .container{
                max-width: 1440px;
                margin: 0 auto;
            }
            comment-component{
            }
            modal-prompt{
                --acept-color: hsl(358, 79%, 66%);
                --cancel-color: var(--content-letter-color);
            }
        </style>
        `;
    }

    sortComments(){
        this._comments.sort((a,b)=>{
            return b.score - a.score;
        });
    }

    appendComments(){
        this.sortComments();
        const container = this.shadowRoot.querySelector('#commentsSection');
       
        this._comments.forEach((comment) => {
            const commentElement =   document.createElement("comment-component");
            commentElement.comment = comment;
            commentElement.currentUser = this._currentUser;
            commentElement.setAttribute("initialized","1");
            container.appendChild(commentElement);
        });
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name==="fetched"){
            if(newValue==='1'){
                this.appendComments();
                this.appendNewComment();
            }
        }
    }

    getNewCommentSection(){
        return this.shadowRoot.querySelector('#newComment');
    }

    getNewId(){
        return 0;
    }

    appendNewComment(){
        const commentInput= document.createElement("comment-input");
        commentInput.currentUser = this._currentUser;
        commentInput.id = this.getNewId();
        this.getNewCommentSection().appendChild(commentInput);
    }

    render(){
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
    }

    createEditablecomment(commentSended){
        const comment = 
        {
            id: 3,
            content: commentSended.comment,
            createdAt: "today",
            score: 0,
            user: this._currentUser
        };
        
        const EditableComment = document.createElement("editable-comment");
        EditableComment.comment = comment;
        const container = this.shadowRoot.querySelector('#commentsSection');
        container.appendChild(EditableComment);
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

        if (event.type === "commentSended")
        {
            //alert("commentSended");
            this.createEditablecomment(event.detail);
        }
        if (event.type === "deleteComment")
        {
            this.appendDeletePrompt();
            this.deleteTarget = event.target;
        }
        if(event.type === "promptResponse"){
            if(event.detail.response){
                this.deleteTarget.remove()
            }
            event.target.remove();
        }
    } 

    inicializeDOMElements(){
        this.shadowRoot.addEventListener("commentSended", this);
        this.shadowRoot.addEventListener("deleteComment", this);
        this.shadowRoot.addEventListener("promptResponse", this);
    }

    connectedCallback(){
        this.render();
        this.inicializeDOMElements();
    }

    disconnectedCallback(){
        this.shadowRoot.removeEventListener("commentSended", this);
        this.shadowRoot.removeEventListener("deleteComment", this);
        this.shadowRoot.removeEventListener("promptResponse", this);
    }

}

customElements.define('comments-section',commentsSection);
