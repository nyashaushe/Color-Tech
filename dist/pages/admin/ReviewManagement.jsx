"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReviewManagement;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
function ReviewManagement() {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const reviews = [
        {
            id: "RV001",
            customerName: "John Smith",
            rating: 5,
            comment: "Excellent service! The team did an amazing job with my car's paint job. Very professional and attention to detail.",
            service: "Spray Painting",
            date: "2024-03-15",
            status: 'published',
            helpful: 12,
            source: 'website'
        },
        {
            id: "RV002",
            customerName: "Sarah Johnson",
            rating: 4,
            comment: "Good work on the panel beating. Quick turnaround time and reasonable prices.",
            service: "Panel Beating",
            date: "2024-03-14",
            status: 'pending',
            helpful: 5,
            source: 'google'
        },
        {
            id: "RV003",
            customerName: "Mike Wilson",
            rating: 2,
            comment: "Service was delayed by two days.",
            service: "Dent Removal",
            date: "2024-03-13",
            status: 'flagged',
            helpful: 1,
            response: "We apologize for the delay. We've implemented new scheduling measures to prevent this in the future.",
            source: 'facebook'
        }
    ];
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'published':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'flagged':
                return 'destructive';
            case 'archived':
                return 'outline';
            default:
                return 'default';
        }
    };
    return (<div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Review Management</h1>
        <button_1.Button>
          <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
          Add Review
        </button_1.Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>
              <h3 className="text-2xl font-bold">156</h3>
            </div>
            <lucide_react_1.MessageSquare className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <h3 className="text-2xl font-bold">4.8</h3>
            </div>
            <lucide_react_1.Star className="h-8 w-8 text-yellow-400 fill-current"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
            <lucide_react_1.AlertCircle className="h-8 w-8 text-orange-500"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Flagged</p>
              <h3 className="text-2xl font-bold">2</h3>
            </div>
            <lucide_react_1.Flag className="h-8 w-8 text-red-500"/>
          </div>
        </card_1.Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input_1.Input placeholder="Search reviews..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full"/>
        </div>
        <button_1.Button variant="outline">
          <lucide_react_1.Filter className="h-4 w-4 mr-2"/>
          Filter
        </button_1.Button>
        <button_1.Button variant="outline">
          <lucide_react_1.ArrowUpDown className="h-4 w-4 mr-2"/>
          Sort
        </button_1.Button>
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-6">
        {reviews.map((review) => (<card_1.Card key={review.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold">{review.customerName}</h3>
                    <badge_1.Badge variant={getStatusBadgeVariant(review.status)}>
                      {review.status}
                    </badge_1.Badge>
                    <badge_1.Badge variant="outline">{review.source}</badge_1.Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (<lucide_react_1.Star key={i} className={`h-4 w-4 ${i < review.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'}`}/>))}
                    </div>
                    <div className="flex items-center">
                      <lucide_react_1.Calendar className="h-4 w-4 mr-1"/>
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                    <div>Service: {review.service}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <lucide_react_1.ThumbsUp className="h-4 w-4 text-gray-500"/>
                  <span className="text-sm text-gray-500">{review.helpful}</span>
                </div>
              </div>

              <div>
                <p className="text-gray-600">{review.comment}</p>
                {review.response && (<div className="mt-3 pl-4 border-l-2 border-primary">
                    <p className="text-sm text-gray-500">Response:</p>
                    <p className="text-gray-600">{review.response}</p>
                  </div>)}
              </div>

              <div className="flex justify-end space-x-2">
                {review.status === 'pending' && (<>
                    <button_1.Button variant="outline" size="sm" className="text-green-500">
                      <lucide_react_1.CheckCircle className="h-4 w-4 mr-2"/>
                      Approve
                    </button_1.Button>
                    <button_1.Button variant="outline" size="sm" className="text-red-500">
                      <lucide_react_1.XCircle className="h-4 w-4 mr-2"/>
                      Reject
                    </button_1.Button>
                  </>)}
                <button_1.Button variant="outline" size="sm">
                  <lucide_react_1.Edit className="h-4 w-4 mr-2"/>
                  Respond
                </button_1.Button>
                <button_1.Button variant="outline" size="sm">
                  <lucide_react_1.Flag className="h-4 w-4 mr-2"/>
                  Flag
                </button_1.Button>
                <button_1.Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                  <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
                  Delete
                </button_1.Button>
              </div>
            </div>
          </card_1.Card>))}
      </div>
    </div>);
}
//# sourceMappingURL=ReviewManagement.jsx.map