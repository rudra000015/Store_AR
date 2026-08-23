import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './app/App.jsx'
import { store } from './app/app.store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
