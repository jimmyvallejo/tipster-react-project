import { useState } from "react"
import { post } from "../services/authService"
import { Link, useNavigate } from "react-router-dom"
import { LoadingContext } from "../context/loading.context"
import { useContext, useEffect } from "react"


const Comment = ({commentOwner, commentKey, commentText, authUser, isBackgroundDimmed, setIsBackgroundDimmed}) => {
    
    const {comment, setComment, getTips} = useContext(LoadingContext)

    const navigate = useNavigate()

    const [ newComment, newSetComment] = useState(
        {
           picture: authUser.image,
           owner: authUser.username,
           text: "",
           likes: 0,
           id: commentKey
        }
    )

   
            const handleExit = () => {
                setIsBackgroundDimmed(false)
                setComment(null)
            }
  

    const handleChange = (e) => {
        newSetComment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        console.log("Changing Comment", newComment);
        console.log(authUser)
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        post('/tips/add-comment', newComment)
            .then((results) => {
                console.log("Comment", results.data)
                setIsBackgroundDimmed(false)
                setComment(null)
                
                navigate(`/`)
                window.location.reload() 
            })
            .catch((err) => {
                console.log(err)
            })
    } 

    return ( 
        <div className="commentContainer">
            <div className="commentbox" key={commentKey}>
                <div className="tipImgName">
                    <div className="tipImgBox"><img className="profilepic" src="https://cdn-icons-png.flaticon.com/512/702/702814.png" /></div>
                    <p className="commentOwner">{commentOwner}</p>
                    <h3 className="exitComment"><Link className="handleExit" onClick={handleExit}>Exit</Link></h3>
                </div>
                <p className="tipText">{commentText}</p>
                <p>Replying to @{commentOwner}</p>
                <div className="tipImgName">
                    <div className="tipImgBox"><img className="profilepic" src={authUser.image}/></div>
                    <form>
                        <input type='text' name="text" onChange={handleChange} value={newComment.text} placeholder="Sharing is caring!" />
                        <button onClick={handleSubmit} type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Comment