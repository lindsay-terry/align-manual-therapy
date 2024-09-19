import HomeImg from '../assets/images/trees.jpg';


export default function HomeImage() {
    const styles = {
        backgroundImage: {
          backgroundImage: `url(${HomeImg})`,
          backgroundSize: 'cover', // or 'contain'
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '80vh', // Adjust as needed
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white', // Optional: adjust text color for visibility
        },
        textContainer: {
          display: 'flex',
          flexDirection: 'column', // Stack text vertically
          alignItems: 'center', // Center align
          
        },
        specialFont: {
          fontFamily: 'Arizonia, cursive', 
          fontSize: '300%',
          textShadow: '2px 2px 15px rgba(0, 0, 0, 0.7)',  // Adjust as needed
        },
        heading: {
          textShadow: '2px 2px 15px rgba(0, 0, 0, 0.7)', 
          fontSize: '300%',
        },
      };

      return (
        <div>
            <div style={styles.backgroundImage}>
                <div style={styles.textContainer}>
                    <h1 style={styles.specialFont}>Massage Therapy</h1>
                    <h1 style={styles.heading}>Healthy Starts Here</h1>
                    <h1 style={styles.specialFont}>A Natural Way To Heal</h1>
                </div>
            </div>
        </div>
      )



    }