import React, { useCallback, useState, useEffect } from 'react'

import styles from './App.module.css'
import posts from '../top.json'

function App() {
  const selectedPost = posts.data.children[0]

  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarVisible((s) => !s)
  }, [])

  // Reset sidebar toggle when resizing viewport
  useEffect(() => {
    if (!window.matchMedia) return
    const mql = window.matchMedia('(max-width: 800px)')
    const handler = (ev: MediaQueryListEvent) => {
      if (ev.matches) setIsSidebarVisible(false)
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.sidebarToggle}
        onClick={handleSidebarToggle}
      >
        {isSidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
      </button>
      <nav
        className={`${styles.sidebar} ${
          isSidebarVisible ? styles.isSidebarVisible : styles.isSidebarHidden
        }`}
      >
        <h1 className={styles.sidebarTitle}>Reddit Posts</h1>
        <ul className={styles.postsList}>
          {posts.data.children.map((post) => (
            <li key={post.data.id}>
              <button
                aria-current={post.data.id === selectedPost.data.id}
                className={styles.postsListItem}
                type="button"
              >
                <p>Author: {post.data.author}</p>
                <p>
                  Created: <time>{post.data.created}</time>
                </p>
                {post.data.thumbnail && (
                  <img src={post.data.thumbnail} alt="" />
                )}
                <p>{post.data.title}</p>
                <p>ID: {post.data.id}</p>
                <p>Comments: {post.data.num_comments}</p>
                <p>URL: {post.data.url}</p>
                <p>Clicked: {post.data.clicked ? 'Yes' : 'No'}</p>
                <p>Visited: {post.data.visited ? 'Yes' : 'No'}</p>
                <p>Visited: {post.data.visited ? 'Yes' : 'No'}</p>
              </button>
            </li>
          ))}
        </ul>
        <button className={styles.dismissAllBtn} type="button">
          Dismiss All
        </button>
      </nav>
      <main className={styles.main}>
        <article>
          <h1>{selectedPost.data.author}</h1>
          <p>
            Created: <time>{selectedPost.data.created}</time>
          </p>
          {selectedPost.data.thumbnail && (
            <img src={selectedPost.data.thumbnail} alt="" />
          )}
          <p>{selectedPost.data.title}</p>
          <a
            target="_blank"
            href={selectedPost.data.url}
            rel="noreferrer noopener"
          >
            {selectedPost.data.url}
          </a>
        </article>
      </main>
    </div>
  )
}

export default App
