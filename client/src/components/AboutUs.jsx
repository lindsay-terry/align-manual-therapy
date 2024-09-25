import { Link } from 'react-router-dom';

export default function AboutUs() {
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px',
        },
        manualTherapy: {
            color: 'var(--olive-2)',
        },
        textContainer: {
            maxWidth: '870px',
        },
        paragraph: {
            margin: '10px 0px',
            lineHeight: '1.7',
        },
        borderStyle: {
            borderBottom: '1px solid black', 
            margin: '10px 0', 
            width: '870px',
            
        },
        button: {
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: 'var(--olive-2)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            textDecoration: 'none',
        },

    };

    return (
        <div style={styles.container}>

            <div>
                <h1>ALIGN</h1>
                <h2 style={styles.manualTherapy}> MANUAL THERAPY</h2>
                <h3 style={styles.borderStyle}>Massage Therapy of St. George</h3>
            </div>

            <div style={styles.textContainer}>
                <p style={styles.paragraph}>Ryan Osguthorpe, LMT</p>
                <p style={styles.paragraph}>I graduated from Utah College of  Massage Therapy in 2014. Since then I have worked in both the spa & medical setting, where I have had the honor of working on thousands of clients and providing tens of thousands of massages. I'm continually pursuing new modalities so that I can help my clients that suffer from chronic pain and ailments that that go unresolved. This path has lead me to pursue a higher education in the study of Osteopathic Manual Therapy.</p>
                <p style={styles.paragraph}>My mission is to create tailored treatments to fit your specific needs and desired outcome. I take the time to listen to what you are experiencing each time you come in. So that together, we can Align your mind and body bringing you  a higher quality of life.</p>
            </div>

            {/* Button to book massage */}
            <Link to="/book-massage" style={styles.button}>
                Book A Massage
            </Link>


        </div>
    )
}