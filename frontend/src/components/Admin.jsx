import { useState, useEffect } from 'react'
import axios from 'axios';
import conf from '../conf/conf';
import Container from './containers/Container';

function Admin() {
    const [data, setData] = useState([]);
    axios.defaults.withCredentials = true;
    const refreshToken = async () => {
        console.log("refreshToken called");
        const response = await axios.post(`${conf.bkurl}/users/refreshToken`);
        // console.log(response);
    };
    const getdata = async () => {
        try {
            const response = await axios.get(`${conf.bkurl}/users/allUsers`);
            setData(response.data.data);
        } catch (error) {
            console.log("No users found");
            console.error(error);
        }
    }

    useEffect(() => {
        getdata();
        const intervalId = setInterval(refreshToken, 1 * 60 * 1000); // Refresh token every 30 minutes
        console.log(intervalId);
        return () => clearInterval(intervalId);
    }, [])
    return (
        <>
            <Container>

                <div className="card">
                    <h1>This is Ed4u Website Project in  Vite + React </h1>
                    <div className="databox flex flex-col-reverse justify-center items-center ">
                        <div>
                            {
                                data?.map((element) => {
                                    return (
                                        <div className="bg-zinc-900 border-2 m-4" key={element._id} >
                                            <img src={element.avtar} alt="not found" width="100rem" height="100rem" />
                                            <hr />
                                            <img src={element.coverImage} alt="not found" width="500rem" height="200rem" />
                                            <hr />
                                            <div className="m-4">
                                                <h2>User Name : {element.userName}</h2>
                                                <hr />
                                                <p>Full Name : {element.fullName}</p>
                                                <hr />
                                                <p>Email : {element.email}</p>
                                                <ul>
                                                    <hr />
                                                    <h3>WatchHistory :</h3>
                                                    {
                                                        element.watchHistory?.map((ele) => {
                                                            return <li key={ele}>{ele}</li>;
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>

            </Container>
        </>
    )
}

export default Admin
