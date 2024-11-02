import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './app/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthLayout, Footer, Header, Login } from './components/index.js'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard.jsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element:
          (
            <div>
              <Header />
              <Home />
              <Footer />
            </div>
          )
      },
      {
        path: "/login",
        element: (
          <Login />
        ),
      },
      {
        path: "/signup",
        element: (
            <Signup />
        ),
      },
      {
        path: "/dashboard",
        element: (
          <AuthLayout>
            <Dashboard />
          </AuthLayout>
        ),
      }
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)