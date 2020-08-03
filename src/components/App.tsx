import React, { useCallback, useState, useEffect } from 'react'

import { useSelector, useDispatch, PostName, getPostsData } from '../reducer'
import styles from './App.module.css'

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const [isLoadingNewer, setIsLoadingNewer] = useState(false)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarVisible((s) => !s)
  }, [])

  const selectedPost = useSelector((s) => s.selectedPost)
  const posts = useSelector((s) => s.posts)
  const oldestPost = useSelector((s) => s.oldestPost)
  const readPosts = useSelector((s) => s.readPosts)
  const dispatch = useDispatch()

  const handleSelectPost = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      dispatch({
        type: 'post selected',
        payload: ev.currentTarget.dataset.postname as PostName,
      })
    },
    [dispatch]
  )

  const handleDismissPost = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      ev.stopPropagation()
      dispatch({
        type: 'post dismissed',
        payload: ev.currentTarget.dataset.postname as PostName,
      })
    },
    [dispatch]
  )

  const handleDismissAll = useCallback(() => {
    dispatch({ type: 'all posts dismissed' })
  }, [dispatch])

  const fetchPosts = useCallback(
    (after?: string) =>
      fetch(
        'https://www.reddit.com/top.json' + (after ? `?after=${after}` : '')
      )
        .then((res) => res.json())
        .catch((err) => {
          console.warn('There was a problem fetching posts', err.message)
        }),
    []
  )

  useEffect(() => {
    setIsLoadingNewer(true)
    fetchPosts()
      .then(({ data }) => {
        dispatch({
          type: 'newer posts received',
          payload: {
            posts: getPostsData(data.children),
            after: data.after,
          },
        })
      })
      .finally(() => setIsLoadingNewer(false))
  }, [dispatch, fetchPosts])

  const handleLoadOlderPosts = useCallback(() => {
    setIsLoadingOlder(true)
    fetchPosts(oldestPost)
      .then(({ data }) => {
        dispatch({
          type: 'older posts received',
          payload: {
            posts: getPostsData(data.children),
            after: data.after,
          },
        })
      })
      .finally(() => setIsLoadingOlder(false))
  }, [oldestPost, dispatch, fetchPosts])

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
        className={styles.sidebarToggle}
        onClick={handleSidebarToggle}
        type="button"
      >
        {isSidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
      </button>
      <nav
        className={`${styles.sidebar} ${
          isSidebarVisible ? styles.isSidebarVisible : styles.isSidebarHidden
        }`}
      >
        <h1 className={styles.sidebarTitle}>Reddit Posts</h1>
        <div className={styles.scrollContainer}>
          {isLoadingNewer && <p>Loading posts...</p>}
          <ul className={styles.postsList}>
            {posts.map((post) => (
              <li key={post.name}>
                <button
                  data-postname={post.name}
                  aria-current={post.name === selectedPost?.name}
                  className={styles.postsListItem}
                  onClick={handleSelectPost}
                  type="button"
                >
                  <p>Author: {post.author}</p>
                  <p>
                    Created: <time>{post.created}</time>
                  </p>
                  {post.thumbnail && <img src={post.thumbnail} alt="" />}
                  <p>{post.title}</p>
                  <p>name: {post.name}</p>
                  <p>Comments: {post.num_comments}</p>
                  <p>Read: {readPosts[post.name] ? 'Yes' : 'No'}</p>
                </button>
                <button
                  data-postname={post.name}
                  onClick={handleDismissPost}
                  type="button"
                >
                  Dismiss
                </button>
              </li>
            ))}
          </ul>
          {!isLoadingNewer && (
            <button
              className={styles.loadOlderBtn}
              disabled={!oldestPost}
              onClick={handleLoadOlderPosts}
              type="button"
            >
              {!oldestPost
                ? 'No More Posts'
                : isLoadingOlder
                ? 'Loading...'
                : 'Load More'}
            </button>
          )}
        </div>
        <button
          className={styles.dismissAllBtn}
          onClick={handleDismissAll}
          type="button"
        >
          Dismiss All
        </button>
      </nav>
      <main className={styles.main}>
        {selectedPost && (
          <article>
            <h1>{selectedPost.author}</h1>
            <p>
              Created: <time>{selectedPost.created}</time>
            </p>
            {selectedPost.thumbnail && (
              <img src={selectedPost.thumbnail} alt="" />
            )}
            <p>{selectedPost.title}</p>
            <a
              target="_blank"
              href={selectedPost.url}
              rel="noreferrer noopener"
            >
              {selectedPost.url}
            </a>
          </article>
        )}
      </main>
    </div>
  )
}

export default App
