import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// Create timeslots in 45 minute increments
export const generateTimeSlots = (date, selectedValueTimeBlock) => {
    const slots = [];
    const interval = 45

    const startTime = dayjs(date).tz('America/Denver').set('hour', 10).set('minute', 0); // 10:00 start time
    const endTime = dayjs(date).tz('America/Denver').set('hour', 18).set('minute', 15); // 6:15 end time

    // Calculate the latest possible start time
    const latestStartTime = endTime.subtract(selectedValueTimeBlock, 'minute');

    let time = startTime;
    while (time.isBefore(latestStartTime) || time.isSame(latestStartTime)) {
        slots.push({
            time: time.toDate(),
            interval: interval,
            booked: false,
        });
        time = time.add(interval, 'minute'); // Add interval in minutes for next slot time
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

