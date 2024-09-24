import { useState } from 'react';
import { Card, Button } from 'antd';
import alignlogo from '../assets/images/alignlogo.webp';
import dayjs from 'dayjs';
import Payment from '../components/Payment';

export default function AppointmentCards({ userData }) {

    const styles = {
        cardTitle: {
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        },
        cardBody: {
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        },
        payButton: {
            padding: '20px',
        },
    }
    // State to manage visibility of link to payment form
    const [showPayment, setShowPayment] = useState(false);

    const handlePay = (appointmentId) => {
        setShowPayment((prev) => ({ ...prev, [appointmentId]: true }));
    };

    // Update appointment data if payment is successful
    const handlePaymentSuccess = (appointmentId) => {
        setShowPayment((prev) => ({ ...prev, [appointmentId]: false}));
        refetch();
    }

    const myAppts = userData.appointments;
    // Avoid timestamp formats rendering and interferring with date accuracy
    const normalizedAppts = myAppts.map(appointment => {
        const dateValue = appointment.date;
        return {
            ...appointment,
            date: !isNaN(Date.parse(dateValue)) ? dayjs(dateValue).toISOString() : dayjs(Number(dateValue)).toISOString()
        };
    });
    // Sort appointments by date (newest to oldest)
    const sortedAppts = normalizedAppts.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

    return (
        <div>
            {sortedAppts.map((appointment) => {
                // Check if appointment date is in the past, future, or current day
                const isPast = dayjs(appointment.date).isBefore(dayjs().startOf('day'));
                const isToday = dayjs(appointment.date).isSame(dayjs(), 'day');
                const cardStyle = {
                    // Soft gray for past dates, beige for today, and sage green for future
                    backgroundColor: isPast ? '#D3D3D3' : isToday ? '#B098A4' : '#B2C9B5',
                    marginBottom: '16px',
                    boxShadow: '1px 1px 5px var(--black-bean)',
                    fontFamily: 'Quicksand, sans-serif',
                };
                return (
                    <Card key={appointment._id} style={cardStyle}>
                        {/* Conditional rendering based on when appointment is */}
                        <div style={styles.cardTitle}>
                        {isPast? (
                            <h2>Previous Service:</h2>
                        ) : isToday? (
                            <h2>Appointment Today!</h2>
                        ) : (
                            <h2>Upcoming Appointment:</h2>
                        )}
                            <div>
                                <h2>{dayjs(appointment.date).format('MM/DD/YYYY')} @ {appointment.time}</h2>
                            </div>
                        </div> 
                        <div style={styles.cardBody}>
                            <div> 
                                <h2>{appointment.service.name}: {appointment.duration} minutes</h2>
                            </div>
                            <div>
                                <img src={alignlogo} alt="Align Manual Therapy logo" style={{maxHeight: '150px'}}></img>
                            </div>
                        </div>
                        {/* If appointment is paid, show paid.  If not, give option to pay now */}
                        {!appointment.isPaid ? (
                            <Button style={styles.payButton} key={appointment._id} onClick={() => handlePay(appointment._id)}>
                                Pay Now
                            </Button>
                        ) : (
                            <Button style={styles.payButton} key={appointment._id} disabled>
                                Paid!
                            </Button>
                        )}
                        {/* State showPayment updated by appointment._id to lead user to payment form */}
                        {showPayment[appointment._id] && (
                            <Payment amount={appointment.price*100} appointmentId={appointment._id} onPaymentSuccess={() => handlePaymentSuccess(appointment._id)}/>
                        )}
                    </Card>
                )
            })}
        </div>
    )
};
