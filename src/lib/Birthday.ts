import config from '../../config';
import Birthday from '../models/Birthday';

const { errors } = config;

/**
 * Adds a birthday entry
 * @param userId
 * @param month
 * @param day
 */
const addEntry = (
    userId: string,
    month: number,
    day: number,
): Promise<{ user_id: string; month: number; day: number }> => {
    return new Promise(async (resolve, reject) => {
        const foundOne = await Birthday.findOne({ user_id: userId });

        if (foundOne) {
            reject(errors.birthday['ENTRY_ALREADY_EXISTS']);
        } else {
            const birthday = new Birthday({
                user_id: userId,
                month,
                day,
            });

            birthday.save(async (err, savedBirthday) => {
                if (err) {
                    reject(err);
                }

                resolve(savedBirthday);
            });
        }
    });
};

/**
 * Updates a birthday entry
 * @param userId
 * @param month
 * @param day
 */
const updateEntry = (userId: string, month: number, day: number) => {
    return new Promise(async (resolve, reject) => {
        const foundOne = await Birthday.findOne({ user_id: userId });

        if (!foundOne) {
            reject(errors.birthday['NO_ENTRY_EXISTS']);
        } else {
            Birthday.findOneAndUpdate(
                { user_id: userId },
                { month, day },
                {},
                async (err, updatedBirthday) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(updatedBirthday);
                },
            );
        }
    });
};

/**
 * Deletes a birthday entry
 * @param userId
 */
const deleteEntry = (userId: string): Promise<null> => {
    return new Promise(async (resolve, reject) => {
        const foundOne = await Birthday.findOne({ user_id: userId });

        if (!foundOne) {
            reject(errors.birthday['NO_ENTRY_EXISTS']);
        } else {
            Birthday.findOneAndDelete({ user_id: userId }, {}, async (err) => {
                if (err) {
                    reject(err);
                }

                resolve(null);
            });
        }
    });
};

/**
 * Gets all birthday entries
 */
const getEntries = (): Promise<
    { user_id: string; month: number; day: number }[]
> => {
    return new Promise((resolve, reject) => {
        Birthday.find({}, {}, {}, async (err, entries) => {
            if (err) {
                reject(err);
            }

            resolve(entries);
        });
    });
};

export { addEntry, updateEntry, deleteEntry, getEntries };
