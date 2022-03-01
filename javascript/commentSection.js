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

    constructor(comment){
        super(comment.id, comment.content, comment.createdAt, comment.user, comment.score);
        this.replies = comment.replies;
       // this.section = section;
        this.commentDOM = new CommentDOM(comment);
        this.drawComment();
       
        
    }

   eventHandler(e){

        if(e.target.matches("button")||e.target.parentElement.matches("button"))
        {
            let targetElement = e.target;
            if( e.target.parentElement.matches("button") ){
                targetElement = e.target.parentElement;
            }

            const type = targetElement.dataset.type;

            const commentInteraction = new CustomEvent(
                'commentInteraction', 
                {
                    detail: {
                        type:"plus"
                    }
                }
            );

            document.dispatchEvent(commentInteraction);

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
       const scoreNumElement = this.commentDOM.getScoreNumELement;
       console.log(this);
       scoreNumElement.innerHTML = this.score;
   }

   drawComment = () => {

    this.commentDOM.sectionDOM.addEventListener("click", (e)=>{
        this.eventHandler(e);
    });

    
    }

}

class reply extends ProtoComment {
    constructor(comment){
        super(comment.id, comment.content, comment.createdAt, comment.user);
        this.replyingTo = comment.replyingTo;
    }
}

class CommentSection {

    constructor(commentsString, parent){
        this.parent = parent;
        this.comments = [];
        this.initializeSection(commentsString);
    }

     initializeSection(commentsString)
    { 
        commentsString.comments.forEach(
        (comment) => {
            const newComment = new Comment (
                comment
            );
            this.comments.push(newComment);
        });

        this.comments.forEach(
            (comment) => {
                this.parent.appendChild(comment.commentDOM.sectionDOM);
            });
    
            document.addEventListener("commentInteraction", (e)=>{
                if(e.detail.type === "plus"){
                  //  this.reDrawSection();
                }
            });
    }

    drawSection(){
    
        this.comments.sort((a,b)=>{
            return b.score - a.score;
        });

        this.comments.forEach(
            (comment) => {
                this.parent.appendChild(comment.commentDOM.sectionDOM);
            });

    }

    removeAllChildNodes() {
        while (this.parent.firstChild) {
            this.parent.removeChild(this.parent.firstChild);
        }
    }

    reDrawSection(){
        this.removeAllChildNodes();
        this.drawSection();
        
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

    let commentsStringOld = await getComments();
    const sectionDOM = document.getElementById("comments");

   // console.log(commentsStringOld);
    const commentSection = new CommentSection(commentsStringOld,sectionDOM);
    //commentSection.drawSection.apply(this);
    commentSection.drawSection();

    

}


main();




   









