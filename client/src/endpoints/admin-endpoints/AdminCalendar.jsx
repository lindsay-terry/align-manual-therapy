import Payment from '../../components/Payment.jsx';
import CalendarSetup from '../../components/CalendarSetup';

export default function AdminCalendar() {

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
        <div>
            <div style={styles.container}>
                <div >
                    <h2 style={styles.customHeading}>Admin Calendar</h2>
                    <Payment />
                </div>
            </div>
            <div>
                <CalendarSetup />
            </div>
        </div>
    )
}