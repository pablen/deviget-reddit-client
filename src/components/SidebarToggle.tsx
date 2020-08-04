import PropTypes from 'prop-types'
import React from 'react'

import styles from './SidebarToggle.module.css'

function SidebarToggle(props: Props) {
  return (
    <button
      aria-label={props.isSidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
      className={styles.container}
      onClick={props.onToggle}
      type="button"
    >
      <svg
        aria-hidden="true"
        className={props.isSidebarVisible ? styles.icon : styles.iconRotated}
        viewBox="0 0 100 100"
        height={26}
        width={26}
      >
        <polyline
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth={15}
          transform="translate(10), rotate(45 50 50)"
          points="30,30 30,70 70,70"
          stroke="currentColor"
          fill="none"
        />
      </svg>
    </button>
  )
}

const SidebarTogglePropTypes = {
  isSidebarVisible: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

SidebarToggle.propTypes = SidebarTogglePropTypes

type Props = PropTypes.InferProps<typeof SidebarTogglePropTypes>

export default React.memo(SidebarToggle)
