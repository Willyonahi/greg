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
  return {
    Authorization: token,
    'Content-Type': 'application/json',
  };
};

export const getCurrentUser = async (token = getToken()) => {
  try {
    const response = await axios.get(`${DISCORD_API}/users/@me`, {
      headers: getHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw new Error('Failed to fetch user data from Discord');
  }
};

export const getUserGuilds = async (token = getToken()) => {
  try {
    const response = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
      headers: getHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Discord guilds:', error);
    throw new Error('Failed to fetch guild data from Discord');
  }
};

export const getGuildChannels = async (guildId, token = getToken()) => {
  try {
    const response = await axios.get(`${DISCORD_API}/guilds/${guildId}/channels`, {
      headers: getHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch guild channels:', error);
    throw new Error('Failed to fetch channel data from Discord');
  }
};

export const getChannelMessages = async (channelId, limit = 50, token = getToken()) => {
  try {
    const response = await axios.get(`${DISCORD_API}/channels/${channelId}/messages?limit=${limit}`, {
      headers: getHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch channel messages:', error);
    throw new Error('Failed to fetch message data from Discord');
  }
};

export const sendMessage = async (channelId, content, token = getToken()) => {
  try {
    const response = await axios.post(
      `${DISCORD_API}/channels/${channelId}/messages`,
      { content },
      {
        headers: getHeaders(token),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw new Error('Failed to send message to Discord');
  }
};

// Voice connection utilities
export const getVoiceRegions = async (token = getToken()) => {
  try {
    const response = await axios.get(`${DISCORD_API}/voice/regions`, {
      headers: getHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch voice regions:', error);
    throw new Error('Failed to fetch voice region data from Discord');
  }
};

export const joinVoiceChannel = async (guildId, channelId, userId, token = getToken()) => {
  try {
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
    console.error('Failed to join voice channel:', error);
    throw new Error('Failed to join voice channel in Discord');
  }
}; 