import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  return (
    <>
      <div className="card">
        <h1>This is Ed4u Website Project in  Vite + React </h1>
        <div className="databox flex flex-col-reverse justify-center items-center ">
          <div>
            {
              data.map((element) => {
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
    </>
  )
}

export default App
