# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## How to Get Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set Application Type to "Web application"
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
   - `https://main.dc0hjry4e0uyb.amplifyapp.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret

## Generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

## Authorized User:
Only `michael@insideoptions.io` can access the dashboard.
