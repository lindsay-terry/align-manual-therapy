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
import { generateTimeSlots, appointmentDuration } from '../utils/timeslots';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_APPOINTMENTS } from '../utils/queries';
import { CREATE_APPOINTMENT } from '../utils/mutations';
import Auth from '../utils/auth';

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
    // Querying existing appointments - Always fetch from network not cached value
    const { loading, data, refetch } = useQuery(QUERY_APPOINTMENTS, {
        fetchPolicy: "network-only"
    });
    const appointments = data ? data.appointments : [];

    const [createAppointment] = useMutation(CREATE_APPOINTMENT);

    const [day, setDay] = useState('');
    const [displayDay, setDisplayDay] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleSelect = async (value, event) => {
        // Format the day selected to just the day
        const selectedDate = dayjs(value).format('YYYY-MM-DD');
        // Calculating selectedValue total time block
        const selectedValueTimeBlock = (selectedValue.duration + selectedValue.cleanup)
        // Generate time slots for the day
        const slots = generateTimeSlots(value, selectedValueTimeBlock);
        // Filter appointments for the selected day
        const daysAppointments = appointments.filter(appointment =>
            dayjs(appointment.date).format('YYYY-MM-DD') === selectedDate
        );

        // Map over the day's appointments to calculate and store the booked time slots (start and end times) for each appointment
        const bookedSlots = daysAppointments.map(appointment => {
            const startTime = appointment.time;
            const endTime = appointmentDuration(startTime, appointment.duration, appointment.cleanup);
        
            return { start: startTime, end: endTime };
        });

        slots.forEach(slot => {
            const slotStartTime = dayjs(slot.time);  // Start time of the current slot
            const slotEndTime = slotStartTime.add(slot.interval, 'minutes');  // Slot end time (based on chosen interval)
            const currentTime = dayjs();  // Current time
            const minTimeAhead = 30;  // Minimum time in minutes before current time

            if (!slotStartTime.isValid()) {
                console.error('Invalid start time:', slot.time);
                return;
            }

            // Check if the slot starts less than 30 minutes from the current time
            if (slotStartTime.isBefore(currentTime.add(minTimeAhead, 'minutes'))) {
                console.log(`Slot ${slotStartTime.format('hh:mm A')} is too soon to book.`);
                slot.booked = true;  // Mark the slot as booked/unavailable
                return;  // Skip further processing for this slot
            }
            
            // formatted for console.logs and messages
            const formattedSlotTime = slotStartTime.format('hh:mm A');
        
            // Calculate the potential appointment's end time using selected duration and cleanup as total time block
            const newAppointmentEnd = slotStartTime.add(selectedValueTimeBlock, 'minutes');
            console.log(`New Appointment Time Block: ${formattedSlotTime} to ${newAppointmentEnd.format('hh:mm A')}`);
        
            // Check if this time slot overlaps with any existing booked appointments
            const isBooked = bookedSlots.some(appointment => {
                const appointmentStartTime = dayjs(appointment.start, 'hh:mm A');
                const appointmentEndTime = dayjs(appointment.end, 'hh:mm A');
        
                // Ensure we are comparing slots and appointments on the same date
                const slotDate = slotStartTime.format('YYYY-MM-DD');
                const existingAppointmentStart = dayjs(`${slotDate} ${appointmentStartTime.format('hh:mm A')}`, 'YYYY-MM-DD hh:mm A');
                const existingAppointmentEnd = dayjs(`${slotDate} ${appointmentEndTime.format('hh:mm A')}`, 'YYYY-MM-DD hh:mm A');
        
                // Logging for debugging
                console.log(`Slot: ${formattedSlotTime} - ${slotEndTime.format('hh:mm A')}`);
                console.log(`Appointment: ${existingAppointmentStart.format('hh:mm A')} - ${existingAppointmentEnd.format('hh:mm A')}`);
                console.log('---');
        
                // Conditions for overlap:
                return (
                    // Case 1: The slot starts during an existing appointment
                    (slotStartTime.isBefore(existingAppointmentEnd) && slotEndTime.isAfter(existingAppointmentStart)) ||
        
                    // Case 2: The new appointment's end time overlaps with an existing appointment
                    (newAppointmentEnd.isAfter(existingAppointmentStart) && slotStartTime.isBefore(existingAppointmentEnd)) ||
        
                    // Case 3: The new appointment fully encompasses an existing appointment
                    (slotStartTime.isBefore(existingAppointmentStart) && newAppointmentEnd.isAfter(existingAppointmentEnd))
                );
            });
        
            slot.booked = isBooked;  // Mark the slot as booked if there's an overlap
            console.log(`Slot Time: ${formattedSlotTime}, Is Booked: ${isBooked}`);
            console.log(' ');
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
    
        const variables = {
            service: selectedValue.id,
            user: user.data._id,
            date: parsedDate,
            time: dayjs(formattedTime).tz('America/Denver').format('hh:mm A'),
            price: selectedValue.price,
            duration: selectedValue.duration,
            cleanup: selectedValue.cleanup,
            
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
            await createAppointment({ variables });
            await refetch(); // Refetch right after mutation
            // Redirect to user's page
            navigate('/profile');
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
                    <div style={styles.modalFooter} key="modal-footer">
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