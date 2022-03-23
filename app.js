import "./components/comments-section.js";

const main = async () =>
{
    const getComments = async ()=> {

        const url = './data.json';
        const response = await fetch (url);
        const data = await response.json();
        return data;
    }

    let Initialcomments = await getComments();

    const commentsSection = document.querySelector('comments-section');
   
    commentsSection.comments = Initialcomments.comments;
    commentsSection.currentUser = Initialcomments.currentUser;

    commentsSection.setAttribute("fetched","1");
}

main();