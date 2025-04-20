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
  const [error, setError] = useState('');
  const [channelLoading, setChannelLoading] = useState(false);

  // Check authentication and redirect if needed
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        console.log('Not authenticated, redirecting to login');
        router.push('/login');
        return;
      }

      try {
        console.log('Fetching user data...');
        // Fetch user data
        const userData = await getCurrentUser();
        console.log('User data received:', userData);
        setUser(userData);
        
        // Fetch servers/guilds
        console.log('Fetching guilds...');
        const guilds = await getUserGuilds();
        console.log('Guilds received:', guilds.length);
        setServers(guilds.map(guild => ({
          id: guild.id,
          name: guild.name,
          icon: guild.icon 
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` 
            : guild.name.charAt(0)
        })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load Discord data. Your token may be invalid.');
        // If there's an error (like invalid token), redirect to login after a delay
        setTimeout(() => {
          localStorage.removeItem('discord_token');
          router.push('/login');
        }, 3000);
      }
    };

    checkAuth();
  }, [router]);

  // Load channels when server is selected
  useEffect(() => {
    const loadChannels = async () => {
      if (!activeServer) return;
      
      setChannelLoading(true);
      setError('');
      
      try {
        console.log('Loading channels for server:', activeServer);
        const channelsData = await getGuildChannels(activeServer);
        console.log('Channels received:', channelsData.length);
        
        // Only process if we still care about this server (user might have clicked another)
        if (activeServer) {
          setChannels(channelsData.filter(channel => 
            channel.type === 0 || channel.type === 2
          ).map(channel => ({
            id: channel.id,
            name: channel.name,
            type: channel.type === 0 ? 'text' : 'voice'
          })));
        }
      } catch (error) {
        console.error('Error loading channels:', error);
        setError(`Failed to load channels: ${error.message}`);
        // Don't logout on channel fetch error - just show the error
      } finally {
        setChannelLoading(false);
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
        console.log('Loading messages for channel:', activeChannel);
        const messagesData = await getChannelMessages(activeChannel);
        console.log('Messages received:', messagesData.length);
        setMessages(messagesData.map(msg => ({
          id: msg.id,
          author: msg.author.username,
          content: msg.content || '[Empty message or attachment]',
          timestamp: msg.timestamp
        })));
      } catch (error) {
        console.error('Error loading messages:', error);
        setError('Failed to load messages');
        // Don't logout on message fetch error
      }
    };
    
    loadMessages();
  }, [activeChannel, channels]);

  const handleServerClick = (serverId) => {
    console.log('Server clicked:', serverId);
    setActiveServer(serverId);
    setActiveChannel(null);
    setChannels([]);
    setMessages([]);
  };

  const handleChannelClick = (channelId) => {
    setActiveChannel(channelId);
    setMessages([]);
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
      setError('Failed to send message');
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

  // Show error state
  if (error && !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-discord-dark">
        <div className="bg-discord-red bg-opacity-20 border border-discord-red rounded-md p-5 max-w-md">
          <h2 className="text-white text-xl mb-2">Error</h2>
          <p className="text-white">{error}</p>
          <p className="text-white mt-3">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-discord-darker overflow-hidden">
      <Head>
        <title>Discord Web Client</title>
        <meta name="description" content="A web client for Discord" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Error message toast */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-discord-red bg-opacity-90 text-white px-4 py-2 rounded-md shadow-lg">
          {error}
          <button 
            className="ml-3 font-bold"
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      )}

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
            {channelLoading ? (
              <div className="text-center py-4 text-discord-light">Loading channels...</div>
            ) : (
              <>
                <div className="mb-2">
                  <h3 className="text-xs uppercase font-semibold text-gray-400 px-2 mt-4 mb-1">Text Channels</h3>
                  {channels.filter(c => c.type === 'text').length === 0 ? (
                    <div className="px-2 text-sm text-gray-500">No text channels available</div>
                  ) : (
                    channels.filter(c => c.type === 'text').map(channel => (
                      <div 
                        key={channel.id}
                        className={`channel ${activeChannel === channel.id ? 'active' : ''}`}
                        onClick={() => handleChannelClick(channel.id)}
                      >
                        <span className="mr-1">#</span>
                        {channel.name}
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mb-2">
                  <h3 className="text-xs uppercase font-semibold text-gray-400 px-2 mt-4 mb-1">Voice Channels</h3>
                  {channels.filter(c => c.type === 'voice').length === 0 ? (
                    <div className="px-2 text-sm text-gray-500">No voice channels available</div>
                  ) : (
                    channels.filter(c => c.type === 'voice').map(channel => (
                      <div 
                        key={channel.id}
                        className={`channel ${activeChannel === channel.id ? 'active' : ''}`}
                        onClick={() => handleChannelClick(channel.id)}
                      >
                        <span className="mr-1">🔊</span>
                        {channel.name}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
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
              {messages.length === 0 ? (
                <div className="text-center py-12 text-discord-light">
                  {channels.find(c => c.id === activeChannel)?.type === 'text' 
                    ? 'No messages yet. Be the first to send a message!' 
                    : 'This is a voice channel. Join to talk with others.'}
                </div>
              ) : (
                messages.map(message => (
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
                ))
              )}
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