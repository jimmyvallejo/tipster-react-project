import { Link } from "react-router-dom"
import { useContext } from "react"
import { LoadingContext } from "../context/loading.context"
import { AuthContext } from "../context/auth.context"
import Tip from "./tip"

const Navbar = ({handleDimNav}) => {

    const getToken = () => {
        return localStorage.getItem("authToken")
    }

    const { authUser, getTips, setComment} = useContext(LoadingContext)

    const { logout } = useContext(AuthContext)
   
    

    return (
        <nav className="nav">
            <div className="nav-links">
                <span className="logo"><img className="logoimg" src="https://cdn-icons-png.flaticon.com/512/9215/9215053.png"></img>ipster</span>
                <Link to={'/'}><img id="homeimg" src="https://cdn-icons-png.flaticon.com/512/25/25694.png"></img><span id="home">Home</span></Link>
                <Link id="premiumlink" to={'/premium'}><img id ="premiumimg" src="https://cdn-icons-png.flaticon.com/512/4148/4148878.png"></img> Premium</Link>
                {
                    getToken() ? 
                    <>
                        {authUser && <Link to={`/users/profile/${authUser.username}`}><img id="profileimg" src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"></img>Profile</Link>}
                        <Link className="postlink" to={'/'} onClick={handleDimNav}><img id="postimg" src="https://cdn-icons-png.flaticon.com/512/3573/3573196.png"></img> Post</Link>
                        <button onClick={logout}>Logout</button>
                    </>
                    : 
                    <>
                        <Link to={'/signup'}>Signup</Link>
                        <Link to={'/login'} >Login</Link>
                    </>
                }
            </div>
        </nav>
    )
}

export default Navbar