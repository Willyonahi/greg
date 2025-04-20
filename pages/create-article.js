import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function CreateArticle() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // In a real app, you would send this data to an API/database
    console.log('Article submitted:', formData)
    
    // For demonstration, just go back to the homepage
    alert('Article created successfully!')
    router.push('/')
  }
  
  return (
    <div className="container">
      <Head>
        <title>Create New Article | News Website</title>
        <meta name="description" content="Create a new article for the news website" />
      </Head>
      
      <header className="header">
        <h1>News Website</h1>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/create-article">Create Article</Link>
        </nav>
      </header>
      
      <main className="main">
        <h2>Create New Article</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <button type="submit">Publish Article</button>
        </form>
      </main>
      
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} News Website</p>
      </footer>
    </div>
  )
} 