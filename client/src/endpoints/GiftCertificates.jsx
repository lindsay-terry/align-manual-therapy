import Payment from '../components/Payment';

export default function GiftCertificates() {

    const styles={
        container: {
            backgroundColor: 'var(--alabaster)',
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
                <h2 style={styles.customHeading}>Gift Certificates</h2>
                <Payment />
            </div>
        </div>
    )
}