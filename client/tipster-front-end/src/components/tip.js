import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { LoadingContext } from "../context/loading.context";
import axios from "axios";
import { baseUrl } from "../services/baseUrl";

const Tip = ({ tip, dimBackground }) => {
  const { comment, setComment, authUser } = useContext(LoadingContext);
  const [newLike, setNewLike] = useState({ userId: authUser?._id, tipId: tip._id });

  function handleClick() {
    dimBackground(true);
    setComment(tip);
  }

  const createdAt = tip.createdAt;
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - createdDate.getTime();
  const hoursAgo = Math.round(timeDiff / 3600000);

  const addLike = () => {
    axios.post(`${baseUrl}/tips/add-like`, newLike).then((results) => {
      console.log("like++", results.data);
      window.location.reload();
    });
  };
   

    return (
      
      
      <div className="tipContainer">
      
      <div className="tipbox" key={tip._id}>
        <div className="tipImgName">
        <div className="tipImgBox"><img className="profilepic" src={tip.ownerpicture}></img></div>
        <p className="tipOwner">{tip.owner}</p>
        <p className="timeDate">{hoursAgo}h</p>
        </div>
        
        <Link className="tipLink" to={`/tips/tip-detail/${tip._id}`}> <p className="tipText">{tip.text}</p></Link>
        
        <div className="tipExtras">
        <p className="category">Category: {tip.category}</p>
        <div>
        <Link className ="likes" onClick={addLike}><p><img class="heart" src="https://cdn-icons-png.flaticon.com/512/833/833472.png"></img><span>{tip.likes.length}</span></p></Link>
        {authUser ? <Link className="link" onClick={handleClick}><p><img class="heart" src="https://cdn-icons-png.flaticon.com/512/3193/3193015.png"></img><span>{tip.comments.length}</span></p></Link> 
        : <Link className="link" to={"/login"}><p><img class="heart" src="https://cdn-icons-png.flaticon.com/512/3193/3193015.png"></img><span>{tip.comments.length}</span></p></Link>
         }
        </div>
        </div>
      </div>
      </div>
      
    );
  };
  
  export default Tip;