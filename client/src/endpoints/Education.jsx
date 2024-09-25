import { Row, Col } from 'antd';
import Ryan from '../assets/images/Ryan.webp';
import mblex from '../assets/images/mblex_logo.webp';
import UCOMT from '../assets/images/utah_college_of_massage_therapy_logo_edited.webp';

export default function Education() {

    const styles = {
        background: {
            backgroundColor: 'var(--isabelline)',
            
        },
        container: {
            maxWidth: '1200px',
            margin: 'auto',
            padding: '20px',
        },
        customHeading: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
        },
        image: {
            maxWidth: '50%', // Make images responsive
            height: 'auto',
            marginBottom: '10px',
            display: 'block', // Ensure images stack vertically
            marginLeft: 'auto',
            marginRight: 'auto', // Center images horizontally
        },
        logoImage: {
            maxWidth: '20%', // Smaller width for logos
            height: 'auto', // Maintain aspect ratio
            marginBottom: '10px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        list: {
            lineHeight: '2',
        },
    };

    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <h2 style={styles.customHeading}>Education</h2>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <div>
                            <img src={Ryan} alt="Ryan O" style={styles.image} />
                            <img src={mblex} alt="MBLEX Logo" style={styles.logoImage} />
                            <img src={UCOMT} alt="Utah College of Massage Therapy Logo" style={styles.logoImage} />
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <ul style={styles.list}>
                            <li>Thorax in Posture and Gait - 16 CEUs</li>
                            <li>Pelvis in Gait - 16 CEUs</li>
                            <li>Visceral Manipulation I - 16 CEUs</li>
                            <li>Visceral Manipulation II - 16 CEUs</li>
                            <li>Visceral Manipulation III - 16 CEUs</li>
                            <li>The Myalgia Patient - 16 CEUs</li>
                            <li>Pediatric Treatment II- 16 CEUs</li>
                            <li>Osteopathic Medical Sciences III- 16 CEUs</li>
                            <li>Advanced Thorax: Zink, Lymphatics and the Diaphragms- 16 CEUs</li>
                            <li>Advanced Scapular Thoracic - 16 CEUs</li>
                            <li>Neuro-muscular Reintegration II - Athletic Lower Extremity: Run, Hike, Garden - 16 CEUs</li>
                            <li>Osteopathic Medical Sciences IV - 16 CEUs</li>
                            <li>Neuromuscular Exercise Science II - 16 CEUs</li>
                            <li>Craniocervical Complex in Posture - 16 CEUs</li>
                            <li>Advanced Neurodynamics - Chapman Pottenger & Bennett Treatment - 16 CEUs</li>
                        </ul>
                    </Col>
                </Row>
            </div>
        </div>
    );
}