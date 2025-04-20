import { useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [servers, setServers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [activeServer, setActiveServer] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Mock data for demonstration
  useEffect(() => {
    if (status === 'authenticated') {
      // In a real app, these would come from Discord API
      setServers([
        { id: '1', name: 'General Server', icon: 'G' },
        { id: '2', name: 'Gaming', icon: '🎮' },
        { id: '3', name: 'Study Group', icon: '📚' }
      ]);
    }
  }, [status]);

  // Load channels when server is selected
  useEffect(() => {
    if (activeServer) {
      // Mock data - would be API call in real app
      setChannels([
        { id: '1', name: 'general', type: 'text' },
        { id: '2', name: 'voice-chat', type: 'voice' },
        { id: '3', name: 'announcements', type: 'text' }
      ]);
    }
  }, [activeServer]);

  // Load messages when channel is selected
  useEffect(() => {
    if (activeChannel) {
      // Mock data - would be API call in real app
      setMessages([
        { id: '1', author: 'User1', content: 'Hello everyone!', timestamp: new Date().toISOString() },
        { id: '2', author: 'User2', content: 'Hey there! How are you?', timestamp: new Date().toISOString() },
        { id: '3', author: 'User3', content: 'I\'m working on a new project.', timestamp: new Date().toISOString() }
      ]);
    }
  }, [activeChannel]);

  const handleServerClick = (serverId) => {
    setActiveServer(serverId);
    setActiveChannel(null);
  };

  const handleChannelClick = (channelId) => {
    setActiveChannel(channelId);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // In a real app, would send to Discord API
    const newMessage = {
      id: Date.now().toString(),
      author: session.user.name,
      content: messageInput,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  // Show loading state
  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen bg-discord-dark">Loading...</div>;
  }

  // If not authenticated, show nothing (will redirect)
  if (status === 'unauthenticated') {
    return null;
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
            {server.icon}
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
            {session.user?.image && (
              <div className="w-8 h-8 rounded-full bg-gray-700 mr-2 overflow-hidden">
                <img 
                  src={session.user.image} 
                  alt={session.user.name || 'User'} 
                  width={32} 
                  height={32} 
                />
              </div>
            )}
            <div className="flex-1 truncate">
              <div className="text-white text-sm font-medium truncate">{session.user?.name || 'User'}</div>
              <div className="text-gray-400 text-xs truncate">{session.user?.email || ''}</div>
            </div>
            <button 
              onClick={() => signOut()}
              className="text-gray-400 hover:text-white p-1"
              title="Sign Out"
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
                <span className="mr-1">#</span>
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