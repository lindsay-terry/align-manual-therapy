import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import Error from './endpoints/Error';
import Home from './endpoints/Home';
import Signup from './endpoints/Signup';
import Book from './endpoints/Book';
import Reviews from './endpoints/Reviews';
import Education from './endpoints/Education';
import Contact from './endpoints/Contact';
import Login from './endpoints/Login';
import UserProfile from './endpoints/UserProfile';
// Admin only components
import AdminCalendar from './endpoints/admin-endpoints/AdminCalendar';
import AdminContacts from './endpoints/admin-endpoints/AdminContacts';
import AdminServices from './endpoints/admin-endpoints/AdminServices';
import AdminUsers from './endpoints/admin-endpoints/AdminUsers';


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
                path: '/reviews',
                element: <Reviews />,
            },
            {
                path: '/education',
                element: <Education />,
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
            {
                path: '/profile',
                element: <UserProfile />,
            },
            //Admin only
            {
                path: '/view-calendar',
                element: <AdminCalendar />,
            },
            {
                path: '/view-users',
                element: <AdminUsers />,
            },
            {
                path: '/view-services',
                element: <AdminServices />,
            },
            {
                path: '/view-contacts',
                element: <AdminContacts />,
            }, 
        ],
    },
]);

export default router;