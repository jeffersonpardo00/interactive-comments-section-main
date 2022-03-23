
class ReplyInput extends HTMLElement
{
    constructor(){
        super();
        this.attachShadow({mode:"open"});
        
    }

    static get observedAttributes(){
        return ['initialized'];
    }

    set currentUser(value) {
        this._currentUser = value;
    }

    set replyingTo(value) {
        this._replyingTo = value;
    }
   
    attributeChangedCallback(name, oldValue, newValue){
        if (name==="initialized"){
            if(newValue==='1'){
                console.log("entro reply Input");
                console.log(this._currentUser);
                //this.render();
            }
        }
    }

    getTemplate(){
        let template = document.createElement("template");
        template.innerHTML = 
        `
        <article class="reply-input">
            <header class="reply-input__header">
                <div class="reply-input__photo">
                    <img class="comment__photo-img">
                </div>
            </header>
            <p class="reply-input__content">
                <textarea name="textarea_">
                              </textarea>
            </p> 
            <footer class="reply-input__footer">
                <div class="reply-input__send">
                    <button class="reply-input__send-botton">SEND</button>
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

    render(){
        this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
    }

    connectedCallback(){
        this.render();
    }

}

customElements.define('reply-input',ReplyInput);
