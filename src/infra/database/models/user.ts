import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IUser {
    username: string,
    email: string,
    password: string,
    createdAt: Date,
    recoverPasswordToken?: string,
    recoverPasswordTokenExpiry?: Date,
}

const User = new Schema<IUser>({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    createdAt: {type: Date, required: true},
    recoverPasswordToken: {type: String, required: false},
    recoverPasswordTokenExpiry: {type: Date, required: false},
});

export default mongoose.model('User', User);