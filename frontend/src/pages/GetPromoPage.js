import './GetPromoPage.css'
import {useNavigate} from "react-router-dom";

function GetPromoPage() {
    const navigate = useNavigate();

    return (
        <div className="GetPromoPage">
            <h1>Test Your Knowledge, Learn While Having Fun!</h1>
            <h3>Are you ready to challenge yourself with our ultimate quiz app?</h3>
            <h4>- Hundreds of questions across various categories</h4>
            <h4>- Special quizzes by difficulty level</h4>
            <h4>- Daily challenges and exciting rewards</h4>
            <h4>- Compete with friends and climb the leaderboard!</h4>
            <h3>Discover your true knowledge, learn new things, and enjoy the journey.To solve our newest quiz please <button onClick={()=>navigate("/SignUp")}>SignUp or Login.</button></h3>
            <button onClick={()=>navigate("/SignUp")} className={"GetPromoBtn"}>SignUp / Login</button>
        </div>
    )
}

export default GetPromoPage;