import { useState, useEffect } from "react";
import axios from "axios";

interface Message {
  sender: {
    username: string;
  };
  content: string;
}

interface ChatProps {
  userId: string;  
}

const Chat: React.FC<ChatProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]); 
  const [content, setContent] = useState<string>(""); 

  useEffect(() => {
    axios.get<Message[]>(`http://localhost:5000/api/messages/${userId}`)
      .then((response) => {
        setMessages(response.data); 
      })
      .catch(err => console.error("Erro ao buscar mensagens", err));
  }, [userId]);

  const handleSendMessage = () => {
    axios.post<Message>("http://localhost:5000/api/messages", {
      senderId: userId,
      receiverId: "exampleReceiverId",
      content,
    }).then((response) => { 
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setContent("");
    }).catch(err => console.error("Erro ao enviar mensagem", err));
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p><strong>{msg.sender.username}: </strong>{msg.content}</p>
          </div>
        ))}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Digite uma mensagem..."
      />
      <button onClick={handleSendMessage}>Enviar</button>
    </div>
  );
};

export default Chat;
