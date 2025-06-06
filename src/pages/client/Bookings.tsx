import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Car, Loader2 } from "lucide-react";
import { getMyBookings, Booking } from '@/services/bookingService';
import { useToast } from '@/components/ui/use-toast';

const ClientBookings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load your bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewBooking = () => {
    console.log('Navigating to new booking page');
    navigate('/client/new-booking');
  };

  const handleViewDetails = (bookingId: string) => {
    console.log('Viewing booking details:', bookingId);
    navigate(`/client/bookings/${bookingId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Car className="w-8 h-8 text-secondary" />
                  <div>
                    <h3 className="font-semibold">{booking.serviceName || 'Service'}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                      <Clock className="w-4 h-4" />
                      <span>{booking.scheduledTime}</span>
                    </div>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        booking.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleViewDetails(booking.id)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-6">You don't have any bookings yet.</p>
        </div>
      )}

      <Button 
        className="mt-6" 
        onClick={handleNewBooking}
      >
        Book New Service
      </Button>
    </div>
  );
};

export default ClientBookings; 