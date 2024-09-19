import BookServices from '../components/UI/BookServices';

export default function Book() {

    const styles={
        container: {
            backgroundColor: 'var(--isabelline)',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center'
        },
        customHeading: {
            display: 'flex',
            justifyContent: 'center',
        }

    }

    return (
        <div style={styles.container}>
            <div >
                <h2 style={styles.customHeading}>Book Appointment</h2>
                <BookServices />
            </div>
        </div>
    )
}