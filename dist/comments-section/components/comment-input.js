class commentInput extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
    
    }

    set id(value) {
        this._id = value;
    }

    set currentUser(value) {
        this._currentUser = value;
    }

    getTemplate(){
        let template = document.createElement("template");
        template.innerHTML = 
        `
            <article id="commentInput_${this._id}" class="comment-input">
                <header class="comment-input__header">
                    <div class="comment-input__photo">
                        <img class="comment-input__photo-img" src="${this._currentUser.image.png}" alt="photo of ${this._currentUser.username}">
                    </div>
                </header>
                <p class="comment-input__content">
                    <textarea class="comment-input__textarea" name="commentTextArea_${this._id}" id="commentTextArea_${this._id}" 
                    placeholder="add a comment..." cols="30" rows="3"></textarea>
                </p> 
                <footer class="comment-input__footer">
                        <button id="send-botton_${this._id}" class="comment-input__send-botton">REPLY</button>
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
            .comment-input {
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
            .comment-input__header
            {
                grid-area: header;
            }
            .comment-input__photo{
                width: 3em;
                padding: 0.3em;
            }
            .comment-input__photo-img{
                width: 100%;
            }
            .comment-input__content
            {
                grid-area: main;
                padding: 0.5em;
            }
            .comment-input__textarea
            {
                width: 100%;
                padding: 0.5em;
                border-radius: 0.4em;
                color: var(--strong-letter-color);
                resize: none;
                border-color: var(--strong-letter-color);
            }
            .comment-input__footer
            {
                grid-area: footer;
                display: flex;
                justify-content: flex-end;
                align-items: flex-start;
                padding: 0.5em 0;
            }
            .comment-input__send-botton
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
                cursor: pointer;
            }
            @media (min-width: 375px) {
                .comment-input {
                    grid-template-columns: 3em 1fr 6em;
                    grid-template-areas: "header main footer";
                }
                .comment-input__photo{
                    width: 100%;
                }
                
            }
        </style>
        `;
    }

    sendComment(){
        const commentTextArea = this.shadowRoot.querySelector(`#commentTextArea_${this._id}`);
        const commentTextAreaValue = commentTextArea.value;
        const commentSended = new CustomEvent("commentSended", {
            detail: {
                comment: commentTextAreaValue
            },
            bubbles: true,
            composed: true
          });

       this.dispatchEvent(commentSended);
       commentTextArea.value='';
    }

   
    render(){
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));

        this.sendButton = this.shadowRoot.querySelector(`#send-botton_${this._id}`);
        this.sendButton.onclick = () => this.sendComment();

    }

    connectedCallback(){
        this.render();
     //   console.log(this._currentUser);
    }

    disconnectedCallback() {
        this.sendButton.onclick = null;
    }

}

customElements.define('comment-input',commentInput);
