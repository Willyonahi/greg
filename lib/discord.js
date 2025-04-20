import axios from 'axios';

const DISCORD_API = 'https://discord.com/api/v10';

export const getDiscordUser = async (accessToken) => {
  try {
    const response = await axios.get(`${DISCORD_API}/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Discord user:', error);
    throw new Error('Failed to fetch user data from Discord');
  }
};

export const getUserGuilds = async (accessToken) => {
  try {
    const response = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Discord guilds:', error);
    throw new Error('Failed to fetch guild data from Discord');
  }
};

export const getGuildChannels = async (accessToken, guildId) => {
  try {
    const response = await axios.get(`${DISCORD_API}/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch guild channels:', error);
    throw new Error('Failed to fetch channel data from Discord');
  }
};

export const getChannelMessages = async (accessToken, channelId, limit = 50) => {
  try {
    const response = await axios.get(`${DISCORD_API}/channels/${channelId}/messages?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch channel messages:', error);
    throw new Error('Failed to fetch message data from Discord');
  }
};

export const sendMessage = async (accessToken, channelId, content) => {
  try {
    const response = await axios.post(
      `${DISCORD_API}/channels/${channelId}/messages`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw new Error('Failed to send message to Discord');
  }
};

// Voice connection utilities
export const getVoiceRegions = async (accessToken) => {
  try {
    const response = await axios.get(`${DISCORD_API}/voice/regions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch voice regions:', error);
    throw new Error('Failed to fetch voice region data from Discord');
  }
};

export const joinVoiceChannel = async (accessToken, guildId, channelId, userId) => {
  try {
    const response = await axios.patch(
      `${DISCORD_API}/guilds/${guildId}/members/${userId}`,
      {
        channel_id: channelId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to join voice channel:', error);
    throw new Error('Failed to join voice channel in Discord');
  }
}; 