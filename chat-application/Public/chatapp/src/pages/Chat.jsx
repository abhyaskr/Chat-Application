import React,{useState,useEffect,useRef} from 'react';
import Contacts from "../components/Contacts"
import styled from "styled-components";
import axios  from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUserRoute,host } from '../utils/APIRoutes';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat , setCurrentChat] = useState(undefined);
  const [isLoaded , setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem("chat-app-user")) {
          navigate("/login");
        } else {
          setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.isAvatarImageSet) {
      const fetchContacts = async () => {
        try {
          const response = await axios.get(`${allUserRoute}/${currentUser._id}`);
          setContacts(response.data);
          console.log("fetch contact")
        } catch (error) {
          console.error("Error fetching contacts data", error);
        }
      };

      fetchContacts();
    } else if (currentUser) {
      navigate("/setAvatar");
    }
  }, [currentUser, navigate]);

  const handleChatChange = (chat)=>{
        setCurrentChat(chat);
  }

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat = {handleChatChange}/>
          {  isLoaded &&
            currentChat === undefined ? (<Welcome currentUser = {currentUser}/>) :(
              <ChatContainer currentChat = {currentChat} currentUser = {currentUser} socket = {socket}/>
            )
          }
          
        </div>
      </Container>
    </>
  );
}


const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: rgba(0, 0, 0, 0.42);
    display: grid;
    grid-template-columns: 100%; /* Default: Full width for small screens */

    @media screen and (min-width: 720px) {
      grid-template-columns: 25% 75%; /* 25% - 75% for screens wider than 720px */
    }
  }
`;



export default Chat