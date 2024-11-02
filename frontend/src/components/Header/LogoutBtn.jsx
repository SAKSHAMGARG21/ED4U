import { useDispatch } from "react-redux";
import conf from "../../conf/conf.js";
import {logout as authLogout} from "../../features/auth/authSilce.js"
import { useNavigate} from "react-router-dom";
import axios from "axios";
function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate  = useNavigate();
    const handleLogout = async () => {
        try {
            const res = await axios.post(`${conf.bkurl}/users/logout`);
            if (res){
                dispatch(authLogout(res));
                navigate("/login");
            }
        } catch (error) {
            console.log("Error during Logout ->>>",error);
        }
    }
    return (
        <button
            className="inline-block px-6 py-2 bg-purple-600 duration-200 hover:bg-[#8741c9] rounded-full"
            onClick={handleLogout}>
            Logout
        </button>
    );
}

export default LogoutBtn;