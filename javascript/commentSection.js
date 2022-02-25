
"use strict";

class ProtoComment {

    constructor(id, content,createdAt, user){
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.user = user;
        this.score = 0;
    }

}

class Comment extends ProtoComment {
    constructor(comment){
        super(comment.id, comment.content, comment.createdAt, comment.user);
        this.replies = comment.replies;
    }
}

class reply extends ProtoComment {
    constructor(comment){
        super(comment.id, comment.content, comment.createdAt, comment.user);
        this.replyingTo = comment.replyingTo;
    }
}

class CommentSection {
    constructor(commentArray, sectionName){
        this.commentArray = commentArray;
        this.sectionName = sectionName;
    }

    createButton(clase, icon = null , text = null){

        const element =  document.createElement("button");
        element.classList.add(clase);

        if(icon){
            const iconElement =  document.createElement("i");
            switch (icon){
                case "plus":
                    iconElement.classList.add("fa-solid");
                    iconElement.classList.add("fa-plus");
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

    createMainContent(id, text, replyingTo = null){
        const mainSection =  document.createElement("section");
        mainSection.id = `comment_${id}`;
        mainSection.classList.add("comment__content");
        mainSection.innerHTML = text;

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
    }S

    createCommentBox(comment, replyingTo = null){

        const article =  document.createElement("article");
        article.classList.add("comment");
        
        const header = this.createHeader(comment.user, comment.createdAt);
        article.appendChild(header);

        const mainSection = this.createMainContent(comment.id, comment.content, replyingTo);
        article.appendChild(mainSection);

        const footer = this.createFooter(comment.score);
        article.appendChild(footer);

        return article;
    }

    createCommentSection(comment){

        const commentSection =  this.createElement("section", "comment-section");
        const commentArticle = this.createCommentBox(comment);

        commentSection.appendChild(commentArticle);

        if(comment.replies.length > 0){
            const commentThread =  this.createElement("section", "comment-thread");
            
            comment.replies.forEach(
                (reply) => {
                    const replyElement = this.createCommentBox(reply, reply.replyingTo);
                    commentThread.appendChild(replyElement);
                });
            commentSection.appendChild(commentThread);
        }
        
        return commentSection
        
    }

    drawCommentsSeccion(){
        const Section = document.getElementById(this.sectionName);
        this.commentArray.forEach(
            (comment) => {
               const commentSection = this.createCommentSection(comment);
               Section.appendChild(commentSection);
        });
    }

}

const main = async () =>
{

    let commentsString;
    let comments = [];

    const getComments = async ()=> {

        const url = '../data.json';
        const response = await fetch (url);
        const data = await response.json();
        return data;
    }

    commentsString = await getComments();
   // console.log(commentsString);

    commentsString.comments.forEach(
        (comment) => {
        const newComment = new Comment (
            comment
        );
        comments.push(newComment);
    });

    const commentSection = new CommentSection(comments, "comments");
    commentSection.drawCommentsSeccion();

    //console.log(comments);

}

main();






