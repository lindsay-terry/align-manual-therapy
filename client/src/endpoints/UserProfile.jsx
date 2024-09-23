import { Descriptions, Row, Col, Card, Button } from 'antd';
import { useQuery } from '@apollo/client';
import { QUERY_ME, QUERY_APPOINTMENTS } from '../utils/queries';
import alignlogo from '../assets/images/alignlogo.webp';
import dayjs from 'dayjs';
import Auth from '../utils/auth';
import { useEffect, useState } from 'react';
import Payment from '../components/Payment';


export default function UserProfile() {

    const styles ={
        customImg: {
            maxHeight: '200px'
        },
        container: {
            backgroundColor: 'var(--isabelline)',
        },
        chart: {
            backgroundColor: 'var(--seasalt)',
        },
        customHeader: {
            margin: '0px',
            padding: '20px',
        },
        payButton: {
            padding: '20px',
            marginTop: '10px'
        }
    }

    const { loading, error, data } = useQuery(QUERY_ME);
    const { loading: loadingAppointments, error: appointmentError, data: result, refetch} = useQuery(QUERY_APPOINTMENTS);

    const [showPayment, setShowPayment] = useState(false);

    const handlePay = (appointmentId) => {
        setShowPayment((prev) => ({ ...prev, [appointmentId]: true }));
    };

    // Refetch user data on component mount to update userData appointments
    useEffect(() => {
        refetch(); 
    }, [refetch]);
    
    // Update status of showPayment to false when user has paid so blue button disappearas
    const handlePaymentSuccess = (appointmentId) => {
        setShowPayment((prev) => ({ ...prev, [appointmentId]: false}));
        refetch();
    }

    if (loading || loadingAppointments) return <p>Loading...</p>;

    if (error) {
        console.error('Error fetching user data:', error);
        return <p>Error: {error.message}</p>;
    }
    if (appointmentError) {
        console.error('Error fetching appointments:', appointmentError);
        return <p>Error: {appointmentError.message}</p>;
    }

    const myId = Auth.getProfile().data._id;

    const myAppts = result?.appointments?.filter(appointment => appointment.user._id === myId) || [];

    const normalizedAppts = myAppts.map(appointment => {
        const dateValue = appointment.date;
    
        // Avoid timestamp formats rendering and interferring with date accuracy
        return {
            ...appointment,
            date: !isNaN(Date.parse(dateValue)) ? dayjs(dateValue).toISOString() : dayjs(Number(dateValue)).toISOString()
        };
    });
    
    // Sort appointments by date (newest to oldest)
    const sortedAppts = normalizedAppts.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

    const userData = data?.me || {};

    const formattedDOB = userData.birthdate ? dayjs(userData.birthdate).format('MM/DD/YYYY') : 'N/A';

    const items = [
        {
            key: '1',
            label: 'Name',
            children: <p>{userData.firstName} {userData.lastName}</p>,
        },
        {
            key: '2',
            label: 'Phone',
            children: <p>{userData.phone}</p>,
        },
        {
            key: '3',
            label: 'Email',
            children: <p>{userData.email}</p>,
        },
        {
            key: '4',
            label: 'DOB',
            children: <p>{formattedDOB} </p>,
        },

    ]
  
    return (
        <div style={styles.container}>
            <h1 style={styles.customHeader}>Welcome {userData.firstName}!</h1>
            <Row gutter={16}>
                <Col xs={24} sm={12} style={{ padding: '16px' }}>
                    <Descriptions
                        style={styles.chart}
                        title="User Information"
                        bordered
                        column={1} 
                        items={items}
                    />
                </Col>
                <Col xs={24} sm={12} style={{ padding: '16px' }}>
                    {sortedAppts.map((appointment, index) => {
                        // Check if the appointment date is in the past
                        const isPast = dayjs(appointment.date).isBefore(dayjs().startOf('day')); 
                        // Check if the appointment is today
                        const isToday = dayjs(appointment.date).isSame(dayjs(), 'day'); 
                        const cardStyle = {
                            backgroundColor: isPast ? '#083D77' : (isToday ? 'var(--tan)' : 'var(--another-green)'), // dark blue for past, light green for future
                            color: isPast ? 'var(--seasalt)' : '',
                            marginBottom: '16px',
                            boxShadow: '0px 1px 4px var(--olive-2)',
                        };

                        return (
                            <Card key={index} style={cardStyle}>
                                {isPast? (
                                    <h3>Previous Service:</h3>
                                ) : isToday? (
                                    <h2>Appointment Today!</h2>
                                ) : (
                                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                                    <h2>Upcoming appointment:</h2> 
                                </div>)}
                                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                                    <div>
                                        <div style={{display: 'flex'}}>
                                        <h3> {dayjs(appointment.date).format('MM/DD/YYYY')} {appointment.time}</h3> 
                                        </div>

                                        <div >
                                            <h3>{appointment.service.name} {appointment.duration} minutes</h3>
                                        </div>
                                        {!appointment.isPaid ? (
                                        <Button style={styles.payButton} key={appointment._id} onClick={() => handlePay(appointment._id)}>
                                            Pay Now
                                        </Button>
                                        ) : (
                                        <Button style={styles.payButton} key={appointment._id} disabled>
                                            Paid!
                                        </Button>
                                        )}

                                    {showPayment[appointment._id] && (
                                        <Payment amount={appointment.price*100} appointmentId={appointment._id} onPaymentSuccess={() => handlePaymentSuccess(appointment._id)}/>
                                    )}

                                    </div>
                                    <div>
                                        <img style={styles.customImg} src={alignlogo} alt='Align Manual Therapy Logo'></img>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </Col>
            </Row>
        </div>
    )
}