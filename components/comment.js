import "./vote-section.js";

class Comment extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    }

    static get observedAttributes(){
        return ['score' ];
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name==="score"){
            //console.log("entro");
            this.score = newValue;
        }
    }

    getTemplate(){
        let template = document.createElement("template");
        template.innerHTML = 
        `
            <div class="hola">coment score:${this.score}</div>
            <vote-section id="vote" score="${this.score}"></vote-section>
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
        //console.log('hola Mundo!');
        this.render();
       // this.shadowRoot.querySelector("vote-section").score = this.score;
       // console.log(voteSec);
    }

}

customElements.define('comment-component',Comment);
