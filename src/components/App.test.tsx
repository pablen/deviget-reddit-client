import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import React from 'react'

import { State, Action } from '../types'
import reducer from '../reducer'
import App from './App'

/**
 * Very basic test for demostration purposes.
 * I rely more in end-to-end tests (see `/cypress` folder) as explained in the README.
 */
test('renders basic layout', () => {
  const store = createStore<State, Action, undefined, undefined>(reducer)
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  )
  expect(getByText(/Reddit Posts/i)).toBeInTheDocument()
})
