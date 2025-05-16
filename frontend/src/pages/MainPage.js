import GetPromoPage from "./GetPromoPage";
import HomePage from "./HomePage";
import {useNavigate} from "react-router-dom";

function MainPage() {
    const navigate = useNavigate();

    return sessionStorage.getItem("isAuthorised")==="true" ? (navigate("/Home")) : <GetPromoPage />
}

export default MainPage;