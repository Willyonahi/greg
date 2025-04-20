import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Error() {
  const router = useRouter();
  const { error } = router.query;

  const getErrorMessage = () => {
    switch (error) {
      case 'Callback':
        return 'Failed to process authentication callback. Please try again.';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'OAuthSignin':
        return 'Error starting the OAuth sign-in flow. Please try again.';
      case 'OAuthCallback':
        return 'Error completing the OAuth sign-in flow. Please try again.';
      case 'OAuthCreateAccount':
        return 'Error creating your account. Please try again.';
      case 'OAuthAccountNotLinked':
        return 'Email already exists with a different provider.';
      case 'EmailCreateAccount':
        return 'Error creating your account. Please try again.';
      case 'SessionRequired':
        return 'You must be signed in to access this page.';
      default:
        return 'An unknown error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-discord-darker flex flex-col justify-center items-center p-4">
      <Head>
        <title>Error | Discord Web Client</title>
        <meta name="description" content="Authentication error" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-md w-full bg-discord-dark rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="mx-auto h-16 w-16 text-discord-red" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <h1 className="text-2xl font-bold text-white mt-4">Authentication Error</h1>
        </div>

        <div className="bg-discord-red bg-opacity-20 border border-discord-red rounded-md p-4 mb-6">
          <p className="text-white">{getErrorMessage()}</p>
        </div>

        <div className="flex justify-center">
          <Link href="/login" className="discord-button">
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
} 