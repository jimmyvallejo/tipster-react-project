import React from 'react';
import { Link } from 'react-router-dom';
import { LoadingContext } from '../context/loading.context';
import { useContext } from 'react';
import { get } from '../services/authService';

const Comment = ({ comment, setComments}) => {
    
    
    const { authUser } = useContext(LoadingContext);
    
    const createdAt = comment.createdAt;
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - createdDate.getTime();
    const hoursAgo = Math.round(timeDiff / 3600000);
  


    const handleDelete = () => {
        get(`/tips/comment/delete/${comment._id}`)
          .then(() => {
            console.log("Comment deleted");
            // Remove the deleted comment from the state
            setComments(prevComments => prevComments.filter(c => c._id !== comment._id));
          })
          .catch((err) => {
            console.log(err);
          });
      };


  

  
  return (
    <div className="tipContainer">
      <div className="tipbox" key={comment._id}>
        <div className="commentimgbox">
          <img className="profilepic" src={comment.ownerpicture}></img>
        </div>
        <div className="tipImgName">
          <p className="tipOwner">{comment.owner}</p>
          <p className="timeDate">{hoursAgo}h</p>
        </div>
        <Link className="tipLink" to={`/tips/tip-detail/${comment.tipId}`}>
          <p className="tipText">{comment.text}</p>
        </Link>
        <div className="tipExtras"></div>
        {authUser?.username === comment.owner && (
          <div className="commentChange">
            
            <Link className='edit delete' onClick={handleDelete}>Delete</Link>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;