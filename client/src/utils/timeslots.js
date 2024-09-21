import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// Create timeslots in 45 minute increments
export const generateTimeSlots = (date, duration, cleanup) => {
    const slots = [];

    const startTime = dayjs(date).tz('America/Denver').set('hour', 10).set('minute', 0); // 10:00 start time
    const endTime = dayjs(date).tz('America/Denver').set('hour', 18).set('minute', 15); // 6:15 end time

    // Calculate the latest possible start time based on duration + cleanup
    const latestStartTime = endTime.subtract(duration + cleanup, 'minute');

    let time = startTime;
    while (time.isBefore(latestStartTime) || time.isSame(latestStartTime)) {
        slots.push({
            time: time.toDate(),
            booked: false,
        });
        time = time.add(45, 'minute'); // Add 45 minutes
    }
    return slots;
};

// Calculate appointment duration including entire appointment time and cleanup
export const appointmentDuration = (timeString, duration, cleanup) => {

    const time = dayjs(timeString, 'hh:mm A')
    const totalMinutes = duration + cleanup;

    const endTime = time.add(totalMinutes, 'minute');

    return dayjs(endTime).format('hh:mm A');
}

