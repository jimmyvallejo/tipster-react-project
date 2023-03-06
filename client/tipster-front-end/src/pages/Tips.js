import { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { LoadingContext } from "../context/loading.context"
import Tip from "../components/tip"

const Tips = ({ dimBackground }) => {

    const { tips, getTips, findTip} = useContext(LoadingContext)




    useEffect(() => {
        if (!tips) {
            getTips()
        }
    }, [])

    return (
        <div >


            <div className="countries-container" >


                {tips ? 
                    <>

                {tips.map((tip) => {
                return (
                    <Tip key={tip._id} tip={tip} />
                );
                })} 

                    </>

                    : <h4>Loading...</h4>
                }

            </div>
        </div>
    )
}

export default Tips