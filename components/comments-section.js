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
        this._comments.forEach((comment) => {
            const commentElement =   document.createElement("comment-component");
            commentElement.comment = comment;
            commentElement.currentUser = this._currentUser;
            commentElement.setAttribute("initialized","1");
            this.shadowRoot.appendChild(commentElement);
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
            <div class="hola">Esta es la sección</div>
            ${this.getStyles()}
        `;
        return template;
    }

    getStyles(){
        return `
        <style>
            .hola {
                color: blue;
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

customElements.define('comments-section',commentsSection);
