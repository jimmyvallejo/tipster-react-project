import React from 'react';
import { Link } from 'react-router-dom';
import { LoadingContext } from '../context/loading.context';
import { useContext } from 'react';

const Comment = ({ comment }) => {
    
    
    const { authUser } = useContext(LoadingContext);
    
    const createdAt = comment.createdAt;
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - createdDate.getTime();
    const hoursAgo = Math.round(timeDiff / 3600000);
  

  return (
    <div className="tipContainer">
      <div className="tipbox" key={comment._id}>
        <div className="tipImgName">
          <p className="tipOwner">{comment.owner}</p>
          <p className="timeDate">{hoursAgo}h</p>
        </div>
        <Link className="tipLink" to={`/tips/tip-detail/${comment.tipId}`}>
          <p className="tipText">{comment.text}</p>
        </Link>
        <div className="tipExtras"></div>
        {authUser?.username === comment.owner && <div><Link>Delete</Link> <Link>Edit</Link></div>  }
      </div>
    </div>
  );
};

export default Comment;