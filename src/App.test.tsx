import { render } from '@testing-library/react'
import React from 'react'

import App from './App'

test('renders dummy app', () => {
  const { getByText } = render(<App />)
  const linkElement = getByText(/foobar/i)
  expect(linkElement).toBeInTheDocument()
})
