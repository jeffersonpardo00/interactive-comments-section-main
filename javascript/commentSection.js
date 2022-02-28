"use strict";

import CommentDOM from './CommentDOM.js';


class ProtoComment {

    constructor(id, content,createdAt, user, score){
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.user = user;
        this.score = score;
    }

}

class Comment extends ProtoComment {

    constructor(comment, section){
        super(comment.id, comment.content, comment.createdAt, comment.user, comment.score);
        this.replies = comment.replies;
        this.section = section;
        this.commentDOM = new CommentDOM(comment);
    }

   eventHandler(e){

        if(e.target.matches("button")||e.target.parentElement.matches("button"))
        {
            let targetElement = e.target;
            if( e.target.parentElement.matches("button") ){
                targetElement = e.target.parentElement;
            }
            console.log(targetElement.dataset);

            const type = targetElement.dataset.type;

            switch(type)
            {
                case "plus":
                    this.vote(targetElement)
                break;
                default:
                    console.log(type);
                break;
            }
            
            
        }
        
   }

   vote(element){
       this.score ++;
    console.log(this.score);
    //console.log(element);
   }

   DrawSection = () => {

    this.commentDOM.createCommentSection();

    this.commentDOM.sectionDOM.addEventListener("click", (e)=>{
        this.eventHandler(e);
    });

    this.section.appendChild(this.commentDOM.sectionDOM);
    
    }

}

class reply extends ProtoComment {
    constructor(comment){
        super(comment.id, comment.content, comment.createdAt, comment.user);
        this.replyingTo = comment.replyingTo;
    }
}

class CommentSection {

    constructor(comments){
        this.comments = comments;
    }


}

const main = async () =>
{

    const getComments = async ()=> {

        const url = '../data.json';
        const response = await fetch (url);
        const data = await response.json();
        return data;
    }

    commentsStringOld = await getComments();
    
    commentList (commentsStringOld);

    
    



   // const commentSection = new CommentSection(comments, "comments");
   // commentSection.drawCommentsSeccion();

    //console.log(comments);

}

function commentList (commentsString) {

    const Section = document.getElementById("comments");
    commentsString.comments.forEach(
    (comment) => {
    const newComment = new Comment (
        comment, Section
    );
    comments.push(newComment);

    newComment.DrawSection();
    });

}

///-----------------------------------

let commentsStringOld;
let comments = [];

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const Seccion = document.getElementById("actualizar");
const updateBotton =  document.createElement("button");
updateBotton.innerHTML = "actualizar";

updateBotton.addEventListener("click", (e)=>{

    const Section = document.getElementById("comments");

    console.log(comments);

    removeAllChildNodes(Section);

    comments.sort((a,b)=>{
        return b.score - a.score;
    });
    
    comments.forEach(
    (comment) => {
        comment.DrawSection();
    });

});

Seccion.appendChild(updateBotton);

main();




   









