import { useState, createContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { get, post } from "../services/authService";
import axios from "axios";
import { baseUrl } from "../services/baseUrl";
import jwt_decode from 'jwt-decode'


const LoadingContext = createContext();





const LoadingProvider = ({ children }) => {


  

    const [isLoading, setIsLoading] = useState(false);
   

    const [authUser, setAuthUser] = useState("");

    const [originalTipsContext, setOriginalTipsContext] = useState("")
    const [filteredTipsContext, setFilteredTipsContext] = useState("")
    
   
    const [message, setMessage] = useState('');

    const [ tips, setTips ] = useState(null);
    const [ tip, setTip ] = useState(null);

    const [ posts, setPosts ] = useState([])
    const [ post, setPost ] = useState(null)

    const [comment, setComment] = useState(null)

    const setTimedMessage = (newMessage) => {
      setMessage(newMessage);
      setTimeout(() => {
        setMessage('')
      }, 4000)
    }

    const getTips = () => {
      axios.get(`${baseUrl}/tips/all-tips`)
      .then((response) => {
        setTips(response.data)
        console.log("Tips:",response.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }


    return (
        <LoadingContext.Provider value={{tips, tip, posts, post, isLoading, message, setPost, setPosts, setTips, setTip, setIsLoading, setMessage, setTimedMessage, getTips, authUser, setAuthUser, comment, setComment, setFilteredTipsContext, setOriginalTipsContext, originalTipsContext, filteredTipsContext}}>
          {children}
        </LoadingContext.Provider>
      );
}

export { LoadingContext, LoadingProvider }