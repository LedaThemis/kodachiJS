import config from '../../config';
import Profile from '../models/Profile';

const { errors } = config;

const _incAmount = async (
    amount: number,
    userId: string,
): Promise<number | undefined> => {
    return new Promise(async (resolve, reject) => {
        const foundOne = await Profile.findOne({ userId });

        if (!foundOne) {
            reject(errors.bank['USER_NO_ACCOUNT']);
        }

        Profile.findOneAndUpdate(
            { userId },
            { $inc: { balance: amount } },
            {},
            (err, updatedProfile) => {
                if (err) {
                    reject(errors._generic['DATABASE']);
                }

                resolve(updatedProfile?.balance);
            },
        );
    });
};

/**
 * Register user with default balance
 * @param userId
 */
const registerUser = async (
    userId: string,
): Promise<{ userId: string; balance: number }> => {
    return new Promise(async (resolve, reject) => {
        const foundOne = await Profile.findOne({ userId });

        if (foundOne) {
            reject(errors.bank['USER_ALREADY_REGISTERED']);
        }

        const profile = new Profile({
            userId: userId,
            balance: config.currency.defaultBalance,
        });

        profile.save(
            (err, savedProfile: { userId: string; balance: number }) => {
                if (err) {
                    reject(errors._generic['DATABASE']);
                }

                resolve(savedProfile);
            },
        );
    });
};

/**
 * Adds given amount to user balance
 * @param amount
 * @param userId
 */
const addAmount = async (amount: number, userId: string) => {
    return await _incAmount(amount, userId);
};

/**
 * Subtracts given amount from user balance
 * @param amount
 * @param userId
 */
const subAmount = async (amount: number, userId: string) => {
    return await _incAmount(-amount, userId);
};

/**
 * Gets provided user's balance
 * @param userId
 */
const getBalance = async (userId: string): Promise<number> => {
    return new Promise(async (resolve, reject) => {
        const profile = await Profile.findOne({ userId });

        if (!profile) {
            reject(errors.bank['USER_NO_ACCOUNT']);
        } else {
            resolve(profile.balance);
        }
    });
};

/**
 * Sets given amount as user balance
 * @param amount
 * @param userId
 */
const setBalance = async (amount: number, userId: string) => {
    return new Promise(async (resolve, reject) => {
        const foundOne = await Profile.findOne({ userId });

        if (!foundOne) {
            reject(errors.bank['USER_NO_ACCOUNT']);
        }

        Profile.findOneAndUpdate(
            { userId },
            { $set: { balance: amount } },
            {},
            (err, updatedProfile) => {
                if (err) {
                    reject(errors._generic['DATABASE']);
                }

                resolve(updatedProfile?.balance);
            },
        );
    });
};

/**
 * Gets all user balances
 */
const getBalances = async (): Promise<
    {
        userId: string;
        balance: number;
    }[]
> => {
    return new Promise(async (resolve, reject) => {
        Profile.find({}, {}, {}, (err, profiles) => {
            if (err) {
                reject(errors._generic['DATABASE']);
            }

            resolve(profiles);
        });
    });
};

export {
    registerUser,
    addAmount,
    subAmount,
    getBalance,
    setBalance,
    getBalances,
};
