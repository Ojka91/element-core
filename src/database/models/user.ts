import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IUser {
    email: string,
    password: string,
    createdAt: Date,
    recoverPasswordToken: string
}

const User = new Schema<IUser>({
  email: {type: String, required: true},
  password: {type: String, required: true},
  createdAt: {type: Date, required: true},
  recoverPasswordToken: {type: String, required: true},
});

export default mongoose.model('User', User);