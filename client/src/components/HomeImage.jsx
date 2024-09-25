import HomeImg from '../assets/images/trees.jpg';

export default function HomeImage() {
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
            fontSize: '5vw', // Responsive font size
            textShadow: '2px 2px 15px rgba(0, 0, 0, 0.7)',  
        },
        heading: {
            textShadow: '2px 2px 15px rgba(0, 0, 0, 0.7)', 
            fontSize: '5vw', // Responsive font size
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