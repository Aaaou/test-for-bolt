import mongoose, { Schema, Document } from 'mongoose';

export interface IExpenseItem {
  type: string;
  amount: number;
  note: string;
}

export interface IReimbursement extends Document {
  date: Date;
  name: string;
  department: string;
  expenses: IExpenseItem[];
  totalAmount: number;
  attachmentPath: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ExpenseItemSchema: Schema = new Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  note: { type: String }
});

const ReimbursementSchema: Schema = new Schema({
  date: { type: Date, required: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  expenses: { type: [ExpenseItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  attachmentPath: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model<IReimbursement>('Reimbursement', ReimbursementSchema);