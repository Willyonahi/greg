import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function Article() {
  const router = useRouter()
  const { id } = router.query
  const [article, setArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    // In a real app, fetch the article from an API/database
    // This is mock data for demonstration
    const articleData = {
      1: {
        id: 1,
        title: 'Welcome to the News Site',
        content: 'This is your first news article. It contains all the important details about getting started with your news site.\n\nYou can post articles, edit them, and share them with the world.',
        date: '2023-06-01'
      },
      2: {
        id: 2,
        title: 'Getting Started with Next.js',
        content: 'Next.js is a React framework for building full-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations.\n\nInside your project, you\'ll see the following folders and files:\n\n- `/pages`: Contains all your page components\n- `/public`: Stores static assets like images\n- `/styles`: Contains your CSS files',
        date: '2023-06-02'
      }
    }

    // Simulate API fetch
    setTimeout(() => {
      if (articleData[id]) {
        setArticle(articleData[id])
      } else {
        router.push('/404')
      }
      setIsLoading(false)
    }, 500)
  }, [id, router])

  if (isLoading) {
    return (
      <div className="container">
        <p>Loading article...</p>
      </div>
    )
  }

  if (!article) return null

  return (
    <div className="container">
      <Head>
        <title>{article.title} | News Website</title>
        <meta name="description" content={article.content.substring(0, 160)} />
      </Head>

      <header className="header">
        <h1>News Website</h1>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/create-article">Create Article</Link>
        </nav>
      </header>

      <main className="main">
        <article className="article-full">
          <div className="article-meta">
            <span>{article.date}</span>
          </div>
          <h1>{article.title}</h1>
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
        
        <div className="article-actions">
          <Link href="/" className="back-button">← Back to Articles</Link>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} News Website</p>
      </footer>

      <style jsx>{`
        .article-full {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .article-full h1 {
          margin-bottom: 1rem;
          color: #0070f3;
        }
        
        .article-full p {
          margin-bottom: 1.5rem;
        }
        
        .article-actions {
          margin-top: 2rem;
        }
        
        .back-button {
          display: inline-block;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  )
} 