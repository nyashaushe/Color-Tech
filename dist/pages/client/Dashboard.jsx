"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const ProgressTracker_1 = __importDefault(require("@/components/ProgressTracker"));
const AuthContext_1 = require("@/contexts/AuthContext");
const dialog_1 = require("@/components/ui/dialog");
const textarea_1 = require("@/components/ui/textarea");
const use_toast_1 = require("@/components/ui/use-toast");
const bookingService_1 = require("@/services/bookingService");
const reviewService_1 = require("@/services/reviewService");
const ClientDashboard = () => {
    const { user } = (0, AuthContext_1.useAuth)();
    const { toast } = (0, use_toast_1.useToast)();
    const [bookings, setBookings] = (0, react_1.useState)([]);
    const [reviews, setReviews] = (0, react_1.useState)([]);
    const [editingReview, setEditingReview] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [isDialogOpen, setIsDialogOpen] = (0, react_1.useState)(false);
    const [newComment, setNewComment] = (0, react_1.useState)("");
    const firstName = user?.fullName.split(' ')[0];
    (0, react_1.useEffect)(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch bookings and reviews in parallel
            const [bookingsData, reviewsData] = await Promise.all([
                (0, bookingService_1.getMyBookings)(),
                (0, reviewService_1.getMyReviews)()
            ]);
            setBookings(bookingsData);
            setReviews(reviewsData);
        }
        catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast({
                title: "Error",
                description: "Failed to load your dashboard data. Please try again.",
                variant: "destructive",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCancelBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to cancel this booking?'))
            return;
        try {
            const updatedBooking = await (0, bookingService_1.cancelBooking)(bookingId);
            setBookings(bookings.map(booking => booking.id === updatedBooking.id ? updatedBooking : booking));
            toast({
                title: "Success",
                description: "Your booking has been cancelled",
            });
        }
        catch (error) {
            console.error('Error cancelling booking:', error);
            toast({
                title: "Error",
                description: "Failed to cancel your booking. Please try again.",
                variant: "destructive",
            });
        }
    };
    const handleUpdateReview = async (e) => {
        e.preventDefault();
        if (!editingReview)
            return;
        setIsSubmitting(true);
        const reviewData = {
            comment: newComment,
        };
        try {
            const updatedReview = await (0, reviewService_1.updateReview)(editingReview.id, reviewData);
            setReviews(reviews.map(review => review.id === updatedReview.id ? updatedReview : review));
            setIsDialogOpen(false);
            setEditingReview(null);
            setNewComment("");
            toast({
                title: "Success",
                description: "Your review has been updated",
            });
        }
        catch (error) {
            console.error('Error updating review:', error);
            toast({
                title: "Error",
                description: "Failed to update your review. Please try again.",
                variant: "destructive",
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDeleteReview = async (reviewId) => {
        if (!confirm('Are you sure you want to delete this review?'))
            return;
        try {
            await (0, reviewService_1.deleteReview)(reviewId);
            setReviews(reviews.filter(review => review.id !== reviewId));
            toast({
                title: "Success",
                description: "Your review has been deleted",
            });
        }
        catch (error) {
            console.error('Error deleting review:', error);
            toast({
                title: "Error",
                description: "Failed to delete your review. Please try again.",
                variant: "destructive",
            });
        }
    };
    const openEditDialog = (review) => {
        setEditingReview(review);
        setNewComment(review.comment);
        setIsDialogOpen(true);
    };
    // Get the most recent active booking for the progress tracker
    const activeBooking = bookings.find(booking => booking.status === 'confirmed' || booking.status === 'in_progress');
    // Mock repair stages based on the active booking
    const repairStages = activeBooking ? [
        {
            id: 1,
            title: "Vehicle Check-in",
            description: "Initial inspection and documentation",
            status: "completed",
            date: new Date(activeBooking.createdAt).toISOString().split('T')[0]
        },
        {
            id: 2,
            title: "Damage Assessment",
            description: "Detailed evaluation of required work",
            status: "completed",
            date: new Date(new Date(activeBooking.createdAt).getTime() + 86400000).toISOString().split('T')[0]
        },
        {
            id: 3,
            title: "Repair in Progress",
            description: "Work being performed on your vehicle",
            status: activeBooking.status === 'in_progress' ? "in-progress" : "pending",
            date: activeBooking.status === 'in_progress' ?
                new Date(new Date(activeBooking.updatedAt).getTime()).toISOString().split('T')[0] : undefined
        },
        {
            id: 4,
            title: "Quality Check",
            description: "Final inspection before delivery",
            status: "pending"
        },
        {
            id: 5,
            title: "Ready for Pickup",
            description: "Your vehicle is ready",
            status: "pending"
        }
    ] : [];
    // Calculate current stage based on the active booking status
    const currentStage = activeBooking ?
        (activeBooking.status === 'in_progress' ? 3 : 2) : 1;
    const renderStars = (count) => {
        return Array(5).fill(0).map((_, i) => (<lucide_react_1.Star key={i} className={`h-4 w-4 ${i < count ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}/>));
    };
    if (isLoading) {
        return (<div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-primary"/>
        </div>
      </div>);
    }
    return (<div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {firstName}!</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Repair Progress */}
          {activeBooking ? (<card_1.Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Current Repair Progress</h2>
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <lucide_react_1.Wrench className="mr-2 h-4 w-4"/>
                  <span>Service: {activeBooking.serviceName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <lucide_react_1.Calendar className="mr-2 h-4 w-4"/>
                  <span>Scheduled: {new Date(activeBooking.scheduledDate).toLocaleDateString()} at {activeBooking.scheduledTime}</span>
                </div>
              </div>
              <ProgressTracker_1.default stages={repairStages} currentStage={currentStage}/>
            </card_1.Card>) : (<card_1.Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">No Active Repairs</h2>
              <p className="text-gray-500">You don't have any active repairs at the moment.</p>
              <button_1.Button className="mt-4" variant="outline" onClick={() => window.location.href = '/booking'}>
                Schedule a Service
              </button_1.Button>
            </card_1.Card>)}

          {/* Recent Bookings */}
          <card_1.Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Bookings</h2>
              <button_1.Button variant="outline" size="sm" onClick={() => window.location.href = '/client/bookings'}>
                View All
              </button_1.Button>
            </div>
            
            {bookings.length > 0 ? (<div className="space-y-4">
                {bookings.slice(0, 3).map((booking) => (<div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{booking.serviceName}</h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <lucide_react_1.Calendar className="mr-2 h-4 w-4"/>
                      <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                      <lucide_react_1.Clock className="ml-4 mr-2 h-4 w-4"/>
                      <span>{booking.scheduledTime}</span>
                    </div>
                    {booking.status === 'pending' && (<button_1.Button variant="outline" size="sm" className="mt-2 text-red-600 hover:text-red-700" onClick={() => handleCancelBooking(booking.id)}>
                        Cancel Booking
                      </button_1.Button>)}
                  </div>))}
              </div>) : (<p className="text-gray-500">You don't have any bookings yet.</p>)}
          </card_1.Card>
        </div>
        
        {/* Sidebar - 1/3 width on large screens */}
        <div className="space-y-6">
          {/* Your Reviews */}
          <card_1.Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Reviews</h2>
              <button_1.Button variant="outline" size="sm" onClick={() => window.location.href = '/client/reviews'}>
                View All
              </button_1.Button>
            </div>
            
            {reviews.length > 0 ? (<div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (<div key={review.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{review.serviceName}</h3>
                      <div className="flex space-x-1">
                        <button_1.Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditDialog(review)}>
                          <lucide_react_1.Edit2 className="h-3 w-3"/>
                        </button_1.Button>
                        <button_1.Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteReview(review.id)}>
                          <lucide_react_1.Trash2 className="h-3 w-3 text-destructive"/>
                        </button_1.Button>
                      </div>
                    </div>
                    <div className="flex items-center mt-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-xs text-gray-500">
                        {new Date(review.date || review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                  </div>))}
              </div>) : (<p className="text-gray-500">You haven't written any reviews yet.</p>)}
          </card_1.Card>
          
          {/* Quick Links */}
          <card_1.Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <div className="space-y-2">
              <button_1.Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/booking'}>
                <lucide_react_1.Calendar className="mr-2 h-4 w-4"/>
                Schedule a Service
              </button_1.Button>
              <button_1.Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/client/history'}>
                <lucide_react_1.History className="mr-2 h-4 w-4"/>
                Service History
              </button_1.Button>
              <button_1.Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/client/profile'}>
                <lucide_react_1.User className="mr-2 h-4 w-4"/>
                Update Profile
              </button_1.Button>
            </div>
          </card_1.Card>
        </div>
      </div>
      
      {/* Edit Review Dialog */}
      <dialog_1.Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <dialog_1.DialogContent className="sm:max-w-[500px]">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Edit Your Review</dialog_1.DialogTitle>
          </dialog_1.DialogHeader>
          <form onSubmit={handleUpdateReview} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Review</label>
              <textarea_1.Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your experience with this service..." rows={4} required/>
            </div>
            
            <div className="flex justify-end gap-2">
              <button_1.Button type="button" variant="outline" onClick={() => {
            setIsDialogOpen(false);
            setEditingReview(null);
        }}>
                Cancel
              </button_1.Button>
              <button_1.Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Update Review
              </button_1.Button>
            </div>
          </form>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
};
exports.default = ClientDashboard;
//# sourceMappingURL=Dashboard.jsx.map