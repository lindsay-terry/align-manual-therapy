import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Drawer, Button, Menu, Flex } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Auth from '../../utils/auth';
{/* <CloseOutlined /> */}

export default function Nav() {
    const location = useLocation();
    // State for opening drawer
    const [open, setOpen] = useState(false);
    // State for managing responsiveness for menu
    const [isSmallScreen, setIsSmallScreen] = useState(window.matchMedia('(max-width: 880px)').matches);

    // Functions to handle state changes for opening and closing drawer
    const showDrawer = () => {
        setOpen(true);
    }
    const closeDrawer = () => {
        setOpen(false);
    }

    // Log out logged in user
    const handleLogout = () => {
        Auth.logout();
        window.location.href = '/';
        console.log('Logged out!');
    };

    // Watch for changes in screen size state to handle styling for screen sizes
    useEffect(() => {
        const beResponsive = () => {
            setIsSmallScreen(window.matchMedia('(max-width: 880px').matches);
        };

        window.addEventListener('resize', beResponsive);
        return () => window.removeEventListener('resize', beResponsive);
    }, []);
    
    const styles={
        activeLink: {
            color: 'var(--olive-2)',
            padding: '30px',
        },
        inactiveLink: {
            textDecoration: 'none',
            padding: '20px',
            color: 'var(--black-olive)',
        },
        menuButton: {
            display: isSmallScreen? 'block' : 'none',
            margin: '10px'
        },
        navLinks: {
            display: isSmallScreen? 'none' : 'block',
            gap: '20px',
            margin: '10px'
        }
    }

    // Nav items array with path and label for what text to show
    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/book-massage', label: 'Book Massage' },
        // If Admin, don't show the following menu items
        ...(Auth.loggedIn() && Auth.isAdmin()) ? '' : [
            { path: '/gift-certificates', label: 'Gift Certificates' },
            { path: '/reviews', label: 'Reviews' },
            { path: '/education', label: 'Education' },
            { path: '/contact', label: 'Contact' },
        ],

        // If admin, show admin menu items
        ...(Auth.loggedIn() && Auth.isAdmin()) ? [
            { path: '/view-calendar', label: 'View Calendar' },
            { path: '/view-users', label: 'View Users'},
            { path: '/view-services', label: 'View Services'},
            { path: '/view-contacts', label: 'View Contacts'},
            { path: '/view-profile', label: 'View Profile'}
        ] : '',
                // If logged in, show logout button.  Vice versa
        ...(Auth.loggedIn() ? '' : [{ path: '/login', label: 'Login' }]),
    ];

    // Create items for the Menu component
    const menuItems = navItems.map(item => ({
        key: item.path,
        label: Auth.loggedIn() && item.path === '/login' ? (
            <Button onClick={handleLogout} style={styles.inactiveLink}>Logout</Button>
        ) : (
            <Link to={item.path} style={location.pathname === item.path ? styles.activeLink : styles.inactiveLink}>
                {item.label}
            </Link>
        )
    }));

    // Add the logout button if the user is logged in
    if (Auth.loggedIn()) {
        menuItems.push({
            key: 'logout',
            label: <Button onClick={handleLogout} style={styles.inactiveLink}>Logout</Button>
        });
    }



    return (
        <Flex justify={isSmallScreen ? 'flex-end' : 'center'}>
            {/* Navigation menu button for small screens  */}
            <div display='block' >
                <Button icon={<MenuOutlined />} onClick={showDrawer} style={styles.menuButton} />
            </div>
            
            {/* Navigation menu links for larger screens  */}
            <Flex style={styles.navLinks} >
                {navItems.map((item) => (
                    <Link key={item.path} to={item.path} style={location.pathname === item.path ? styles.activeLink : styles.inactiveLink } >
                        {item.label}
                    </Link>
                ))}
                       {Auth.loggedIn() && (
                            <Button onClick={handleLogout} style={styles.inactiveLink}>Logout</Button>
                    )}
            </Flex>

            {/* Use drawer component for menu on smaller screens */}
            <Drawer title='Menu' placement='right' closable={true} onClose={closeDrawer} open={open}>
                <Menu mode='vertical' selectedKeys={[location.pathname]} items={menuItems} />
            </Drawer>
        </Flex>
    )
};