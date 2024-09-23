import Payment from '../../components/Payment.jsx';
import AdminCalendarSetup from '../../components/AdminCalendarSetup';

export default function AdminCalendar() {

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
        <div>
            <div style={styles.container}>
                <div >
                    <h2 style={styles.customHeading}>Admin Calendar</h2>
                </div>
            </div>
            <div>
                <AdminCalendarSetup />
            </div>
        </div>
    )
}