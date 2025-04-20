import axios from 'axios';

const DISCORD_API = 'https://discord.com/api/v10';

// Helper to get the token from localStorage (client-side only)
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('discord_token');
  }
  return null;
};

// Helper to check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Common headers for Discord API requests
const getHeaders = (token = getToken()) => {
  if (!token) {
    console.error('No token available');
    throw new Error('Authentication required');
  }
  
  return {
    Authorization: token,
    'Content-Type': 'application/json',
  };
};

export const getCurrentUser = async (token = getToken()) => {
  try {
    console.log('Getting current user with token available:', !!token);
    const response = await axios.get(`${DISCORD_API}/users/@me`, {
      headers: getHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user data:', error.response?.status || error.message);
    throw new Error('Failed to fetch user data from Discord');
  }
};

export const getUserGuilds = async (token = getToken()) => {
  try {
    console.log('Getting user guilds with token available:', !!token);
    const response = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
      headers: getHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Discord guilds:', error.response?.status || error.message);
    throw new Error('Failed to fetch guild data from Discord');
  }
};

export const getGuildChannels = async (guildId, token = getToken()) => {
  try {
    if (!guildId) {
      throw new Error('Guild ID is required');
    }
    console.log('Getting guild channels for guild:', guildId);
    const response = await axios.get(`${DISCORD_API}/guilds/${guildId}/channels`, {
      headers: getHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch guild channels:', error.response?.status || error.message);
    throw new Error('Failed to fetch channel data from Discord');
  }
};

export const getChannelMessages = async (channelId, limit = 50, token = getToken()) => {
  try {
    if (!channelId) {
      throw new Error('Channel ID is required');
    }
    console.log('Getting channel messages for channel:', channelId);
    const response = await axios.get(`${DISCORD_API}/channels/${channelId}/messages?limit=${limit}`, {
      headers: getHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch channel messages:', error.response?.status || error.message);
    throw new Error('Failed to fetch message data from Discord');
  }
};

export const sendMessage = async (channelId, content, token = getToken()) => {
  try {
    if (!channelId) {
      throw new Error('Channel ID is required');
    }
    if (!content || !content.trim()) {
      throw new Error('Message content is required');
    }
    console.log('Sending message to channel:', channelId);
    const response = await axios.post(
      `${DISCORD_API}/channels/${channelId}/messages`,
      { content },
      {
        headers: getHeaders(token),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error.response?.status || error.message);
    throw new Error('Failed to send message to Discord');
  }
};

// Voice connection utilities
export const getVoiceRegions = async (token = getToken()) => {
  try {
    console.log('Getting voice regions');
    const response = await axios.get(`${DISCORD_API}/voice/regions`, {
      headers: getHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch voice regions:', error.response?.status || error.message);
    throw new Error('Failed to fetch voice region data from Discord');
  }
};

export const joinVoiceChannel = async (guildId, channelId, userId, token = getToken()) => {
  try {
    if (!guildId || !channelId || !userId) {
      throw new Error('Guild ID, Channel ID, and User ID are required');
    }
    console.log('Joining voice channel:', channelId);
    const response = await axios.patch(
      `${DISCORD_API}/guilds/${guildId}/members/${userId}`,
      {
        channel_id: channelId,
      },
      {
        headers: getHeaders(token),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to join voice channel:', error.response?.status || error.message);
    throw new Error('Failed to join voice channel in Discord');
  }
}; 