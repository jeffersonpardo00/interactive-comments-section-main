"use strict";

import { CommentDOM, ReplyDOM,  ReplyThreadDOM } from './CommentDOM.js';


class ProtoComment {

    constructor(InProtoComment){
        this.id = InProtoComment.id;
        this.content = InProtoComment.content;
        this.createdAt = InProtoComment.createdAt;
        this.user = InProtoComment.user;
        this.score = InProtoComment.score;
        this.thisDOM = {};
        this.hasVoted = false;
    }

    voteActions(){
        const scoreNumElement = this.thisDOM.getScoreNumELement;
        scoreNumElement.scoreNum.innerHTML = this.score;
        scoreNumElement.upVote.classList.toggle("deactivateVote");
        scoreNumElement.downVote.classList.toggle("deactivateVote");
    }

    upVote(){
        if(!this.hasVoted){
            this.score ++;
            this.voteActions();
            this.hasVoted = true;
        }
    }

    downVote(){
        if(this.hasVoted){
            this.score --;
            this.voteActions();
            this.hasVoted = false;
        }
    }

   
}

class Reply extends ProtoComment {
    constructor(InReply, commentParentId){

        const InProtoComment = {
            id: InReply.id, 
            content: InReply.content, 
            createdAt: InReply.createdAt, 
            user: InReply.user, 
            score: InReply.score
         }

        super(InProtoComment);
        this.replyingTo = InReply.replyingTo;
        this.commentParentId = commentParentId;
        
        this.initializeReply(InReply,commentParentId);
       // console.log(commentParentId);
    }

    initializeReply(InReply,commentParentId){
        this.thisDOM = new ReplyDOM(InReply,commentParentId);
    }

    

}

class Comment extends ProtoComment {

    constructor(commentIn){
        const InProtoComment = {
           id: commentIn.id, 
           content: commentIn.content, 
           createdAt: commentIn.createdAt, 
           user: commentIn.user, 
           score: commentIn.score
        }
        super(InProtoComment);
        this.replySection = {};
        this.initializeReplySection(commentIn.replies,commentIn.id);
        this.initializeComment(InProtoComment);
        
    }

    
   initializeReplySection(repliesIn,commentId)
    { 
       
        this.replySection = new ReplySection(repliesIn,commentId);
    }

    initializeComment(InProtoComment){

        this.thisDOM = new CommentDOM(InProtoComment);
        this.thisDOM.appendReplyThread(this.replySection.replyThreadDOM.threadDOM);
    }

}

class ProtoSection {

    constructor(parent=null){
        this.parent = parent;
        this.thisList = [];
    }

    findInList(id){
        return this.thisList.find( comment => comment.id == id );
    }

    sortDesc(){
        this.thisList.sort((a,b)=>{
            return b.score - a.score;
        });
    }
    removeAllChildNodes() {
        while (this.parent.firstChild) {
            this.parent.removeChild(this.parent.firstChild);
        }
    }

}

class ReplySection extends ProtoSection {

    constructor(repliesString, commentParentId){
      //  this.parent = parent;
        super();
        this.commentParentId = commentParentId;
        this.replyThreadDOM = {};
        //this.parent = {};
        this.initializeSection(repliesString);
    }

     initializeSection(repliesString)
    { 
        repliesString.forEach(
        (reply) => {
            
            const newReply = new Reply (
                reply, this.commentParentId

            );
            this.thisList.push(newReply);
           
        });
        
        this.drawSection();
    }

    drawSection(){
    
        this.sortDesc();
        this.replyThreadDOM =  new ReplyThreadDOM(this.thisList);
        this.parent =  this.replyThreadDOM.parentThread;

    }

    upVoteReply(idReply){
        
        const selectedElement = this.findInList(idReply);
        selectedElement.upVote();
    }

    downVoteReply(idReply){
        
        const selectedElement = this.findInList(idReply);
        selectedElement.downVote();
    }

    replyReply(idReply)
    {
        const selectedElement = this.findInList(idReply);
        console.log('replyReply');
        console.log(selectedElement);
    }

}

class CommentSection extends ProtoSection {

    constructor(commentsString, parent){
        super(parent);
        //this.parent = parent;
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
                    this.downVote(id,parentId)
                break;
                case "reply":
                    this.replySelect(id,parentId)
                break;
                default:
                    alert("No se reconoce la accion que estas probando");
                break;
            }
            
        }
        
   }

   upVote(id,parentId){

    let selectedElement = {};

        if(parentId){
           const selectedParend = this.findInList(parentId);
           selectedElement = selectedParend.replySection;
           selectedElement.upVoteReply(id);
        }else{
            selectedElement =  this.findInList(id);
            selectedElement.upVote();
        }


   }

   downVote(id,parentId){

    let selectedElement = {};

        if(parentId){
           const selectedParend = this.findInList(parentId);
           selectedElement = selectedParend.replySection;
           selectedElement.downVoteReply(id);
        }else{
            selectedElement =  this.findInList(id);
            selectedElement.downVote();
        }


   }

   replySelect(id,parentId){

    let selectedElement = {};

    if(parentId){
       const selectedParend = this.findInList(parentId);
       selectedElement = selectedParend.replySection;
       selectedElement.replyReply(id);
    }else{
        selectedElement =  this.findInList(id);
        this.reply(selectedElement);
    }

   }

   reply(selectedElement)
   {
       console.log('replyComment');
       console.log(selectedElement);
   }


    initializeSection(commentsString)
    { 
        commentsString.comments.forEach(
        (comment) => {
            const newComment = new Comment (
                comment
            );
            this.thisList.push(newComment);
        });

        this.drawSection();
    
        parent.addEventListener("click", (e)=>{
            this.eventHandler(e);
        });
    }

    drawSection(){
    
        this.sortDesc();
        this.thisList.forEach(
            (comment) => {
                this.parent.appendChild(comment.thisDOM.sectionDOM);
            });

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




   









