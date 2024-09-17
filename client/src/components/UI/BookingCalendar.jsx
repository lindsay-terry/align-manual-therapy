import { Calendar } from "antd";

export default function BookingCalendar({ selectedValue }) {

    const styles={
        container: {
            backgroundColor: 'var(--alabaster)',
            padding: '30px'
        }
    }

    return (
        <div style={styles.container}>
            <Calendar />
        </div>
    )
}