"use strict";

import { CommentDOM, ReplyDOM,  ReplyThreadDOM } from './CommentDOM.js';


class ProtoComment {

    constructor(id, content,createdAt, user, score){
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.user = user;
        this.score = score;
        this.hasVoted = false;
    }

   
}

class Reply extends ProtoComment {
    constructor(reply, commentParentId){
        super(reply.id, reply.content, reply.createdAt, reply.user, reply.score);
        this.replyingTo = reply.replyingTo;
        this.commentParentId = commentParentId;
        this.replyDOM = new ReplyDOM(reply,commentParentId);
       // console.log(commentParentId);
    }

    upVote(){
        if(!this.hasVoted){
            this.score ++;
            const scoreNumElement = this.replyDOM.getScoreNumELement.scoreNum;
            scoreNumElement.innerHTML = this.score;
            this.hasVoted = true;
        }
    }

}

class ReplySection {

    constructor(repliesString, commentParentId){
        this.parent = parent;
        this.commentParentId = commentParentId;
        this.replies = [];
        this.replyThreadDOM = {};
        this.initializeSection(repliesString);
    }
/*
    eventHandler(e){

            if(e.target.matches("button")||e.target.parentElement.matches("button"))
            {
                let targetElement = e.target;
                if( e.target.parentElement.matches("button") ){
                    targetElement = e.target.parentElement;
                }
                console.log(targetElement);
                const type = targetElement.dataset.type;
    
                const replyInteraction = new CustomEvent(
                    'replyInteraction', 
                    {
                        detail: {
                            type:"plus"
                        }
                    }
                );
    
                document.dispatchEvent(replyInteraction);
    
                switch(type)
                {
                    case "plus":
                     //   this.upVote(targetElement)
                    break;
                    default:
                    //    console.log(type);
                    break;
                }
                
                
            }
            
       }*/

     initializeSection(repliesString)
    { 
        repliesString.forEach(
        (reply) => {
            
            const newReply = new Reply (
                reply, this.commentParentId

            );
            this.replies.push(newReply);
           
        });
        this.drawSection();
    }

    drawSection(){
    
        this.replies.sort((a,b)=>{
            return b.score - a.score;
        });

        this.replyThreadDOM =  new ReplyThreadDOM(this.replies);

           /* this.replyThreadDOM.threadDOM.addEventListener("click", (e)=>{
                e.stopPropagation();
                //this.eventHandler(e);
            });*/
       
        

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

    voteReply(idReply){
        console.log(`voteReply ${idReply}`);
        const selectedElement = this.replies.find( reply => reply.id == idReply );
        selectedElement.upVote();
    }

}

class Comment extends ProtoComment {

    constructor(commentIn){
        super(commentIn.id, commentIn.content, commentIn.createdAt, commentIn.user, commentIn.score);
        this.replySection = {};
        this.initializeReplySection(commentIn.replies,commentIn.id);
        this.commentDOM = new CommentDOM(commentIn);
        this.drawComment();
        
    }

    upVote(){
        if(!this.hasVoted){
            this.score ++;
            console.log(`upVote ${this.score}`);
            const scoreNumElement = this.commentDOM.getScoreNumELement.scoreNum;
            scoreNumElement.innerHTML = this.score;
            this.hasVoted = true;
        }
    }

/*
   eventHandler(e){

        if(e.target.matches("button")||e.target.parentElement.matches("button"))
        {
            let targetElement = e.target;
            if( e.target.parentElement.matches("button") ){
                targetElement = e.target.parentElement;
            }

            console.log(targetElement);

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
                   // this.upVote(targetElement)
                break;
                default:
                   // console.log(type);
                break;
            }
            
            
        }
        
   }

   upVote(element){
       this.score ++;
       const scoreNumElement = this.commentDOM.getScoreNumELement;
      // console.log(this);
       scoreNumElement.innerHTML = this.score;
   }*/

    

   initializeReplySection(repliesIn,commentId)
    { 
       
        this.replySection = new ReplySection(repliesIn,commentId);
    }

   drawComment(){
       
        this.commentDOM.appendReplyThread(this.replySection.replyThreadDOM.threadDOM);
       /* this.commentDOM.sectionDOM.addEventListener("click", (e)=>{
            this.eventHandler(e);
        });*/

    }

}


class CommentSection {

    constructor(commentsString, parent){
        this.parent = parent;
        this.comments = [];
        this.initializeSection(commentsString);
    }

    eventHandler(e){
        
        if(e.target.matches("button")||e.target.parentElement.matches("button"))
        {
            let targetElement = e.target;
            if( e.target.parentElement.matches("button") ){
                targetElement = e.target.parentElement;
            }

            const type = targetElement.dataset.type;
            const id = targetElement.dataset.id;
            const parentId = targetElement.dataset.parentId;
            

            switch(type)
            {
                case "upVote":
                    this.upVote(id,parentId)
                break;
                case "downVote":
                    this.upVote(id,parentId)
                break;
                default:
                   // console.log(type);
                break;
            }
            
        }
        
   }

   upVote(id,parentId){

    let selectedElement = {};

        if(parentId){
           const selectedParend = this.comments.find( comment => comment.id == parentId );
           selectedElement = selectedParend.replySection;
           selectedElement.voteReply(id);
        }else{
            selectedElement = this.comments.find( comment => comment.id == id );
            selectedElement.upVote();
        }

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
    
            parent.addEventListener("click", (e)=>{
                this.eventHandler(e);
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




   









