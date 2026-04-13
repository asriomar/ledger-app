import { useState, useEffect } from 'react';
import API from '../api';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('income');

    // 1. Fetch data from backend when page loads
    const fetchTransactions = async () => {
        try {
            const res = await API.get('/transactions');
            setTransactions(res.data.data);
        } catch (err) {
            console.error("Failed to fetch transactions");
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // 2. Add a new transaction
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const newTransaction = { text, amount: Number(amount), type };
            await API.post('/transactions', newTransaction);
            // Clear form and refresh list
            setText('');
            setAmount('');
            fetchTransactions();
        } catch (err) {
            alert("Error adding transaction");
        }
    };

    // 3. Delete a transaction
    const deleteTransaction = async (id) => {
        try {
            await API.delete(`/transactions/${id}`);
            fetchTransactions();
        } catch (err) {
            alert("Error deleting transaction");
        }
    };

    // 4. Calculate Totals
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expense;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
            <h1>My Ledger</h1>
            <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button>

            {/* Summary Cards */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ border: '1px solid #ccc', padding: '10px', flex: 1 }}>
                    <h3>Balance</h3>
                    <p style={{ fontSize: '24px' }}>RM {balance.toFixed(2)}</p>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '10px', flex: 1, color: 'green' }}>
                    <h3>Income</h3>
                    <p>+ RM {income.toFixed(2)}</p>
                </div>
                <div style={{ border: '1px solid #ccc', padding: '10px', flex: 1, color: 'red' }}>
                    <h3>Expense</h3>
                    <p>- RM {expense.toFixed(2)}</p>
                </div>
            </div>

            {/* Transaction Form */}
            <h3>Add Transaction</h3>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Description (e.g. Popia Sale)" value={text} onChange={(e) => setText(e.target.value)} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
                <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }}>
                    <option value="income">Income (+)</option>
                    <option value="expense">Expense (-)</option>
                </select>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>Add Transaction</button>
            </form>

            {/* Transaction List */}
            <h3>History</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {transactions.map((t) => (
                    <li key={t._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', backgroundColor: t.type === 'income' ? '#f0fff0' : '#fff0f0' }}>
                        <span>{t.text}</span>
                        <span>
                            {t.type === 'income' ? '+' : '-'} RM {t.amount.toFixed(2)}
                            <button onClick={() => deleteTransaction(t._id)} style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}>x</button>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;