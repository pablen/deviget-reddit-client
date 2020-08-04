import React, { useCallback, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { useSelector, useDispatch } from '../reducer'
import LoadingIndicator from './LoadingIndicator'
import SidebarToggle from './SidebarToggle'
import { PostName } from '../types'
import PostDetail from './PostDetail'
import * as utils from '../utils'
import ListItem from './ListItem'
import styles from './App.module.css'

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const [isLoadingNewer, setIsLoadingNewer] = useState(false)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarVisible((s) => !s)
  }, [])

  const dispatch = useDispatch()
  const selectedPost = useSelector((s) => s.selectedPost)
  const oldestPost = useSelector((s) => s.oldestPost)
  const readPosts = useSelector((s) => s.readPosts)
  const posts = useSelector((s) => s.posts)

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

  useEffect(() => {
    utils.persistReadPosts(readPosts)
  }, [readPosts])

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

  useEffect(() => {
    setIsLoadingNewer(true)
    utils
      .fetchPosts()
      .then(({ data }) => {
        dispatch({
          type: 'newer posts received',
          payload: {
            posts: data.children.map(utils.extractPostData),
            after: data.after,
          },
        })
      })
      .finally(() => setIsLoadingNewer(false))
  }, [dispatch])

  const handleLoadOlderPosts = useCallback(() => {
    setIsLoadingOlder(true)
    utils
      .fetchPosts(oldestPost)
      .then(({ data }) => {
        dispatch({
          type: 'older posts received',
          payload: {
            posts: data.children.map(utils.extractPostData),
            after: data.after,
          },
        })
      })
      .finally(() => setIsLoadingOlder(false))
  }, [oldestPost, dispatch])

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
            <div className={styles.loadingMsg}>
              <LoadingIndicator />
              Loading posts
            </div>
          )}
          <ul className={styles.postsList}>
            <AnimatePresence>
              {posts.map((post) => (
                <motion.li
                  animate={{ opacity: 1, maxHeight: 400 }}
                  initial={{ opacity: 0, maxHeight: 0 }}
                  exit={{ opacity: 0, maxHeight: 0, overflow: 'hidden' }}
                  key={post.name}
                >
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
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {!isLoadingNewer && (
            <button
              className={styles.loadOlderBtn}
              disabled={!oldestPost}
              onClick={handleLoadOlderPosts}
              type="button"
            >
              {!oldestPost ? (
                'No More Posts'
              ) : isLoadingOlder ? (
                <>
                  <LoadingIndicator /> Loading...
                </>
              ) : (
                'Load More'
              )}
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
            fullSizePicture={selectedPost.fullSizePicture}
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
