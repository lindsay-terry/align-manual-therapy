import AdminCalendarSetup from '../../components/AdminCalendarSetup';
import { Result } from 'antd';
import Auth from '../../utils/auth';

export default function AdminCalendar() {
    // Security check to ensure only admins have access to this endpoint
    const allowed = Auth.loggedIn() && Auth.isAdmin();

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

    // Ensure user is authorized to view component
    if (!allowed) {
        return (
            <Result status="403" title="403" subTitle="Sorry, you don't have permission to access this page." />
        );
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