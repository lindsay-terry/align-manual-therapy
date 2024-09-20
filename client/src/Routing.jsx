import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import Error from './endpoints/Error';
import Home from './endpoints/Home';
import Signup from './endpoints/Signup';
import Book from './endpoints/Book';
import GiftCertificates from './endpoints/GiftCertificates';
import Reviews from './endpoints/Reviews';
import Education from './endpoints/Education';
import Contact from './endpoints/Contact';
import Login from './endpoints/Login';
// Admin only components
import AdminCalendar from './endpoints/admin-endpoints/AdminCalendar';
import AdminContacts from './endpoints/admin-endpoints/AdminContacts';
import AdminServices from './endpoints/admin-endpoints/AdminServices';
import AdminUsers from './endpoints/admin-endpoints/AdminServices';
import AdminProfile from './endpoints/admin-endpoints/AdminProfile';


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
            {
                path: '/view-profile',
                element: <AdminProfile />,
            }
        ],
    },
]);

export default router;