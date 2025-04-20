import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, getUserGuilds, getGuildChannels, getChannelMessages, sendMessage } from '../lib/discord';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [servers, setServers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [activeServer, setActiveServer] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  // Check authentication and redirect if needed
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        // Fetch user data
        const userData = await getCurrentUser();
        setUser(userData);
        
        // Fetch servers/guilds
        const guilds = await getUserGuilds();
        setServers(guilds.map(guild => ({
          id: guild.id,
          name: guild.name,
          icon: guild.icon 
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` 
            : guild.name.charAt(0)
        })));
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If there's an error (like invalid token), redirect to login
        localStorage.removeItem('discord_token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Load channels when server is selected
  useEffect(() => {
    const loadChannels = async () => {
      if (!activeServer) return;
      
      try {
        const channelsData = await getGuildChannels(activeServer);
        setChannels(channelsData.filter(channel => 
          channel.type === 0 || channel.type === 2
        ).map(channel => ({
          id: channel.id,
          name: channel.name,
          type: channel.type === 0 ? 'text' : 'voice'
        })));
      } catch (error) {
        console.error('Error loading channels:', error);
      }
    };
    
    loadChannels();
  }, [activeServer]);

  // Load messages when channel is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeChannel) return;
      
      const selectedChannel = channels.find(c => c.id === activeChannel);
      // Only load messages for text channels
      if (!selectedChannel || selectedChannel.type !== 'text') return;
      
      try {
        const messagesData = await getChannelMessages(activeChannel);
        setMessages(messagesData.map(msg => ({
          id: msg.id,
          author: msg.author.username,
          content: msg.content,
          timestamp: msg.timestamp
        })));
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };
    
    loadMessages();
  }, [activeChannel, channels]);

  const handleServerClick = (serverId) => {
    setActiveServer(serverId);
    setActiveChannel(null);
  };

  const handleChannelClick = (channelId) => {
    setActiveChannel(channelId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChannel) return;

    try {
      const message = await sendMessage(activeChannel, messageInput);
      setMessages(prev => [...prev, {
        id: message.id,
        author: user.username,
        content: message.content,
        timestamp: message.timestamp
      }]);
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('discord_token');
    router.push('/login');
  };

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-discord-dark">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-discord-darker overflow-hidden">
      <Head>
        <title>Discord Web Client</title>
        <meta name="description" content="A web client for Discord" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Server sidebar */}
      <div className="w-[72px] bg-discord-black p-3 flex flex-col items-center gap-2 overflow-y-auto">
        {servers.map(server => (
          <div 
            key={server.id}
            className={`server-icon ${activeServer === server.id ? 'bg-discord-blurple rounded-2xl' : ''}`}
            onClick={() => handleServerClick(server.id)}
            title={server.name}
          >
            {typeof server.icon === 'string' && server.icon.startsWith('http') 
              ? <img src={server.icon} alt={server.name} className="w-full h-full rounded-full object-cover" />
              : server.name.charAt(0)
            }
          </div>
        ))}
      </div>

      {/* Channels sidebar */}
      {activeServer && (
        <div className="w-60 bg-discord-dark flex flex-col">
          <div className="p-4 border-b border-gray-800 shadow-sm">
            <h2 className="font-bold text-white truncate">
              {servers.find(s => s.id === activeServer)?.name || 'Server'}
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <div className="mb-2">
              <h3 className="text-xs uppercase font-semibold text-gray-400 px-2 mt-4 mb-1">Text Channels</h3>
              {channels.filter(c => c.type === 'text').map(channel => (
                <div 
                  key={channel.id}
                  className={`channel ${activeChannel === channel.id ? 'active' : ''}`}
                  onClick={() => handleChannelClick(channel.id)}
                >
                  <span className="mr-1">#</span>
                  {channel.name}
                </div>
              ))}
            </div>
            
            <div className="mb-2">
              <h3 className="text-xs uppercase font-semibold text-gray-400 px-2 mt-4 mb-1">Voice Channels</h3>
              {channels.filter(c => c.type === 'voice').map(channel => (
                <div 
                  key={channel.id}
                  className={`channel ${activeChannel === channel.id ? 'active' : ''}`}
                  onClick={() => handleChannelClick(channel.id)}
                >
                  <span className="mr-1">🔊</span>
                  {channel.name}
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-2 bg-discord-darker flex items-center">
            {user && (
              <div className="w-8 h-8 rounded-full bg-gray-700 mr-2 overflow-hidden">
                {user.avatar ? (
                  <img 
                    src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
                    alt={user.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                    {user.username.charAt(0)}
                  </div>
                )}
              </div>
            )}
            <div className="flex-1 truncate">
              <div className="text-white text-sm font-medium truncate">{user?.username || 'User'}</div>
              <div className="text-gray-400 text-xs truncate">{user?.discriminator ? `#${user.discriminator}` : ''}</div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-white p-1"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-discord-dark">
        {activeChannel ? (
          <>
            <div className="p-4 border-b border-gray-800 shadow-sm">
              <h3 className="font-bold text-white flex items-center">
                <span className="mr-1">{channels.find(c => c.id === activeChannel)?.type === 'text' ? '#' : '🔊'}</span>
                {channels.find(c => c.id === activeChannel)?.name || 'channel'}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div key={message.id} className="message">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-discord-darker flex items-center justify-center text-white font-semibold">
                    {message.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-baseline">
                      <span className="font-semibold text-white mr-2">{message.author}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-discord-light">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {channels.find(c => c.id === activeChannel)?.type === 'text' && (
              <div className="p-4 border-t border-gray-800">
                <form onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className="chat-input"
                    placeholder={`Message #${channels.find(c => c.id === activeChannel)?.name || 'channel'}`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-discord-light">
            {activeServer ? 'Select a channel to start chatting' : 'Select a server to get started'}
          </div>
        )}
      </div>
    </div>
  );
} 