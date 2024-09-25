import { useEffect, useState } from 'react';
import { Card } from 'antd';
import flowers from '../assets/images/flowers.jpg';

export default function WhyOsteo() {

    const getCardWidth = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth < 600) {
            return '100%'; // Full width for small screens
        } else if (screenWidth >= 600 && screenWidth < 900) {
            return '45%'; // Half width for medium screens
        }else {
            return '30%'; // Three cards in a row for larger screens
        }
    };

    const [cardWidth, setCardWidth] = useState(getCardWidth());

    useEffect(() => {
        const handleResize = () => {
            setCardWidth(getCardWidth());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    const styles = {
        container: {
            backgroundImage: `url(${flowers})`,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column', // Stack title and cards vertically
            alignItems: 'center', // Center align content
            marginTop: '50px',
        },
        cardWrapper: {
            display: 'flex',
            flexWrap: 'wrap', // Allows wrapping to next line
            justifyContent: 'space-between', // Space between cards
            borderBottom: '2px solid var(--olive-2)', // Border below the cards
            paddingBottom: '20px', // Space between cards and border
            width: '100%', // Make sure it stretches across the container
        },
        card: {
            width: cardWidth,
            margin: '10px 0', // Margin between rows
            boxShadow: '1px 1px 10px var(--olive-2)',
        },
        title: {
            marginBottom: '10px',
        },
        titleContainer: {
            width: '100%',
            borderTop: '2px solid var(--olive-2)', // Border color and thickness
            paddingTop: '10px', // Space between border and title
            marginBottom: '20px', // Space below the title section
            textAlign: 'center',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.titleContainer}>
                <h1>Why Osteopathic Manual Therapy?</h1>
                <h2 >It can help with:</h2>
            </div>

            <div style={styles.cardWrapper}>
                <Card style={styles.card}>
                    <h2 style={styles.title}>Whole Body Health</h2>
                    <p>Osteopathic Manual Therapy uses a broader scope of manual therapy techniques to achieve whole-body healing. Addressing the root cause of dysfunction and not just the symptoms.</p>
                </Card>

                <Card style={styles.card}>
                    <h2 style={styles.title}>Eliminate Pain</h2>
                    <p>Our approach to treatment is based on the philosophy that all the body’s systems are interconnected and treatment needs to consider and address them all to be successful in eliminating pain.</p>
                </Card>

                <Card style={styles.card}>
                    <h2 style={styles.title}>Improve Circulation</h2>
                    <p>Lymphatic drainage is used to promote normal circulation in the muscles, tissues, and organs directly beneath the surface area being treated.</p>
                </Card>

                <Card style={styles.card}>
                    <h2 style={styles.title}>Visceral Manipulation</h2>
                    <p>Evaluation and treatment of the cause of chronic pain or inflammation by working on the fascial system of the viscera to integrate the whole body.</p>
                </Card>

                <Card style={styles.card}>
                    <h2 style={styles.title}>Tissue Healing</h2>
                    <p>Help improve range of motion and heal injuries below the surface in both muscles and connective tissue.</p>
                </Card>

                <Card style={styles.card}>
                    <h2 style={styles.title}>Sports Injury</h2>
                    <p>Utilize massage therapy to help you heal from a sport-related injury where we focus on the problem area to ensure its best road to recovery.</p>
                </Card>
            </div>
        </div>
    );
}