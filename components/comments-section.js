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

    appendComments(){
        this.sortComments();
        this._comments.forEach((comment) => {
            const commentElement =   document.createElement("comment-component");
            commentElement.setAttribute("score",comment.score);
            this.shadowRoot.appendChild(commentElement);
        });

    }

    sortComments(){
        this._comments.sort((a,b)=>{
            return b.score - a.score;
        });
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name==="fetched"){
            if(newValue==='1'){
                this.appendComments();
            }
        }
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
