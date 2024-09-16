import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import Error from './endpoints/Error';
import Home from './endpoints/Home';
import Signup from './endpoints/Signup';
import Book from './endpoints/Book';
import GiftCertificates from './endpoints/GiftCertificates';
import Reviews from './endpoints/Reviews';
import Education from './endpoints/Education';
import Blog from './endpoints/Blog';
import Contact from './endpoints/Contact';
import Login from './endpoints/Login';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: '/book-massage',
                element: <Book />,
            },
            {
                path: '/gift-certificates',
                element: <GiftCertificates />,
            },
            {
                path: '/reviews',
                element: <Reviews />,
            },
            {
                path: '/education',
                element: <Education />,
            },
            {
                path: '/blog',
                element: <Blog />,
            },
            {
                path: '/contact',
                element: <Contact />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/signup',
                element: <Signup />,
            },
        ],
    },
]);

export default router;