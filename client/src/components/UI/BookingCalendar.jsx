import { Button, Modal } from "antd";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
// Dayjs to manage time
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { generateTimeSlots } from '../../utils/timeslots';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_APPOINTMENTS } from '../../utils/queries';
import { CREATE_APPOINTMENT } from '../../utils/mutations';
import Auth from '../../utils/auth';

export default function BookingCalendar({ selectedValue }) {

    const styles={
        container: {
            padding: '30px',
            display: 'flex',
            justifyContent: 'center',
        },
        appointmentContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        appointmentTimes: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
        }
    }

    dayjs.extend(utc);
    dayjs.extend(timezone);
    // Querying existing appointments
    const { loading, data, refetch } = useQuery(QUERY_APPOINTMENTS);
    const appointments = data ? data.appointments : [];
    // console.log('APPOINTMENTS', appointments);

    const [createAppointment] = useMutation(CREATE_APPOINTMENT);

    const [day, setDay] = useState('');
    const [displayDay, setDisplayDay] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [bookedDays, setBookedDays] = useState([]);
    const [bookedTimes, setBookedTimes] = useState([]);

    const navigate = useNavigate();

    const handleSelect = async (value, event) => {
        // Generating time slots
        const slots = generateTimeSlots(value);

        setBookedDays(new Set(appointments.map(appointment => dayjs(appointment.date).tz('America/Denver').format('YYYY-MM-DD'))));
        setBookedTimes(new Set(appointments.map(appointment => dayjs(appointment.date).tz('America/Denver').format('HH:mm'))));

        slots.forEach(slot => {
            const slotDay= dayjs(slot.time).tz('America/Denver').format('YYYY-MM-DD');
            const slotTime = dayjs(slot.time).tz('America/Denver').format('HH:mm');

            // console.log(slotDay, slotTime);
            if(bookedDays === slotDay && bookedTimes === slotTime) {
                // console.log(`Marking slot as booked: ${slotDay}`);
                slot.booked = true;
            } else {
                slot.booked = false;
            }
        });

        setDay(value);
        setDisplayDay(dayjs(value).format('MM/DD/YYYY'));
        setAvailableSlots(slots);
    };

    const handleSlotSelect = (slot) => {
        if (!slot.booked) {
        setSelectedSlot(slot);
        setShowModal(true);
        }
    };

    const handleConfirm = async () => {
        // Get access to logged in user for ID to book appointment
        const user = Auth.getProfile();

        const formattedTime = selectedSlot ? selectedSlot.time : null; 
        
        const parsedDate = dayjs(day).toISOString();
        // console.log('PARSEDDATE:', parsedDate);
        

        const variables = {
            service: selectedValue.id,
            user: user.data._id,
            date: parsedDate,
            time: dayjs(formattedTime).tz('America/Denver').format('HH:mm'),
            price: selectedValue.price,
            duration: selectedValue.duration,
            
        };
        console.log(variables.time);
        if (!selectedValue || !user.data._id || !day || !formattedTime) {
            console.error('Invalid input data', {
                selectedValue,
                userId: user.data._id,
                day,
                formattedTime,
            });
            return;
        }

        try {
            const newAppt = await createAppointment({ variables });

            // update bookedTimes array
            setBookedDays(refetch());
            // redirect to user's page (home page for now until it's set up)
            navigate('/');
        } catch (error) {
            console.error('Error saving appointment HERE IS THE ERROR:', error);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    }

    return (
        <div >
            <div style={styles.container}>
                <Calendar onChange={handleSelect} />
            </div>
            {day ? (
            <div style={styles.appointmentContainer}>
                <h3>See appointment times for {displayDay}</h3>
                <div style={styles.appointmentTimes}>
                    {availableSlots.filter(slot => !slot.booked).map((slot) => (
                        <div key={slot.time.toISOString()}> 
                            <Button onClick={() => handleSlotSelect(slot)} disabled={slot.booked}>
                                {slot.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
            ) : null }

            <Modal
                title='Confirm Appointment'
                open={showModal}
                onOk={handleConfirm}
                onCancel={handleCancel}
            >
                <p>Service: {selectedValue.name} - {selectedValue.duration} minutes</p>
                <p>Date: {displayDay}</p>
                <p>Time: {selectedSlot ? selectedSlot.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                <p>Price: ${selectedValue.price}</p>
                <p>Practitioner:</p>

            </Modal>

        </div>
    );
}       