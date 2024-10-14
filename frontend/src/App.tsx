import React from 'react';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto py-8">
        <ExpenseForm />
      </main>
    </div>
  );
}

export default App;