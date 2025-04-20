export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    // Validate token format (basic validation)
    if (!token || typeof token !== 'string' || !token.trim()) {
      return res.status(400).json({ message: 'Invalid token format' });
    }

    // Validate token with Discord API
    const response = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: token
      }
    });

    if (!response.ok) {
      // Token is invalid
      return res.status(401).json({ message: 'Invalid Discord token' });
    }

    // Get user data
    const userData = await response.json();

    // Return success with user data
    return res.status(200).json({
      success: true,
      user: {
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator,
        avatar: userData.avatar,
        email: userData.email
      }
    });
  } catch (error) {
    console.error('Token login error:', error);
    return res.status(500).json({ message: 'An error occurred during authentication' });
  }
} 