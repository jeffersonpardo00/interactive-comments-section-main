"use strict";

import { CommentDOM, ReplyDOM,  ReplyThreadDOM, ReplyInputDOM } from './CommentDOM.js';

let  currentUser = {};
/*
class ReplyInput {
    constructor(inId,inParentId,inUserName){
        this.InputDOM = {};
        this.content = "";
        
        this.ParentId = inParentId;
        this.ParentUserName = inUserName;
        this.textAreaId = `replyTo_${inUserName}_${inParentId}`;
        this.initializeReplyInput();
    }

    initializeReplyInput(){
        this.InputDOM = new ReplyInputDOM(this.ParentId, this.ParentUserName, this.textAreaId);
        this.content = "Texto escrito por el usuario";
    }

}
*/
class ProtoComment {

    constructor(InProtoComment){
        this.id = InProtoComment.id;
        this.content = InProtoComment.content;
        this.createdAt = InProtoComment.createdAt;
        this.user = InProtoComment.user;
        this.score = InProtoComment.score;
        this.thisDOM = {};
        this.hasVoted = false;
        this.thisMainDOM = {};
        this.replyInput = {};
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

    deleteReplyInput(){
        this.replyInput.sectionDOM.remove();
        this.replyInput = null;
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
    }

    initializeReply(InReply,commentParentId){
        this.thisDOM = new ReplyDOM(InReply,commentParentId);
        this.thisMainDOM = this.thisDOM.sectionDOM;
    }

    reply(){
        this.replyInput = new ReplyInputDOM(this.id,this.commentParentId,this.user.username);
        const replyInputDOM = this.replyInput.sectionDOM;
        this.thisMainDOM.after(replyInputDOM);
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
        this.thisMainDOM = this.thisDOM.getcommentArticleDOM;
        this.thisDOM.appendReplyThread(this.replySection.replyThreadDOM.threadDOM);
    }

    reply(){
        this.replyInput = new ReplyInputDOM(this.id,this.id,this.user.username);
        const replyInputDOM = this.replyInput.sectionDOM;
        this.thisMainDOM.after(replyInputDOM);
    }

    sendReply (parentId, parentUserName, textAreaId)
    {
        this.replySection.addEditableReply(parentId, parentUserName, textAreaId);
       
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
        selectedElement.reply();
    }

   addEditableReply(parentId, parentUserName, textAreaId){
      
        /*var ids = this.thisList.map(function(num) {
            return Math.sqrt(num);
        });*/

        const newContent = document.getElementById(textAreaId);

        const editableReplyObj =
        {
            id: 3,
            content : newContent,
            createdAt : "today",
            score: 0,
            replyingTo: parentUserName,
            user: currentUser
        };

        const editableReply = new Reply (
            editableReplyObj, parentId

        );

        console.log(editableReply);
   }

   deleteReplyInputFrom(id)
    {
        const selectedElement = this.findInList(id);
        selectedElement.deleteReplyInput();

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
                    this.reply(id,parentId)
                break;
                case "sendReply":
                    const textAreaId = targetElement.dataset.textAreaId;
                    const parentUserName = targetElement.dataset.parentUserName;
                    this.sendReply(id,parentId,parentUserName,textAreaId);
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

   reply(id,parentId){

    let selectedElement = {};

        if(parentId){
        const selectedParend = this.findInList(parentId);
        selectedElement = selectedParend.replySection;
        selectedElement.replyReply(id);
        }else{
            selectedElement =  this.findInList(id);
            selectedElement.reply();
        }

   }


   sendReply(id,parentId, parentUserName, textAreaId){

        const  selectedComment =  this.findInList(parentId);
        selectedComment.sendReply(parentId,parentUserName, textAreaId);

        if(id!==parentId)
        {
            const selectedParend = this.findInList(parentId);
            const selectedReplySection = selectedParend.replySection;
            selectedReplySection.deleteReplyInputFrom(id);
        }else{
            selectedComment.deleteReplyInput();
        }


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

    let Initialcomments = await getComments();
    const sectionDOM = document.getElementById("comments");

   
    currentUser = Initialcomments.currentUser;
    const commentSection = new CommentSection(Initialcomments,sectionDOM);
    //commentSection.drawSection.apply(this);
    commentSection.drawSection();

    

}


main();




   









