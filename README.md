# Discord Web Client

A third-party Discord web client that allows you to connect to Discord and participate in text and voice channels.

## Features

- Discord OAuth2 authentication
- View servers and channels
- Send and receive messages
- Join voice calls
- Modern Discord-like UI using TailwindCSS

## Getting Started

### Prerequisites

- Node.js 14+ installed
- A Discord account
- Discord application credentials (Client ID and Client Secret)

### Setup

1. Clone this repository:

```bash
git clone <repository-url>
cd discord-web-client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following content:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-for-jwt

# Discord OAuth credentials
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
```

4. To get Discord credentials:
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to OAuth2 settings
   - Add `http://localhost:3000/api/auth/callback/discord` as a redirect URI
   - Copy the Client ID and Client Secret into your `.env.local` file

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Deploying to Render

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. In Render dashboard:
   - Go to "New Web Service"
   - Connect your repository
   - Configure the service:
     - Environment: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
     - Add the environment variables from your `.env.local` file
     - Set `NEXTAUTH_URL` to your Render URL (e.g., `https://your-app-name.onrender.com`)

3. Click "Create Web Service"

## Technical Details

- Built with Next.js
- Authentication with NextAuth.js
- Discord API integration
- TailwindCSS for styling
- WebRTC for voice chat functionality

## Limitations

This is a third-party client and may not support all Discord features. Use responsibly and in accordance with Discord's Terms of Service. 