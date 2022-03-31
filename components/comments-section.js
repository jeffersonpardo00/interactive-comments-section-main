import "./comment.js";

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
            }
        }
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
        </style>
        `;
    }

    getNewCommentSection(){
        return this.shadowRoot.querySelector('#newComment');
    }

    appendNewComment(){
        const replyInput= document.createElement("reply-input");
        replyInput.currentUser = this._currentUser;
        replyInput.replying ={id:this._comment.id , username:this._comment.user.username};
        this.getNewCommentSection().appendChild(replyInput);
    }

    render(){
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
    }

    connectedCallback(){
        this.render();
       // this.appendNewComment();
    }

}

customElements.define('comments-section',commentsSection);
