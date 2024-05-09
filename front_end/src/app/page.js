"use client"
import {useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import Head from 'next/head';
import Script from 'next/script';


function App() {
  const API_URL = "http://127.0.0.1:64550"

  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState("");
  const [allInteractions, setAllInteractions] = useState([])

  const retrieveAllInteractions = useCallback(async (api_url) => {
    await axios ({
      method: "GET",
      url: `${api_url}/assistant`,
    }).then(res => {
      console.log(res)
      console.log("data", res.data)
      setAllInteractions(res.data)
    })
  }, [])
  

  //post user query to the backend

  const handleSubmit = useCallback(async (e)=> {
    e.preventDefault()
    
    setIsThinking(!isThinking)

    
    if(input.trim() === ""){
      alert("Chat cannot be empty")
      setIsThinking(true)
      
    }else{

      await axios({
        method: "POST",
        url: `${API_URL}/assistant`,
        headers: {
          "Content-Type": "application/json"
        },
        data: input
      })
      .then((res) => {
          setInput("")
          setIsThinking(false)
          retrieveAllInteractions(API_URL)
          console.log("response from sending prompt", res)
      })      
    }

  })

 

  useEffect(() => {
    retrieveAllInteractions(API_URL)
   
    
  }, [])
  return (
    <div className="container">
        <Script src='./wing.js'></Script>
      <div className="header">
        <h1>My Assistant</h1>
        <p>Ask anything...</p>
      </div>

        <div className="chat-area">
          <div className="chat-area-content">

          
            {allInteractions.map((chat) =>{
                return(
                  <div key={chat.id} className="user-bot-chat">
                    
                    <p className='user-question'>Me: {chat.question}</p>
                    <p className='response'>Assistant: {chat.answer}</p>

    
                  </div>
                )
            })}

            <p className={isThinking ? "thinking" : "notThinking"}>Generating response...</p>
            
          </div>
          <div className="type-area">
            <input type="text" placeholder="Ask me any question" value={input} onChange={(e)=>setInput(e.target.value)}/>
            <button onClick={handleSubmit}>Send</button>
          </div>
        </div>
    </div>
  );
}

export default App;



