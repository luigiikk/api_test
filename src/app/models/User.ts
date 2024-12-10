import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter no mínimo 2 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, insira um email válido'
    ]
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter no mínimo 6 caracteres']
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: "Order"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


userSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.pre('save', async function(next) {

  if (!this.isModified('password')) {
    return next();
  }

  try {

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});


userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};


userSchema.index({ email: 1 });

export const User = model("User", userSchema);


export interface IUser {
  name: string;
  email: string;
  password: string;
  orders: Schema.Types.ObjectId[];
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}