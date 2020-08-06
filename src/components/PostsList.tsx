import React, { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'

import { useSelector, useDispatch } from '../reducer'
import LoadingIndicator from './LoadingIndicator'
import { PostName } from '../types'
import * as utils from '../utils'
import ListItem from './ListItem'
import styles from './PostsList.module.css'

function PostsList({ toggleSidebar }: Props) {
  const dispatch = useDispatch()
  const selectedPost = useSelector((s) => s.selectedPost)
  const oldestPost = useSelector((s) => s.oldestPost)
  const readPosts = useSelector((s) => s.readPosts)
  const posts = useSelector((s) => s.posts)

  const [isLoadingNewer, setIsLoadingNewer] = useState(false)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)

  /**
   * Load posts on first render
   */
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

  /**
   * Each time `readPosts` updates, we call `persisReadPosts()` to save it in
   * the browser's LocalStorage.
   */
  useEffect(() => {
    if (readPosts) utils.persistReadPosts(readPosts)
  }, [readPosts])

  const handleSelectPost = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      toggleSidebar(false)
      dispatch({
        type: 'post selected',
        payload: ev.currentTarget.dataset.postname as PostName,
      })
    },
    [toggleSidebar, dispatch]
  )

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

  return (
    <>
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
                  numComments={post.numComments}
                  isSelected={post.name === selectedPost?.name}
                  onDismiss={handleDismissPost}
                  thumbnail={post.thumbnail}
                  createdAt={post.createdAt}
                  onSelect={handleSelectPost}
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
    </>
  )
}

const PostsListPropTypes = {
  toggleSidebar: PropTypes.func.isRequired,
}

PostsList.propTypes = PostsListPropTypes

type Props = PropTypes.InferProps<typeof PostsListPropTypes>

export default React.memo(PostsList)
