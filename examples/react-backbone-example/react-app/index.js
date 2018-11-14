import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import SettlementForm from './components/settlement-form'
import SettlementFormConnector from './connectors/settlement-form'
import Store from './store'

const container = document.getElementById('react-app')

const App = () => (
    <Provider store={Store}>
      <SettlementFormConnector/>
    </Provider>
  )
  
  render(<App />, container)


