import { useContext, useState } from "react"
import { LoadingContext } from "../context/loading.context"
import { post } from "../services/authService";
import { useNavigate } from "react-router-dom";


const AddTip = () => {
    
    const { authUser } = useContext(LoadingContext);
    
    const {comment, setComment, getTips} = useContext(LoadingContext)

    const navigate = useNavigate()

    const [ newTip, newSetTip] = useState(
        {
         
           owner: authUser.username,
           text: "",
           category: "Food",
           ownerId: authUser._id,
           ownerpicture: authUser.image
           
        }
    )

  

    const handleChange = (e) => {
        const { name, value } = e.target;
        newSetTip((prev) => ({ ...prev, [name]: value }));
        console.log("Changing Tip", newTip);
        console.log(authUser)
      };

    const handleSubmit = (e) => {
        e.preventDefault()

        post('/tips/add-tip', newTip)
            .then((results) => {
                console.log("Comment", results.data)
                
                navigate(`/`)
                window.location.reload() 
            })
            .catch((err) => {
                console.log(err)
            })
    } 
    
    return (
        <div className="tipImgName tipForm">
            <div className="tipImgBox"><img className="profilepic" src={authUser.image} /></div>
            <form>
                <input className="commentInput" type='text' name="text" onChange={handleChange} value={newTip.text} placeholder="Sharing is caring!" />
                
                <label id="label" for="category">Category: </label>
                <select id="category" name="category" onChange={handleChange} value={newTip.category}>
                <option value="Food">Food</option>
                <option value="Traffic">Traffic</option>
                <option value="Entertainment">Entertainment</option>
                </select>

                <button className ="addButton" onClick={handleSubmit} type="submit">Submit</button>
                
            </form>
        </div>
    );
};
    
export default AddTip;