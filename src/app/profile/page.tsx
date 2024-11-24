// src/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const router = useRouter();
  const userId = 'user_id_here'; // Defina o ID do usuário logado
  const receiverId = 'receiver_user_id_here'; // Defina o ID do destinatário

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${userId}`);
        const data = await res.json();
        setUser(data);
        setProfilePicture(data.profilePicture);

        const postsRes = await fetch(`/api/posts/${userId}`);
        const postsData = await postsRes.json();
        setPosts(postsData);

        const messagesRes = await fetch(`/api/chat/${userId}/${receiverId}`);
        const messagesData = await messagesRes.json();
        setMessages(messagesData);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      }
    };

    fetchProfile();
  }, [userId, receiverId]);

  const handleProfilePictureChange = async () => {
    try {
      const res = await fetch(`/api/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profilePicture }),
      });

      if (res.ok) {
        alert('Foto de perfil atualizada com sucesso!');
      } else {
        alert('Erro ao atualizar a foto de perfil.');
      }
    } catch (error) {
      console.error('Erro ao atualizar a foto de perfil:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: userId,
          receiverId,
          content: message,
        }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages([...messages, newMessage]);
        setMessage('');
      } else {
        alert('Erro ao enviar a mensagem.');
      }
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-3xl space-y-4">
        <h2 className="text-2xl font-bold text-center">Perfil</h2>
        <div className="flex flex-col items-center">
          <img
            src={profilePicture || '/default-profile.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto"
          />
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            placeholder="URL da foto de perfil"
          />
          <button
            onClick={handleProfilePictureChange}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
          >
            Atualizar Foto de Perfil
          </button>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold">Feed</h3>
          {posts.map((post) => (
            <div key={post._id} className="p-4 border-b">
              <p>{post.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold">Chat</h3>
          <div className="h-64 overflow-y-scroll border border-gray-300 p-2 mb-2 bg-white rounded">
            {messages.map((msg) => (
              <div key={msg._id} className="p-2 border-b">
                <strong>{msg.senderId}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Digite sua mensagem"
          />
          <button
            onClick={handleSendMessage}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
          >
            Enviar Mensagem
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
