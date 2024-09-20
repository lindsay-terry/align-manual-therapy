import HomeImg from '../assets/images/trees.jpg';


export default function HomeImage() {
    const styles = {
        backgroundImage: {
          backgroundImage: `url(${HomeImg})`,
          backgroundSize: 'cover', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '80vh', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white', 
        },
        textContainer: {
          display: 'flex',
          flexDirection: 'column', 
          alignItems: 'center', 
          
        },
        specialFont: {
          fontFamily: 'Arizonia, cursive', 
          fontSize: '300%',
          textShadow: '2px 2px 15px rgba(0, 0, 0, 0.7)',  
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