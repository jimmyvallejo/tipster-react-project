import { baseUrl } from "../services/baseUrl"
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { get } from "../services/authService";
import Comment from "../components/Comments";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom"
import { useContext } from "react";
import { LoadingContext } from "../context/loading.context";
import { Link } from "react-router-dom";

const TipDetail = () => {
    
  const { authUser } = useContext(LoadingContext);

const [tip, setTip] = useState("")

    const { id } = useParams();

    const getTip = () => {
      
    axios.get(`${baseUrl}/tips/tip-detail/${id}`)
        .then((response) => {
          setTip(response.data)
          console.log("Tip:",response.data)
        })
        .catch((err) => {
          console.log(err)
        })
      }

   
    
      useEffect(() => {
        getTip(id);
      }, []);
    


      const createdAt = tip.createdAt;
      const createdDate = new Date(createdAt);
      const currentDate = new Date();
      const timeDiff = currentDate.getTime() - createdDate.getTime();
      const hoursAgo = Math.round(timeDiff / 3600000);
    


      return (
        <div>
        <div id="tipdetail">
        <img src={tip.ownerpicture}></img>
          <h1>{tip.owner}</h1>
          <p className="timeDate">{hoursAgo}h</p>
          <p>{tip.text}</p>
          <p className="category">Category: {tip.category}</p> 
          {authUser?.username === tip.owner && <div><Link>Delete</Link> <Link>Edit</Link></div>  }
        </div>
        
        
        <h3>Comments:</h3>
        <div className="countries-container">
        {tip.comments && tip.comments.length > 0 ? (
                  <>
                    {tip.comments.map((comment) => {
                      return (
                        <Comment key={comment._id} comment={comment}  />
                      );
                    })}
                  </>
                ) : (
                  <h4 className="noTips">No tips found</h4>
                )}
              </div>
        </div>
            )
        }
        
        export default TipDetail