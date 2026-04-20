import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dbService } from '../../services/dbService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { MapPin, Calendar, Plus, Palmtree } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTripData, setNewTripData] = useState({ destination: '', startDate: '', endDate: '', budget: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const userTrips = await dbService.getTrips(user.id);
      setTrips(userTrips);
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const trip = await dbService.createTrip(user.id, {
        destination: newTripData.destination,
        startDate: newTripData.startDate,
        endDate: newTripData.endDate,
        budget: parseFloat(newTripData.budget) || 0,
      });
      setIsModalOpen(false);
      setNewTripData({ destination: '', startDate: '', endDate: '', budget: '' });
      navigate(`/trip/${trip.id}`);
    } catch (error) {
      console.error("Failed to create trip", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Trips</h1>
          <p className="text-gray-500 mt-1">Manage your upcoming adventures and past memories.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2">
          <Plus size={20} />
          <span>Plan New Trip</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        </div>
      ) : trips.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-orange-500 mb-4">
            <Palmtree size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No trips planned yet</h2>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">Your next adventure is waiting. Start planning your dream vacation now!</p>
          <Button onClick={() => setIsModalOpen(true)}>Create First Trip</Button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {trips.map(trip => (
            <motion.div key={trip.id} variants={itemVariants}>
              <Card 
                hover 
                onClick={() => navigate(`/trip/${trip.id}`)}
                className="overflow-hidden group"
              >
                {/* Visual Header */}
                <div className="h-32 bg-gradient-to-br from-orange-400 to-red-500 relative">
                  <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/0"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold drop-shadow-md">{trip.destination}</h3>
                  </div>
                </div>
                
                {/* Details */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar size={16} className="text-orange-500" />
                    <span>
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm">
                      <span className="text-gray-400 block mb-0.5">Budget</span>
                      <span className="font-semibold text-gray-700">${trip.budget}</span>
                    </div>
                    <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-xs font-medium">
                      View Details
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Trip Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Plan a New Trip">
        <form onSubmit={handleCreateTrip} className="space-y-4">
          <Input 
            label="Destination" 
            placeholder="e.g. Paris, France" 
            value={newTripData.destination}
            onChange={e => setNewTripData({...newTripData, destination: e.target.value})}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Start Date" 
              type="date" 
              value={newTripData.startDate}
              onChange={e => setNewTripData({...newTripData, startDate: e.target.value})}
              required
            />
            <Input 
              label="End Date" 
              type="date" 
              value={newTripData.endDate}
              onChange={e => setNewTripData({...newTripData, endDate: e.target.value})}
              required
            />
          </div>
          <Input 
            label="Total Budget ($)" 
            type="number" 
            placeholder="2500" 
            min="0"
            value={newTripData.budget}
            onChange={e => setNewTripData({...newTripData, budget: e.target.value})}
            required
          />
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
            <Button type="button" variant="text" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
