
class ReplyInput extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    
    }

    set replying(value) {
        this._replying = value;
    }

    set currentUser(value) {
        this._currentUser = value;
    }

    getTemplate(){
        let template = document.createElement("template");
        template.innerHTML = 
        `
        <article id="replyInputTo_${this._replying.id}" class="reply-input">
            <header class="reply-input__header">
                <div class="reply-input__photo">
                    <img class="reply-input__photo-img" src="${this._currentUser.image.png}" alt="photo of ${this._currentUser.username}">
                </div>
            </header>
            <p class="reply-input__content">
                <textarea class="reply-input__textarea" name="replyTextArea_${this._replying.id}" id="replyTextArea_${this._replying.id}" cols="30" rows="3">@${this._replying.username} </textarea>
            </p> 
            <footer class="reply-input__footer">
                    <button id="send-botton_${this._replying.id}" class="reply-input__send-botton">REPLY</button>
               
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
            .reply-input {
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: auto;
                background-color: white;
                padding: 1.5em;
                margin-bottom: 1em;
                border-radius: 0.3em;
                grid-template-areas: 
                    "main main"
                    "header footer";
                    
            }
            .reply-input__header
            {
                grid-area: header;
            }
            .reply-input__photo{
                width: 3em;
                padding: 0.3em;
            }
            .reply-input__photo-img{
                width: 100%;
            }
            .reply-input__content
            {
                grid-area: main;
                padding: 0.5em;
            }
            .reply-input__textarea
            {
                width: 100%;
                padding: 0.5em;
                border-radius: 0.4em;
                color: var(--strong-letter-color);
                resize: none;
                border-color: var(--strong-letter-color);
            }
            .reply-input__footer
            {
                grid-area: footer;
                display: flex;
                justify-content: flex-end;
                align-items: flex-start;
                padding: 0.5em 0;
            }
            .reply-input__send-botton
            {
                border: none;
                color: white;
                border-radius: 0.4em;
                background-color: var(--primary-color);
                padding: 0.8em;
                width: 6.5em;
                font-size: 0.8em;
                font-weight: 500;
                font-family: var(--primary-font);
            }
            @media (min-width: 375px) {
                .reply-input {
                    grid-template-columns: 3em 1fr 6em;
                    grid-template-areas: "header main footer";
                }
                .reply-input__photo{
                    width: 100%;
                }
                
            }
        </style>
        `;
    }

    sendReply(){
        
        const replyTextAreaValue = this.shadowRoot.querySelector(`#replyTextArea_${this._replying.id}`).value.replace(`@${this._replying.username} `, '');
        const replySended = new CustomEvent("replySended", {
            detail: {
                replyingTo:  this._replying.username,
                reply: replyTextAreaValue
            },
            bubbles: true,
            composed: true
          });

       this.dispatchEvent(replySended);
    }

    render(){
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        this.sendButton = this.shadowRoot.querySelector(`#send-botton_${this._replying.id}`);
        this.sendButton.onclick = () => this.sendReply();

    }

    connectedCallback(){
        this.render();
     //   console.log(this._currentUser);
    }

    disconnectedCallback() {
        this.sendButton.onclick = null;
    }

}

customElements.define('reply-input',ReplyInput);
