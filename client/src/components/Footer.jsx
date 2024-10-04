import { Layout, Menu, Typography, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import alignlogo from '../assets/images/alignlogo.webp';
import Auth from '../utils/auth';


export default function Footer() {
    

    const { Footer } = Layout;
    const { Text } = Typography;
    
    const menuItems = [
        {
            key: '1',
            label: <Link to="/book-massage" style={{ color: 'var(--seasalt)' }}>Book Services</Link>
        },        {
            key: "2",
            label: <Link to="/contact" style={{ color: 'var(--seasalt)' }}>Contact Us</Link>
        },
        {
            key: "3",
            label: (
                <Link to={Auth.loggedIn() ? "/profile" : "/login"} style={{ color: 'var(--seasalt)' }}>
                    Your Profile
                </Link>
            )
        }
    ]


    return (

        <Footer style={{ backgroundColor: 'var(--olive-2)', color: 'var(--seasalt', padding: '20px 0' }}>
            <Row justify="center" align="middle" style={{ textAlign: 'center', position: 'relative' }}>
                <Col xs={24}>
    
                    <Text className="footer-text" style={{ display: 'block', marginBottom: '8px' }}>225 North Bluff Street, Suite #23 St. George, Utah 84770</Text>
                    <Text style={{ display: 'block', marginBottom: '8px' }}>Text: (801) 867-4354</Text>
                </Col>
                <Col xs={24}>
                    <Text style={{ display: 'block', marginBottom: '8px' }}>© 2024 Align Manual Therapy.</Text>
                </Col>
                <Col xs={24}>
                    <Menu 
                    mode="horizontal"
                    items={menuItems}
                    style={{ 
                        lineHeight: '1.5', 
                        backgroundColor: 'var(--olive-2)', 
                        border: 'none', 
                        justifyContent: 'center', 
                        display: 'flex', 
                    }}
                    />
                </Col>
                <Col xs={24} style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
                    <img src={alignlogo} alt="Align Manual Therapy Logo" style={{ width: '100%', maxWidth: '80px' }} />
                </Col> 
            </Row>
            {/* Media query to adjust alignment for small screens */}
            <style jsx="true">{`
                @media (max-width: 576px) {
                    // .ant-row {
                    //     justify-content: flex-start !important;
                    //     text-align: left !important;
                    //     margin-left: 20px !important;
                    // }
                    .footer-text {
                        font-size: 13px !important;
                    }
                }
            `}</style>
        </Footer>
    );
};