import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './request.css';
import { useNavigate } from 'react-router-dom';

function MyRequests(props){

    const [quests,setQuests]=useState([]);
    const navigate=useNavigate();
    
    
    useEffect(() => {
        console.log(process.env.REACT_APP_BACKEND_URL);
        const s = io(process.env.REACT_APP_BACKEND_URL, {
          transports: ["websocket"],
          cors: {
            origin: process.env.REACT_APP_FRONTEND_URL,
          },
        }); 

        const searchRequests= ()=>{
            const data = {
                'emailid':props.email 
              };
              s.emit('user_requests', data);
        }
    
    
        const waitForMessage = () => {
    
          return new Promise((resolve) => {
            s.on('user_request_data', (data) => {
              
                console.log(data['quests']);
                setQuests(data['quests']);
                resolve(data['quests']);
              
            });
          });
        };
    
        const fetchData = async () => {
          try {
            searchRequests();
            const data = await waitForMessage();
            // setSearchClicked(false);
            
          } catch (error) {
            console.error('Error while waiting for message from WebSocket:', error);
          }
        };
    
        s.on('connect', () => {
          console.log('Connected to backend via WebSocket');
          // setIsConnected(true)
        });
        
          fetchData();
    
      
        return () => {
          s.disconnect();
        };
    
        }, []);

    return(
      <div>
        { (props.formStatus===true && props.manager===false)?(
        <div className="requests-container">
            {quests.length > 0 ? (
            <h2>Requests</h2>
     
      
            ):(
            <h2>No Pending Requests</h2>
            )}
               { quests.map((quest) => (
                    <div className="request-card">
                        <p>Quest ID: {quest.questId}</p>
                        <p>Manager Email ID : {quest.emailID}</p>
                        <p>Start Date : {quest.startDate}</p>
                        <p>Status : {quest.status}</p>
                    </div>

                )
                )

                
            }
        </div>
        ):
        <div>
        {alert("Only Users can see there requests")}
        {navigate("/")}
        </div>
      }
        </div>
    )


}

export default MyRequests;