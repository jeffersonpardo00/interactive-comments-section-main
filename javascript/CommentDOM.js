


class CommentDOM {

    constructor(comment){
        this.comment = comment;
        this.sectionDOM = {};
        this.scoreNumElement = {};
        this.createCommentBlock();
    }

    get getScoreNumELement(){
        return this.scoreNumElement;
    }
    
    createButton (clase, type = null , text = null){

        const element =  document.createElement("button");
        element.classList.add(clase);

        if(type){
            const iconElement =  document.createElement("i");
            switch (type){
                case "plus":
                    iconElement.classList.add("fa-solid");
                    iconElement.classList.add("fa-plus");
                    element.dataset.type = "plus";
                break;
                case "minus":
                    iconElement.classList.add("fa-solid");
                    iconElement.classList.add("fa-minus");
                break;
                case "reply":
                    iconElement.classList.add("fa-solid");
                    iconElement.classList.add("fa-reply");
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
        const plus = this.createButton("comment__score-botton","plus");
        const scoreNum = this.createElement("span", "comment__score-num",score);
        this.scoreNumElement = scoreNum;
        const minus = this.createButton("comment__score-botton","minus");
        const reply = this.createElement("div", "comment__reply");
        const replybutton= this.createButton("comment__reply-botton","reply","Reply");

            scoreElement.appendChild(plus);
            scoreElement.appendChild(scoreNum);
            scoreElement.appendChild(minus);
            

            reply.appendChild(replybutton);

        footer.appendChild(scoreElement);
        footer.appendChild(reply);

        return footer;
    }

    createCommentBox( localcomment, replyingTo = null){

        const article =  document.createElement("article");
        article.id = `comment_${this.comment.id}`;
        article.classList.add("comment");
        
        const header = this.createHeader(localcomment.user, localcomment.createdAt);
        article.appendChild(header);

        const mainSection = this.createMainContent(localcomment.content, replyingTo);
        article.appendChild(mainSection);

        const footer = this.createFooter(localcomment.score);
        article.appendChild(footer);

        return article;
    }

    createCommentBlock(){

        const commentSection =  this.createElement("section", "comment-section");
        const commentMain =  this.createElement("section", "comment-section__main");
        const commentArticle = this.createCommentBox(this.comment);

            commentMain.appendChild(commentArticle);
        commentSection.appendChild(commentMain);

        if(this.comment.replies.length > 0){
            const commentThread =  this.createElement("section", "comment-section__thread");
            
            this.comment.replies.forEach(
                (reply) => {
                    const replyElement = this.createCommentBox(reply, reply.replyingTo);
                    commentThread.appendChild(replyElement);
                });
            commentSection.appendChild(commentThread);
        }
        
        this.sectionDOM = commentSection;
    }


}

export default CommentDOM;