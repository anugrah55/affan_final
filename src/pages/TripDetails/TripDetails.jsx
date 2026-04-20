import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from '../../services/dbService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, DollarSign, ArrowLeft, Trash2, Plus, ListTodo, Wallet } from 'lucide-react';

export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('itinerary');

  // Input states
  const [newItem, setNewItem] = useState({ date: '', title: '', description: '' });
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: '' });

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const data = await dbService.getTripById(tripId);
      setTrip(data);
    } catch (error) {
      console.error(error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  // Derived State Optimization Example
  const totalExpenses = useMemo(() => {
    if (!trip?.expenses) return 0;
    return trip.expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  }, [trip?.expenses]);

  const handleAddItinerary = async (e) => {
    e.preventDefault();
    await dbService.addItineraryItem(trip.id, newItem);
    setNewItem({ date: '', title: '', description: '' });
    fetchTrip();
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    await dbService.addExpense(trip.id, newExpense);
    setNewExpense({ title: '', amount: '', category: '' });
    fetchTrip();
  };

  const handleDeleteExpense = async (id) => {
    await dbService.deleteExpense(trip.id, id);
    fetchTrip();
  };

  const handleDeleteItinerary = async (id) => {
    await dbService.deleteItineraryItem(trip.id, id);
    fetchTrip();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="w-full">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> <span>Back to Dashboard</span>
      </button>

      {/* Header Overview Card */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white mb-8 border-none shadow-xl shadow-orange-900/10">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{trip.destination}</h1>
          <div className="flex flex-wrap gap-6 mt-4 opacity-90">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={18} />
              <span>Budget: ${trip.budget}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-8 pb-4">
        {[
          { id: 'itinerary', label: 'Itinerary', icon: ListTodo },
          { id: 'budget', label: 'Budget & Expenses', icon: Wallet }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
              activeTab === tab.id 
              ? 'bg-orange-50 text-orange-600' 
              : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <motion.div 
            key="itinerary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-4">
              {trip.itinerary && trip.itinerary.length > 0 ? (
                // Grouping by date could go here, but a list is simple and requested
                trip.itinerary.sort((a,b) => new Date(a.date) - new Date(b.date)).map((item) => (
                  <Card key={item.id} className="p-5 flex justify-between group">
                    <div className="flex gap-4">
                      <div className="bg-orange-50 text-orange-600 w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0">
                        <span className="text-sm font-bold">{new Date(item.date).getDate()}</span>
                        <span className="text-xs font-medium uppercase">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteItinerary(item.id)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Card>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <ListTodo className="mx-auto mb-3 opacity-20" size={32} />
                  No itinerary items planned yet.
                </div>
              )}
            </div>

            {/* Add Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Add Activity</h3>
                <form onSubmit={handleAddItinerary} className="space-y-4">
                  <Input 
                    type="date" 
                    label="Date" 
                    value={newItem.date} 
                    onChange={e => setNewItem({...newItem, date: e.target.value})} 
                    required 
                  />
                  <Input 
                    type="text" 
                    label="Activity Title" 
                    placeholder="e.g., Louvre Museum" 
                    value={newItem.title} 
                    onChange={e => setNewItem({...newItem, title: e.target.value})} 
                    required 
                  />
                  <Input 
                    type="text" 
                    label="Description (Optional)" 
                    placeholder="Tickets booked at 10 AM" 
                    value={newItem.description} 
                    onChange={e => setNewItem({...newItem, description: e.target.value})} 
                  />
                  <Button type="submit" className="w-full mt-2">Add to plan</Button>
                </form>
              </Card>
            </div>
          </motion.div>
        )}

        {/* BUDGET TAB */}
        {activeTab === 'budget' && (
          <motion.div 
            key="budget"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              {/* Progress Summary */}
              <Card className="p-6">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium mb-1">Budget</p>
                    <p className="text-lg font-semibold text-gray-500">${trip.budget}</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalExpenses / trip.budget) * 100, 100)}%` }}
                    className={`h-full rounded-full ${totalExpenses > trip.budget ? 'bg-red-500' : 'bg-green-500'}`}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                {totalExpenses > trip.budget && (
                  <p className="text-sm text-red-500 mt-2 font-medium">You are over budget by ${(totalExpenses - trip.budget).toFixed(2)}!</p>
                )}
              </Card>

              {/* Expense List */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-900">Expenses</h3>
                {trip.expenses && trip.expenses.length > 0 ? (
                  trip.expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <DollarSign size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{expense.title}</p>
                          <p className="text-xs text-gray-400">{expense.category || 'Uncategorized'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-700">${parseFloat(expense.amount).toFixed(2)}</span>
                        <button 
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    No expenses logged yet.
                  </div>
                )}
              </div>
            </div>

            {/* Add Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Add Expense</h3>
                <form onSubmit={handleAddExpense} className="space-y-4">
                  <Input 
                    type="text" 
                    label="What did you pay for?" 
                    placeholder="e.g., Dinner at bistro" 
                    value={newExpense.title} 
                    onChange={e => setNewExpense({...newExpense, title: e.target.value})} 
                    required 
                  />
                  <Input 
                    type="number" 
                    label="Amount ($)" 
                    placeholder="45.50" 
                    min="0"
                    step="0.01"
                    value={newExpense.amount} 
                    onChange={e => setNewExpense({...newExpense, amount: e.target.value})} 
                    required 
                  />
                  <Input 
                    type="text" 
                    label="Category (Optional)" 
                    placeholder="e.g., Food, Transport" 
                    value={newExpense.category} 
                    onChange={e => setNewExpense({...newExpense, category: e.target.value})} 
                  />
                  <Button type="submit" className="w-full mt-2">Add Expense</Button>
                </form>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
