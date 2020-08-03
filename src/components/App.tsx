import React, { useCallback, useState, useEffect } from 'react'

import { useSelector, useDispatch, PostName, getPostsData } from '../reducer'
import SidebarToggle from './SidebarToggle'
import PostDetail from './PostDetail'
import ListItem from './ListItem'
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
      setIsSidebarVisible(false)
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
      <SidebarToggle
        isSidebarVisible={isSidebarVisible}
        onToggle={handleSidebarToggle}
      />
      <nav
        className={`${styles.sidebar} ${
          isSidebarVisible ? styles.isSidebarVisible : styles.isSidebarHidden
        }`}
      >
        <h1 className={styles.sidebarTitle}>Reddit Posts</h1>
        <div className={styles.scrollContainer}>
          {isLoadingNewer && (
            <p className={styles.loadingMsg}>Loading posts...</p>
          )}
          <ul className={styles.postsList}>
            {posts.map((post) => (
              <li key={post.name}>
                <ListItem
                  numComments={post.num_comments}
                  isSelected={post.name === selectedPost?.name}
                  onDismiss={handleDismissPost}
                  thumbnail={post.thumbnail}
                  onSelect={handleSelectPost}
                  created={post.created}
                  isRead={!!readPosts[post.name]}
                  author={post.author}
                  title={post.title}
                  name={post.name}
                />
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
          <PostDetail
            numComments={selectedPost.num_comments}
            thumbnail={selectedPost.thumbnail}
            created={selectedPost.created}
            author={selectedPost.author}
            title={selectedPost.title}
            url={selectedPost.url}
          />
        )}
      </main>
    </div>
  )
}

export default App
