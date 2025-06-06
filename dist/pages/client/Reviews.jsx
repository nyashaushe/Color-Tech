"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const dialog_1 = require("@/components/ui/dialog");
const textarea_1 = require("@/components/ui/textarea");
const use_toast_1 = require("@/components/ui/use-toast");
const select_1 = require("@/components/ui/select");
const reviewService_1 = require("@/services/reviewService");
const serviceService_1 = require("@/services/serviceService");
const ClientReviews = () => {
    const { toast } = (0, use_toast_1.useToast)();
    const [reviews, setReviews] = (0, react_1.useState)([]);
    const [services, setServices] = (0, react_1.useState)([]);
    const [editingReview, setEditingReview] = (0, react_1.useState)(null);
    const [selectedService, setSelectedService] = (0, react_1.useState)(null);
    const [rating, setRating] = (0, react_1.useState)(5);
    const [comment, setComment] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [isDialogOpen, setIsDialogOpen] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        fetchReviews();
        fetchServices();
    }, []);
    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const data = await (0, reviewService_1.getMyReviews)();
            setReviews(data);
        }
        catch (error) {
            console.error('Error fetching reviews:', error);
            toast({
                title: "Error",
                description: "Failed to load your reviews. Please try again.",
                variant: "destructive",
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const fetchServices = async () => {
        try {
            const data = await (0, serviceService_1.getAllServices)();
            setServices(data);
        }
        catch (error) {
            console.error('Error fetching services:', error);
            toast({
                title: "Error",
                description: "Failed to load services. Please try again.",
                variant: "destructive",
            });
        }
    };
    const handleCreateReview = async (e) => {
        e.preventDefault();
        if (!selectedService) {
            toast({
                title: "Error",
                description: "Please select a service to review",
                variant: "destructive",
            });
            return;
        }
        setIsSubmitting(true);
        const reviewData = {
            serviceId: selectedService,
            rating,
            comment,
        };
        try {
            const newReview = await (0, reviewService_1.createReview)(reviewData);
            setReviews([...reviews, newReview]);
            setIsDialogOpen(false);
            resetForm();
            toast({
                title: "Success",
                description: "Your review has been submitted",
            });
        }
        catch (error) {
            console.error('Error creating review:', error);
            toast({
                title: "Error",
                description: "Failed to submit your review. Please try again.",
                variant: "destructive",
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleUpdateReview = async (e) => {
        e.preventDefault();
        if (!editingReview)
            return;
        setIsSubmitting(true);
        const reviewData = {
            rating,
            comment,
        };
        try {
            const updatedReview = await (0, reviewService_1.updateReview)(editingReview.id, reviewData);
            setReviews(reviews.map(review => review.id === updatedReview.id ? updatedReview : review));
            setIsDialogOpen(false);
            resetForm();
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
    const handleDeleteReview = async (id) => {
        if (!confirm('Are you sure you want to delete this review?'))
            return;
        try {
            await (0, reviewService_1.deleteReview)(id);
            setReviews(reviews.filter(review => review.id !== id));
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
        setRating(review.rating);
        setComment(review.comment);
        setIsDialogOpen(true);
    };
    const resetForm = () => {
        setEditingReview(null);
        setSelectedService(null);
        setRating(5);
        setComment('');
    };
    const renderStars = (count) => {
        return Array(5).fill(0).map((_, i) => (<lucide_react_1.Star key={i} className={`h-5 w-5 ${i < count ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}/>));
    };
    return (<div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <dialog_1.Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open)
                resetForm();
        }}>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button>Write a Review</button_1.Button>
          </dialog_1.DialogTrigger>
          <dialog_1.DialogContent className="sm:max-w-[500px]">
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>
                {editingReview ? 'Edit Your Review' : 'Write a Review'}
              </dialog_1.DialogTitle>
            </dialog_1.DialogHeader>
            <form onSubmit={editingReview ? handleUpdateReview : handleCreateReview} className="space-y-4">
              {!editingReview && (<div className="space-y-2">
                  <label className="text-sm font-medium">Select Service</label>
                  <select_1.Select value={selectedService || ''} onValueChange={setSelectedService}>
                    <select_1.SelectTrigger>
                      <select_1.SelectValue placeholder="Select a service"/>
                    </select_1.SelectTrigger>
                    <select_1.SelectContent>
                      {services.map(service => (<select_1.SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </select_1.SelectItem>))}
                    </select_1.SelectContent>
                  </select_1.Select>
                </div>)}
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (<button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                      <lucide_react_1.Star className={`h-6 w-6 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}/>
                    </button>))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Review</label>
                <textarea_1.Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience with this service..." rows={4} required/>
              </div>
              
              <div className="flex justify-end gap-2">
                <button_1.Button type="button" variant="outline" onClick={() => {
            setIsDialogOpen(false);
            resetForm();
        }}>
                  Cancel
                </button_1.Button>
                <button_1.Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <lucide_react_1.Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </button_1.Button>
              </div>
            </form>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>
      </div>

      {isLoading ? (<div className="flex justify-center items-center h-64">
          <lucide_react_1.Loader2 className="h-8 w-8 animate-spin text-primary"/>
        </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (<card_1.Card key={review.id} className="p-6">
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{review.serviceName || 'Service'}</h3>
                <div className="flex gap-2">
                  <button_1.Button variant="ghost" size="icon" onClick={() => openEditDialog(review)}>
                    <lucide_react_1.Edit2 className="h-4 w-4"/>
                  </button_1.Button>
                  <button_1.Button variant="ghost" size="icon" onClick={() => handleDeleteReview(review.id)}>
                    <lucide_react_1.Trash2 className="h-4 w-4 text-destructive"/>
                  </button_1.Button>
                </div>
              </div>
              
              <div className="flex items-center mt-2">
                {renderStars(review.rating)}
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(review.date || review.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="mt-4 text-gray-700">{review.comment}</p>
              
              {review.status === 'pending' && (<div className="mt-2 text-sm text-amber-600">
                  Pending approval
                </div>)}
            </card_1.Card>))}
          
          {reviews.length === 0 && (<div className="col-span-full text-center py-12">
              <p className="text-gray-500">You haven't written any reviews yet. Share your experience with our services!</p>
            </div>)}
        </div>)}
    </div>);
};
exports.default = ClientReviews;
//# sourceMappingURL=Reviews.jsx.map