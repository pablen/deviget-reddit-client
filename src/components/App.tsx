import React, { useCallback, useState, useEffect } from 'react'

import SidebarToggle from './SidebarToggle'
import PostDetail from './PostDetail'
import PostsList from './PostsList'
import styles from './App.module.css'

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

  const handleSidebarToggle = useCallback((newState?: boolean) => {
    setIsSidebarVisible((prevState) =>
      typeof newState === 'boolean' ? newState : !prevState
    )
  }, [])

  /**
   * Reset sidebar toggle when resizing viewport.
   * This is needed because we always want to begin with a collapsed sidebar
   * when switching to a narrow viewport, even if it was previously expanded.
   */
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
        className={
          isSidebarVisible ? styles.visibleSidebar : styles.hiddenSidebar
        }
      >
        <h1 className={styles.sidebarTitle}>Reddit Posts</h1>
        <PostsList toggleSidebar={handleSidebarToggle} />
      </nav>
      <main className={styles.main}>
        <PostDetail />
      </main>
    </div>
  )
}

export default App
