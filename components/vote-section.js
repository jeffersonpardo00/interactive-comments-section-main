
class voteSection extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
        this.hasVoted = false;
    }

    static get observedAttributes(){
        return ['score'];
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name==="score"){
            this.score = newValue;
        }
    }

    getTemplate(){
        let template = document.createElement("template");
        template.innerHTML = 
        `
            <div class="vote-section">
                <button id="vote" class="vote-section__button">
                + </button>
                <span id="score" class="vote-section__score">${this.score}</span>
                <button id="unvote" class="vote-section__button">
                - </button>
            </div>
            
            ${this.getStyles()}
        `;
        return template;
    }

    getStyles(){
        return `
        <style>
            .vote-section{
                background-color: gray;
            }
            .vote-section__button {
                border: none;
                border-radius: 5px;
            }
        </style>
        `;
    }

    redrawScore(){
        this.scoreDom.innerHTML=this.score;
    }


    handleEvent(event) {

        if (event.type === "click")
        {
            if(event.target.id==='vote' && !this.hasVoted){
                this.score++;
                this.hasVoted = true;
            } 
            if(event.target.id==='unvote' && this.hasVoted){
                this.score--;
                this.hasVoted = false;
            } 
            this.redrawScore();
        }
        
    }  

    inicializeDOMElements(){
        this.scoreDom = this.shadowRoot.querySelector("#score");
        this.shadowRoot.addEventListener("click", this);
    }

    render(){
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
    }

    connectedCallback(){
        this.render();
        this.inicializeDOMElements();
    }

    disconnectedCallback() {
        this.shadowRoot.removeEventListener("click", this);
    }


}

customElements.define('vote-section',voteSection);
