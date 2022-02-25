
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

    createCommentBox(parentNode, comment){
        const article =  document.createElement("article");
        article.classList.add("comment");
        

        const mainSection = this.createMainContent(comment.id, comment.content);
        article.appendChild(mainSection);


        parentNode.appendChild(article);
        
    }

    createElement(elementType, clase, text = null){

        const element =  document.createElement(elementType);
        element.classList.add(clase);
        if(text){
            header.innerHTML = text;
        }
        return element;

    }

    createMainContent(id, text){
        const mainSection =  document.createElement("section");
        mainSection.id = `comment_${id}`;
        mainSection.classList.add("comment__content");
        mainSection.innerHTML = text;
        return mainSection;
    }

    createHeader(user, createdAt){
        
        return mainSection;
    }

    drawCommentsSeccion(){
        const Section = document.getElementById(this.sectionName);
        this.commentArray.forEach(
            (comment) => {
                this.createCommentBox(Section, comment);
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
    console.log(commentsString);

    commentsString.comments.forEach(
        (comment) => {
        const newComment = new Comment (
            comment
        );
        comments.push(newComment);
    });

    const commentSection = new CommentSection(comments, "comments");
    commentSection.drawCommentsSeccion();

    console.log(comments);

}

main();






