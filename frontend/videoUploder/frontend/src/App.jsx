import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import UploadForm from './components/UploadForm';
// import UploadsList from './components/UploadsList';
import VideoList from './components/VideoList';
import { MONGO_URI } from './config/constants';
import { ThreeDots } from "react-loader-spinner";
function App() {


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getVideoData = async () => {
    setLoading(true);
    const resposne = await axios.get(`${MONGO_URI}`);
    setTimeout(() => {
      setData(resposne.data);
      setLoading(false);
    }, 2000);
  }

  useEffect(() => {
    getVideoData();
  }, []);
  return (
    <>
      <div className="maincontainer">
        <h1>Media Player Project using Vite and React with Backend</h1>
        <div className="firstRow flex my-4">
          <div className="firstColumn max-w-[45%] bg-slate-900 ">
            <UploadForm></UploadForm>
          </div>

          <div className="secondColumn w-full bg-slate-950">
            {/* <UploadsList data={data}></UploadsList> */}
            <VideoList data={data}></VideoList>
          </div>
        </div>

        <div className="btnbox flex justify-end">
          {
            loading && <ThreeDots
              visible={true}
              height="40"
              width="50"
              color="rgb(116 138 234)"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          }
          <button onClick={getVideoData} className="p-2 mx-4 bg-blue-600 text-cyan-50 rounded-md hover:bg-blue-500">Refresh</button>
        </div>

      </div>
    </>
  )
}

export default App
