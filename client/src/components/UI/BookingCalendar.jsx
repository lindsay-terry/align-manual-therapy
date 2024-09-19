import { Button, Modal } from "antd";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
// Dayjs to manage time
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { generateTimeSlots, appointmentDuration } from '../../utils/timeslots';
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
        },
        modalFooter: {
            display: 'flex',
            justifyContent: 'space-evenly',
            padding: '10px',
        },
        customBtn: {
            backgroundColor: 'var(--seasalt)',
            padding: '20px',
        },
        cancelBtn: {
            backgroundColor: 'var(--bittersweet)',
            padding: '20px',
            color: 'var(--seasalt)',
        },
        confirmBtn: {
            backgroundColor: 'var(--olive-2)',
            color: 'var(--seasalt)',
            padding: '20px',
        }
    }

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.extend(customParseFormat);
    // Querying existing appointments
    const { loading, data, refetch } = useQuery(QUERY_APPOINTMENTS);
    const appointments = data ? data.appointments : [];

    const [createAppointment] = useMutation(CREATE_APPOINTMENT);

    const [day, setDay] = useState('');
    const [displayDay, setDisplayDay] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [bookedDays, setBookedDays] = useState([]);

    const navigate = useNavigate();

    const handleSelect = async (value, event) => {
        // Format the day selected to just the day
        const selectedDate = dayjs(value).format('YYYY-MM-DD');
        // Generate time slots for the day
        const slots = generateTimeSlots(value);
        // Temporary array to store the day's appointments
        let daysAppointments = [];
        // Check through all appointments to find appointments for selected day
        for (let i = 0; i < appointments.length; i++) {
            // Check the day in all the appointments and add them to our daily array
            if (dayjs(appointments[i].date).format('YYYY-MM-DD') === selectedDate) {
                daysAppointments.push(appointments[i]);
            }
        };

        let bookedSlots = [];

        daysAppointments.forEach(appointment => {
            // Aquire start and end times for each appointment
            const startTime = appointment.time;
            // Calculate end time of appointment based on duration and cleanup time
            const endTime = appointmentDuration(startTime, appointment.duration, appointment.service.cleanup);
            // Add to array of booked timeslots
            bookedSlots.push({ start: startTime, end: endTime });

        });

        slots.forEach(slot => {
            const slotStartTime = dayjs(slot.time);
            // console.log(slotStartTime, 'SLOTSTARTTIME')
            const slotEndTime = slotStartTime.add(45, 'minutes');

            if (!slotStartTime.isValid()) {
                console.error('Invalid start time:', slot.time);
                return;
            }
            // formatted for console.logs and messages
            const formattedSlotTime = slotStartTime.format('hh:mm A');

            const isBooked = bookedSlots.some(appointment => {
                const appointmentStartTime = appointment.start;
                const appointmentEndTime = appointment.end;

                // Get the date from the slotStartTime
                const slotDate = slotStartTime.format('YYYY-MM-DD');
                const dayjsAppointmentStart = dayjs(`${slotDate} ${appointmentStartTime}`, 'YYYY-MM-DD hh:mm A');
                const dayjsAppointmentEnd = dayjs(`${slotDate} ${appointmentEndTime}`, 'YYYY-MM-DD hh:mm A');

                return (
                    // Check appointment times against slot times and figure out overlap to consider a slot booked
                    (slotStartTime.format('hh:mm A') === (appointmentStartTime)) ||
                    (slotStartTime.format('HH:mm') > (dayjsAppointmentStart.format('HH:mm')) && slotStartTime.format('HH:mm') < dayjsAppointmentEnd.format('HH:mm')) ||
                    (slotEndTime.format('HH:mm') > dayjsAppointmentStart.format('HH:mm') && slotEndTime.format('HH:mm') < dayjsAppointmentEnd.format('HH:mm')) || // Slot ends during the appointment
                    (slotStartTime.format('HH:mm') < dayjsAppointmentStart.format('HH:mm') && slotEndTime.format('HH:mm') > dayjsAppointmentEnd.format('HH:mm')) // Slot completely encompasses the appointment
                );
   
            });

            slot.booked = isBooked;
            console.log(`Slot Time: ${formattedSlotTime}, Is Booked: ${isBooked}`);

        })

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
    
        const variables = {
            service: selectedValue.id,
            user: user.data._id,
            date: parsedDate,
            time: dayjs(formattedTime).tz('America/Denver').format('hh:mm A'),
            price: selectedValue.price,
            duration: selectedValue.duration,
            
        };
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
                <Calendar locale="en-US" onChange={handleSelect} minDate={new Date()}/>
            </div>
            {day ? (
            <div style={styles.appointmentContainer}>
                <h3>See appointment times for {displayDay}</h3>
                <div style={styles.appointmentTimes}>
                    {availableSlots.filter(slot => !slot.booked).length === 0 ? (
                    <div>No slots available</div>
                ) : (
                        availableSlots.filter(slot => !slot.booked).map((slot) => (
                            <div key={slot.time.toISOString()}> 
                                <Button style={styles.customBtn} onClick={() => handleSlotSelect(slot)} disabled={slot.booked}>
                                    {slot.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Button>
                            </div>
                        ))
                )}
                </div>
            </div>
            ) : null }

            <Modal
                title='Confirm Appointment'
                open={showModal}
                // onOk={handleConfirm}
                onCancel={handleCancel}
                footer={[
                    <div style={styles.modalFooter}>
                        <Button style={styles.cancelBtn} key='cancel' onClick={handleCancel}>Cancel</Button>
                        <Button style={styles.confirmBtn} key='ok' onClick={handleConfirm}>Confirm</Button>
                    </div>
                ]}
            >
                <p>Service: {selectedValue.name} - {selectedValue.duration} minutes</p>
                <p>Date: {displayDay}</p>
                <p>Time: {selectedSlot ? selectedSlot.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                <p>Price: ${selectedValue.price}</p>
                {/* <p>Practitioner:</p> */}
            </Modal>
        </div>
    );
}       