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
        { path: '/gift-certificates', label: 'Gift Certificates' },
        { path: '/reviews', label: 'Reviews' },
        { path: '/education', label: 'Education' },
        { path: '/blog', label: 'Blog' },
        { path: '/contact', label: 'Contact' },
        // If logged in, show logout button.  Vice versa
        ...(Auth.loggedIn()
        ? ''
        : [{ path: '/login', label: 'Login' }]
    )
    ];



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
                <Menu mode='vertical' selectedKeys={[location.pathname]}>
                    {navItems.map((item) => (
                        <Menu.Item key={item.path}  >
                            <Link to={item.path} style={location.pathname === item.path ? styles.activeLink : styles.inactiveLink } >
                                {item.label}
                            </Link>
                        </Menu.Item>
                    ))}
                        {Auth.loggedIn() && (
                        <Menu.Item key="logout">
                            <Button onClick={handleLogout} style={styles.inactiveLink}>Logout</Button>
                        </Menu.Item>
                    )}
                </Menu>
            </Drawer>
        </Flex>
    )
};
