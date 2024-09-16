import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom';
import router from './Routing.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
        <RouterProvider router={router} />
  </StrictMode>,
)
