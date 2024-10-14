import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

interface ExpenseItem {
  type: string;
  amount: string;
  note: string;
}

const ExpenseForm: React.FC = () => {
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [expenses, setExpenses] = useState<ExpenseItem[]>([{ type: '', amount: '', note: '' }]);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleExpenseChange = (index: number, field: keyof ExpenseItem, value: string) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const addExpenseItem = () => {
    setExpenses([...expenses, { type: '', amount: '', note: '' }]);
  };

  const removeExpenseItem = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size <= 20 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      alert('文件大小不能超过20MB');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const formData = new FormData();
    formData.append('date', date);
    formData.append('name', name);
    formData.append('department', department);
    formData.append('expenses', JSON.stringify(expenses));
    if (file) {
      formData.append('attachment', file);
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/reimbursements`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSubmitMessage('报销申请提交成功！');
      // 重置表单
      setDate('');
      setName('');
      setDepartment('');
      setExpenses([{ type: '', amount: '', note: '' }]);
      setFile(null);
    } catch (error) {
      console.error('提交报销申请时出错：', error);
      setSubmitMessage('提交失败，请稍后重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      {/* 表单内容保持不变 */}
      {/* ... */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-300"
        >
          {isSubmitting ? '提交中...' : '提交报销申请'}
        </button>
      </div>
      {submitMessage && (
        <div className={`mt-4 p-2 rounded ${submitMessage.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submitMessage}
        </div>
      )}