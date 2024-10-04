import HomeImg from '../assets/images/trees.jpg';
import { Grid } from 'antd';
const { useBreakpoint } = Grid;

export default function HomeImage() {
    const screens = useBreakpoint();
    console.log(screens)

    // Adjust the priority of breakpoints
    const getFontSize = () => {
        if (screens.xl) return '3vw';  // Extra large screens
        if (screens.lg) return '4vw';  // Large screens
        if (screens.md) return '5vw';  // Medium screens
        if (screens.sm) return '7vw';  // Small screens
        return '8vw';  // Extra small screens
    };

    const styles = {
        container: {
            width: '100%', // Ensures full width
            overflow: 'hidden', // Prevents overflow
        },
        backgroundImage: {
            backgroundImage: `url(${HomeImg})`,
            backgroundSize: 'cover', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: '80vh', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white', 
        },
        textContainer: {
            display: 'flex',
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center', // Center align text
            padding: '0 20px', // Add horizontal padding
        },
        specialFont: {
            fontFamily: 'Arizonia, cursive', 
            fontSize: getFontSize(), // Responsive font size
            textShadow: '2px 2px 15px rgba(0, 0, 0, 0.7)',  
        },
        heading: {
            textShadow: '2px 2px 15px rgba(0, 0, 0, 0.7)', 
            fontSize: getFontSize(), // Responsive font size
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.backgroundImage}>
                <div style={styles.textContainer}>
                    <h1 style={styles.specialFont}>Massage Therapy</h1>
                    <h1 style={styles.heading}>Healthy Starts Here</h1>
                    <h1 style={styles.specialFont}>A Natural Way To Heal</h1>
                </div>
            </div>
        </div>
    );
}