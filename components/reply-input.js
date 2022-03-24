
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
                <img src="${this._currentUser.image.png}" alt="photo of ${this._currentUser.username}">
                
                </div>
            </header>
            <p class="reply-input__content">
                <span class="reply-input__replyingTo">@${this._replying.username}</span>
                <textarea name="replyTextArea_${this._replying.id}" id="replyTextArea_${this._replying.id}" cols="30" rows="10"></textarea>
            </p> 
            <footer class="reply-input__footer">
                <div class="reply-input__send">
                    <button id="send-botton_${this._replying.id}" class="reply-input__send-botton">SEND</button>
                </div>
            </footer>
            
        </article> 
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

    sendReply(){
        
        const replyTextAreaValue = this.shadowRoot.querySelector(`#replyTextArea_${this._replying.id}`).value;
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
