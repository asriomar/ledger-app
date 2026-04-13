import { useState, useEffect } from 'react';
import API from '../api';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('income');
    const [loading, setLoading] = useState(false);

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

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newTransaction = { text, amount: Number(amount), type };
            await API.post('/transactions', newTransaction);
            setText('');
            setAmount('');
            fetchTransactions();
        } catch (err) {
            alert("Error adding transaction");
        } finally {
            setLoading(false);
        }
    };

    const deleteTransaction = async (id) => {
        if (!window.confirm("Delete this entry?")) return;
        try {
            await API.delete(`/transactions/${id}`);
            fetchTransactions();
        } catch (err) {
            alert("Error deleting transaction");
        }
    };

    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense;

    return (
        <div className="min-h-screen py-10 px-4">
            <div className="max-w-xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Ledger</h1>
                    <button
                        onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
                        className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium">Balance</p>
                        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
                            RM {balance.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium">Income</p>
                        <p className="text-2xl font-bold text-green-600">+ RM {income.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500 font-medium">Expense</p>
                        <p className="text-2xl font-bold text-orange-600">- RM {expense.toFixed(2)}</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-50 mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Transaction</h3>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                            <input
                                type="text"
                                placeholder="e.g. Sale of Popia Nestum"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Amount (RM)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Transaction Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm bg-white"
                            >
                                <option value="income">Income (+)</option>
                                <option value="expense">Expense (-)</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg active:transform active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Add Transaction'}
                        </button>
                    </form>
                </div>

                {/* History List */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700 px-1">Recent Activity</h3>
                    {transactions.length === 0 && <p className="text-gray-400 text-center py-4">No transactions yet.</p>}
                    {transactions.map((t) => (
                        <div
                            key={t._id}
                            className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border-l-4 transition-all hover:shadow-md"
                            style={{ borderLeftColor: t.type === 'income' ? '#10b981' : '#f97316' }}
                        >
                            <div>
                                <p className="font-semibold text-gray-800">{t.text}</p>
                                <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-orange-600'}`}>
                                    {t.type === 'income' ? '+' : '-'} RM {t.amount.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => deleteTransaction(t._id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors text-xl leading-none"
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;