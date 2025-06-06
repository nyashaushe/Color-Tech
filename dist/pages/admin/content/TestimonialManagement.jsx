"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestimonialManagement;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
function TestimonialManagement() {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const testimonials = [
        {
            id: "T001",
            name: "John Smith",
            role: "Business Owner",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
            quote: "The quality of work is outstanding. My fleet vehicles have never looked better!",
            rating: 5,
            status: 'approved',
            date: "2024-03-01",
            source: 'website'
        },
        {
            id: "T002",
            name: "Sarah Johnson",
            role: "Customer",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
            quote: "Professional service from start to finish. They transformed my car completely.",
            rating: 5,
            status: 'pending',
            date: "2024-03-15",
            source: 'google'
        }
    ];
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'approved':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'rejected':
                return 'destructive';
            default:
                return 'default';
        }
    };
    return (<div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Testimonial Management</h1>
        <button_1.Button>
          <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
          Add Testimonial
        </button_1.Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>
              <h3 className="text-2xl font-bold">48</h3>
            </div>
            <lucide_react_1.MessageSquare className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <h3 className="text-2xl font-bold">36</h3>
            </div>
            <lucide_react_1.CheckCircle className="h-8 w-8 text-green-500"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
            <lucide_react_1.MessageSquare className="h-8 w-8 text-orange-500"/>
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
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input_1.Input placeholder="Search testimonials..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full"/>
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

      {/* Testimonials Grid */}
      <div className="grid gap-6">
        {testimonials.map((testimonial) => (<card_1.Card key={testimonial.id} className="p-6">
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                      <badge_1.Badge variant={getStatusBadgeVariant(testimonial.status)}>
                        {testimonial.status}
                      </badge_1.Badge>
                      <badge_1.Badge variant="outline">{testimonial.source}</badge_1.Badge>
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <lucide_react_1.User className="h-4 w-4 mr-1"/>
                    {testimonial.role}
                  </div>
                  <div className="flex items-center">
                    <lucide_react_1.Calendar className="h-4 w-4 mr-1"/>
                    {new Date(testimonial.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (<lucide_react_1.Star key={i} className="h-4 w-4 text-yellow-400 fill-current"/>))}
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  {testimonial.status === 'pending' && (<>
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
                    Edit
                  </button_1.Button>
                  <button_1.Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                    <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
                    Delete
                  </button_1.Button>
                </div>
              </div>
            </div>
          </card_1.Card>))}
      </div>
    </div>);
}
//# sourceMappingURL=TestimonialManagement.jsx.map