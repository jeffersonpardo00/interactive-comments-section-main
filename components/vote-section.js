
class voteSection extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
        this.hasVoted = false;
    }

    static get observedAttributes(){
        return ['score','comment-id'];
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name==="score"){
            this.score = newValue;
        }
        if (name==="comment-id"){
            this.id = newValue;
        }
    }

    getTemplate(){
        let template = document.createElement("template");
        template.innerHTML = 
        `
            <div class="vote-section">
                <button id="vote_${this.id}" votetype="vote" class="vote-section__button">
                + </button>
                <span id="score_${this.id}" class="vote-section__score">${this.score}</span>
                <button id="unvote_${this.id}" votetype="unvote" class="vote-section__button">
                - </button>
            </div>
            
            ${this.getStyles()}
        `;
        return template;
    }

    getStyles(){
         const styles = `
        <style>
            :host{
                display: block;
            }
            .vote-section{
                background-color: var(--score-background-color);
                height: 100%;
                display: flex;
                align-items: center;
                border-radius: 0.4em;
                color: var(--functional-letter-color);
                border-radius: 0.3em;
            }
            .vote-section__button {
                border: none;
                border-radius: 0.4em;
                /* padding: 0.5em 0.8em; */
                height: 2em;
                width: 2em;
                background: none;
                font-family: var(--primary-font);
                color: var(--ligth-letter-color);
                cursor: pointer;
                font-size: 1.1em;
                font-weight: bold;
            }
            .vote-section__button:hover {
                color: var(--functional-letter-color);
            }
            .vote-section__button--activate{
                color: var(--functional-letter-color);
            }

            .vote-section__score
            {
                width: 15px;
                height: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 500;
            }

            @media (min-width: 375px) {
                .vote-section{
                    flex-direction: column;
                }
            }
        </style>
        `;
        return styles;
    }

    redrawScore(){
        this.scoreDom.innerHTML=this.score;
    }

    toggleUnVote(){
        this.shadowRoot.querySelector(`#unvote_${this.id}`).classList.add('vote-section__button--activate');
        this.shadowRoot.querySelector(`#vote_${this.id}`).classList.remove('vote-section__button--activate');
    }

    toggleVote(){
        this.shadowRoot.querySelector(`#unvote_${this.id}`).classList.remove('vote-section__button--activate');
        this.shadowRoot.querySelector(`#vote_${this.id}`).classList.add('vote-section__button--activate');
    }


    handleEvent(event) {

        if (event.type === "click")
        {
            const voteType = event.target.getAttribute("votetype");
            if(voteType==='vote' && !this.hasVoted){
                this.score++;
                this.hasVoted = true;
                this.toggleVote();
            }
            if(voteType==='unvote' && this.hasVoted){
                this.score--;
                this.hasVoted = false;
                this.toggleUnVote();
            } 
            
            this.redrawScore();
        }
        
    }  

    inicializeDOMElements(){
        this.scoreDom = this.shadowRoot.querySelector(`#score_${this.id}`);
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
