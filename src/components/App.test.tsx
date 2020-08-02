import { render } from '@testing-library/react'
import React from 'react'

import App from './App'

test('renders basic layout', () => {
  const { getByText } = render(<App />)
  expect(getByText(/Reddit Posts/i)).toBeInTheDocument()
})