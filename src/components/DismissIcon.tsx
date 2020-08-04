import React from 'react'

function DismissIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" width={12}>
      <circle
        strokeWidth={10}
        stroke="currentColor"
        fill="transparent"
        cx={50}
        cy={50}
        r={45}
      />
      <rect
        transform="rotate(45, 50, 50)"
        height="10"
        width="60"
        fill="currentColor"
        rx="10"
        id="line"
        x="20"
        y="45"
      />
      <use href="#line" transform="rotate(90, 50, 50)" />
    </svg>
  )
}

export default React.memo(DismissIcon)
