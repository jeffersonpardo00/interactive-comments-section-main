class modalPrompt extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    
    }

    set title(value) {
        this._title = value;
    }

    set text(value) {
        this._text = value;
    }

    set aceptTextBut(value) {
        this._aceptTextBut = value;
    }

    set cancelTextBut(value) {
        this._cancelTextBut = value;
    }

    getTemplate(){
        let template = document.createElement("template");
        template.innerHTML = 
        `
            <article id="deletePrompt" class="prompt">
                <header class="prompt__header">
                    <h1 class="prompt__title"><strong>${this._title}</strong></h1>
                </header>
                <p class="prompt__content">
                   ${this._text}
                </p> 
                <footer class="prompt__footer">
                    <button id="cancelButton" class="prompt__cancel-botton">${this._cancelTextBut}</button>
                    <button id="aceptButton" class="prompt__acept-botton">${this._aceptTextBut}</button>
                </footer>
            </article> 
            ${this.getStyles()}
        `;

        return template;
    }

    getStyles(){
        return `
        <style>
            *{
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            :host{
                background-color: #3a3a3aa6;
                height: 100vh;
                width: 100vw;
                position: fixed;
                top: 0;
                left: 0;
                padding: 1.2em;
                --acept-color: green;
                --cancel-color: gray;
                z-index:1000;
            }

            .prompt{
                width: 90%;
                max-width: 400px;
                background-color: white;
                border-radius: 0.5em;
                padding: 1.2em;
                margin-top: 35vh;
                margin-left: auto;
                margin-right: auto;
            }

            .prompt__header{
                padding-bottom: 1em;
            }

            .prompt__title{
                color: var(--title-letter-color);
                font-size: 1.1em;
            }

            .prompt__content{
                padding-bottom: 1em;
                color: var(--content-letter-color);
            }

            .prompt__footer{
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .prompt__acept-botton,
            .prompt__cancel-botton{
                font-family: var(--primary-font);
                padding: 1em 1.2em;
                border-radius: 0.5em;
                background-color: var(--cancel-color);
                color: white;
                text-align: center;
                font-size: 0.9em;
                border: none;
                font-weight: 500;
                cursor: pointer;
            }

            .prompt__acept-botton{
                margin-left: 0.8em;
                background-color: var(--acept-color);
            }
         
            @media (min-width: 375px) {
               
            }
        </style>
        `;
    }

    cancelPrompt(){
        const cancelPrompt = new CustomEvent("promptResponse", {
            detail: {
                response: false
            },
            bubbles: true,
            composed: false
          });

       this.dispatchEvent(cancelPrompt);
    }

    aceptPrompt(){
       
        const aceptPrompt = new CustomEvent("promptResponse", {
            detail: {
                response: true
            },
            bubbles: true,
            composed: false
          });

       this.dispatchEvent(aceptPrompt);
    }

   
    render(){
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        this.cancelButton = this.shadowRoot.querySelector('#cancelButton');
        this.cancelButton.onclick = () => this.cancelPrompt();

        this.aceptButton = this.shadowRoot.querySelector('#aceptButton');
        this.aceptButton.onclick = () => this.aceptPrompt();

    }

    connectedCallback(){
        this.render();
    }

    disconnectedCallback() {
        this.cancelButton.onclick = null;
        this.aceptButton.onclick = null;
    }

}

customElements.define('modal-prompt',modalPrompt);
