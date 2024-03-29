
class CreateDOM {
    constructor(){
    }

    createElement(elementType, clase, text = null){

        const element =  document.createElement(elementType);
        element.classList.add(clase);
        if(text){
            element.innerHTML = text;
        }else if (text===0){
            element.innerHTML = text;
        }
        return element;

    }
   
}

class ProtoCommentDOM extends CreateDOM  {

    constructor(inID, InParentId =""){
        super();
        this.id = inID;
        this.parentId = InParentId;
        this.sectionDOM = {};
        this.scoreElement = {}; 
    }

    get getScoreNumELement(){
        return this.scoreElement;
    }
    
    createButton (clase, type = null , text = null){

        const element =  document.createElement("button");
        element.classList.add(clase);
        element.dataset.id = this.id;
        element.dataset.parentId =  this.parentId;

        if(type){
            const iconElement =  document.createElement("i");
            switch (type){
                case "upVote":
                    iconElement.classList.add("fa-solid");
                    iconElement.classList.add("fa-plus");
                    element.dataset.type = "upVote";
                break;
                case "downVote":
                    iconElement.classList.add("fa-solid");
                    iconElement.classList.add("fa-minus");
                    element.dataset.type = "downVote";

                break;
                case "reply":
                    iconElement.classList.add("fa-solid");
                    iconElement.classList.add("fa-reply");
                    element.dataset.type = "reply";
                break;
                case "sendReply":
                    element.dataset.type = "sendReply";
                break;
            } 
            element.appendChild(iconElement);
        }

        if(text){
            const textElement =  document.createElement("span");
            textElement.innerHTML = text;
            element.appendChild(textElement);
        }

        return element;

    }

    createMainContent(text, replyingTo = null){

        const mainSection = this.createElement("p", "comment__content",text);

        if(replyingTo){
            const replyingToElement =  this.createElement("span", "comment__replyingTo");
            replyingToElement.innerHTML = `@${replyingTo} `;
            mainSection.prepend(replyingToElement);
        }
        

        return mainSection;
    }

    createHeader(user, createdAt){

        const header =  this.createElement("header", "comment__header");
        const title = this.createElement("div", "comment__title");
        const userElement = this.createElement("div", "comment__user");
        const userPhoto = this.createElement("div", "comment__photo");
        const userPhotoImg = this.createElement("img", "comment__photo-img");
        userPhotoImg.src = user.image.png;
        userPhotoImg.alt = `photo of ${user.username}`;
        const name = this.createElement("h3", "comment__name", user.username);
        const date = this.createElement("p", "comment__date", createdAt);

                    userPhoto.appendChild(userPhotoImg);
                userElement.appendChild(userPhoto);
                userElement.appendChild(name);
            title.appendChild(userElement);
            title.appendChild(date);
        header.appendChild(title);
        
        return header;
    }

    createFooter(score){
        const footer =  this.createElement("footer", "comment__footer");
        const scoreElement = this.createElement("div", "comment__score");
        const upVote = this.createButton("comment__score-botton","upVote");
        const scoreNum = this.createElement("span", "comment__score-num",score);
        const downVote = this.createButton("comment__score-botton","downVote");
        downVote.classList.add("deactivateVote");
        this.scoreElement = {upVote:upVote, scoreNum: scoreNum, downVote: downVote};

        const reply = this.createElement("div", "comment__reply");
        const replybutton= this.createButton("comment__reply-botton","reply","Reply");

            scoreElement.appendChild(upVote);
            scoreElement.appendChild(scoreNum);
            scoreElement.appendChild(downVote);
            

            reply.appendChild(replybutton);

        footer.appendChild(scoreElement);
        footer.appendChild(reply);

        return footer;
    }

    createCommentBox( localcomment, replyingTo = null){

        const article =  document.createElement("article");
        article.id = `comment_${localcomment.id}`;
        article.classList.add("comment");
        
        const header = this.createHeader(localcomment.user, localcomment.createdAt);
        article.appendChild(header);

        const mainSection = this.createMainContent(localcomment.content, replyingTo);
        article.appendChild(mainSection);

        const footer = this.createFooter(localcomment.score);
        article.appendChild(footer);

        return article;
    }
    
}

class CommentDOM extends ProtoCommentDOM {

    constructor(comment){
        super(comment.id);
        this.comment = comment;
        this.commentThread = {};
        this.commentArticleDOM ={};
        this.createCommentBlock();
    }

    get getcommentArticleDOM(){
        return this.commentArticleDOM;
    }

    createCommentBlock(){

        const commentSection =  this.createElement("section", "comment-section");
        const commentMain =  this.createElement("section", "comment-section__main");
        const commentArticle = this.createCommentBox(this.comment);

            commentMain.appendChild(commentArticle);
        commentSection.appendChild(commentMain);

        this.commentArticleDOM = commentArticle;

        this.sectionDOM = commentSection;
        
    }

    appendReplyThread(replyThread){
        this.sectionDOM.appendChild(replyThread);
    }

    
}

class ReplyDOM extends ProtoCommentDOM {

    constructor(reply, commentParentId){
        super(reply.id, commentParentId);
        this.reply = reply;
        this.createReplyBlock();
    }

    createReplyBlock(){
        const commentArticle = this.createCommentBox(this.reply, this.reply.replyingTo);
        this.sectionDOM = commentArticle;
    }


}

class EditableReplyDOM extends CreateDOM {

    constructor(reply, commentParentId){
        super();
        this.reply = reply;
        this.textAreaId =  `editable_${reply.id}`;
        this.parentId = commentParentId;
        this.id = reply.id;
        this.sectionDOM = {};
        this.createReplyBlock();
    }

    createReplyBlock(){
        const commentArticle = this.createEditableReplyBox(this.reply, this.reply.replyingTo);
        this.sectionDOM = commentArticle;
    }

    createButton (clase, type = null , text = null){

        const element =  document.createElement("button");
        element.classList.add(clase);
       
        element.dataset.id =  this.id;
        element.dataset.parentId =  this.parentId;
        element.dataset.replyingTo =  this.reply.replyingTo;
        element.dataset.textAreaId =  this.textAreaId;
        

        if(type){
            const iconElement =  document.createElement("i");
            switch (type){
                case "upVote":
                    iconElement.classList.add("fa-solid");
                    iconElement.classList.add("fa-plus");
                    element.dataset.type = "upVote";
                break;
                case "downVote":
                    iconElement.classList.add("fa-solid");
                    iconElement.classList.add("fa-minus");
                    element.dataset.type = "downVote";

                break;
                case "reply":
                    iconElement.classList.add("fa-solid");
                    iconElement.classList.add("fa-reply");
                    element.dataset.type = "reply";
                break;
                case "edit":
                    element.dataset.type = "edit";
                break;
            } 
            element.appendChild(iconElement);
        }

        if(text){
            const textElement =  document.createElement("span");
            textElement.innerHTML = text;
            element.appendChild(textElement);
        }

        return element;

    }

    createMainContent(text, replyingTo = null){

        const mainSection = this.createElement("p", "comment__content");
        
        const textArea = this.createElement("textarea", "comment__textarea");
        textArea.id = this.textAreaId;
        textArea.value = text;

        mainSection.appendChild(textArea);

        
            const replyingToElement =  this.createElement("span", "comment__replyingTo");
            replyingToElement.innerHTML = `@${replyingTo} `;
            mainSection.prepend(replyingToElement);

        

        return mainSection;
    }

    createHeader(user, createdAt){

        const header =  this.createElement("header", "comment__header");
        const title = this.createElement("div", "comment__title");
        const userElement = this.createElement("div", "comment__user");
        const userPhoto = this.createElement("div", "comment__photo");
        const userPhotoImg = this.createElement("img", "comment__photo-img");
        userPhotoImg.src = user.image.png;
        userPhotoImg.alt = `photo of ${user.username}`;
        const name = this.createElement("h3", "comment__name", user.username);
        const you = this.createElement("span", "comment__you", "you");
        const date = this.createElement("p", "comment__date", createdAt);

                    userPhoto.appendChild(userPhotoImg);
                userElement.appendChild(userPhoto);
                userElement.appendChild(name);
                userElement.appendChild(you);
            title.appendChild(userElement);
            title.appendChild(date);
        header.appendChild(title);
        
        return header;
    }

   

    createEditableFooter(score){
        const footer =  this.createElement("footer", "comment__footer");
        const scoreElement = this.createElement("div", "comment__score");
        const upVote = this.createButton("comment__score-botton","upVote");
        const scoreNum = this.createElement("span", "comment__score-num",score);
        const downVote = this.createButton("comment__score-botton","downVote");
        downVote.classList.add("deactivateVote");
        this.scoreElement = {upVote:upVote, scoreNum: scoreNum, downVote: downVote};

        const edit = this.createElement("div", "comment__edit");
        const editButton= this.createButton("comment__edit-botton","edit","edit");

            scoreElement.appendChild(upVote);
            scoreElement.appendChild(scoreNum);
            scoreElement.appendChild(downVote);
            

            edit.appendChild(editButton);

        footer.appendChild(scoreElement);
        footer.appendChild(edit);

        return footer;
    }

    createEditableReplyBox( localcomment, replyingTo = null){

        const article =  document.createElement("article");
        article.id = `comment_${localcomment.id}`;
        article.classList.add("comment");
        
        const header = this.createHeader(localcomment.user, localcomment.createdAt);
        article.appendChild(header);

        const mainSection = this.createMainContent(localcomment.content, replyingTo);
        article.appendChild(mainSection);

        const footer = this.createEditableFooter(localcomment.score);
        article.appendChild(footer);

        return article;
    }

}

class ReplyThreadDOM extends CreateDOM {

    constructor(replies){
        super();
        this.threadDOM = {};
        this.replies = replies;
        this.parent = {};
        this.createReplyThread();
      //  console.log(replies);
    }

    get parentThread(){
        return this.parent;
    }

    

    createReplyThread(){

        const commentThread =  this.createElement("section", "comment-section__thread");
        this.parent = commentThread;
        if(this.replies.length > 0){
            this.replies.forEach(
                (reply) => {
                    commentThread.appendChild(reply.thisDOM.sectionDOM);
                });
        }
        this.threadDOM = commentThread;
    }

}

class ReplyInputDOM extends CreateDOM {
    constructor(inId, inParentId, inParentUserName){
        super();
        this.id = inId;
        this.parentId = inParentId;
        this.parentUserName = inParentUserName;
        this.textAreaId = `replyTo_${inParentUserName}_${inParentId}`;
        this.sectionDOM = {};
        this.createReplyInput();
        
    }

    createButton (clase, type = null , text = null){

        const element =  document.createElement("button");
        element.classList.add(clase);
       
        element.dataset.id =  this.id;
        element.dataset.parentId =  this.parentId;
        element.dataset.parentUserName =  this.parentUserName;
        element.dataset.textAreaId =  this.textAreaId;
        

        if(type){
            const iconElement =  document.createElement("i");
            switch (type){
                case "sendReply":
                    element.dataset.type = "sendReply";
                break;
                
            } 
            element.appendChild(iconElement);
        }

        if(text){
            const textElement =  document.createElement("span");
            textElement.innerHTML = text;
            element.appendChild(textElement);
        }

        return element;

    }

    createReplyInput(){
        const ReplyInputSection =  this.createElement("section", "ReplyInput");
        ReplyInputSection.style.backgroundColor = 'yellow';
        ReplyInputSection.style.height = "90px";
        ReplyInputSection.style.width = "100%";
        
        const buttonReply =  this.createButton ("ReplyInput__button", "sendReply" , "send");

        const textArea =  this.createElement("textarea", "ReplyInput__textarea");
        textArea.id = this.textAreaId;

        ReplyInputSection.appendChild(textArea);
        ReplyInputSection.appendChild(buttonReply);

        this.sectionDOM = ReplyInputSection;
    }

}

export { CommentDOM, ReplyDOM,  ReplyThreadDOM, ReplyInputDOM, EditableReplyDOM };