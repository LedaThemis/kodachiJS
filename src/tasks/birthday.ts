import cron from 'node-cron';

import Birthday from '../models/Birthday';

export const birthdayTask = (
    callback: (error: Error | null, results: any[]) => any,
) =>
    cron.schedule(
        '0 0 * * *',
        (now) => {
            const currentMonth = now.getMonth() + 1;
            const currentDay = now.getDate();
            console.log('Task | Birthday | Running at 12:00AM UTC');
            console.log(
                `Task | Birthday | Today is ${currentMonth}/${currentDay}`,
            );

            Birthday.find(
                { month: currentMonth, day: currentDay },
                'user_id',
                {},
                (err, result) => {
                    callback(err, result);
                },
            );
        },
        {
            scheduled: false,
            timezone: 'UTC',
        },
    );
