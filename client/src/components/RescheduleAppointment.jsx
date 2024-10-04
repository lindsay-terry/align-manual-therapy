import BookingCalendar from './BookingCalendar';
import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { QUERY_SINGLE_APPOINTMENT, QUERY_APPOINTMENTS } from '../utils/queries';
import dayjs from 'dayjs';

export default function RescheduleAppointment({ appointmentId, handleUpdateSuccess }) {
    const [appointment, setAppointment] = useState({});
    //query one appointment and get selected value to pass into BookingCalendar
    const { loading, data, error } = useQuery(QUERY_SINGLE_APPOINTMENT, {
        variables: { appointmentId }
    });
    
    // Fetch most up to date appointment data to bring to rescheduling
    const { loading: loadingAppointments, data: appointmentsData } = useQuery(QUERY_APPOINTMENTS, {
        fetchPolicy: "network-only"
    });

    // Ensure date is the format BookingCalendar is expecting
    const normalizedAppts = (appointmentsData?.appointments || []).map(appointment => {
        const dateValue = appointment.date;
        return {
            ...appointment,
            date: !isNaN(Date.parse(dateValue)) ? dayjs(dateValue).toISOString() : dayjs(Number(dateValue)).toISOString()
        };
    });

    useEffect(() => {
        if (data && data.appointment) {
            const {_id: appointmentId, service, date, time, duration, cleanup, price } = data.appointment;
            const { _id: serviceId, name: serviceName } = service;
            // All the data needed to pass into BookingCalendar as selectedValue
            setAppointment({
                id: serviceId,
                name: serviceName,
                duration: duration,
                cleanup: cleanup,
                price: price,
                date: !isNaN(Date.parse(date)) ? dayjs(date).toISOString() : dayjs(Number(date)).toISOString(),
                time: time,
                appointmentId: appointmentId,
            })
        }
    }, [data])

    if (loading || loadingAppointments) return <p>Loading...</p>;
    if (error) return <p>Error fetching appointment: {error.message}</p>;

    return (
        <div >
            <h2>Reschedule Appointment:</h2>
            {appointment ? (
                <BookingCalendar selectedValue={appointment} handleUpdateSuccess={handleUpdateSuccess} existingAppointments={normalizedAppts}/>
            ) : (
                <p>No appointment found</p>
            )}
            
        </div>
    )
}