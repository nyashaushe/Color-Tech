"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BookingManagement;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
function BookingManagement() {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const bookings = [
        {
            id: "BK001",
            customerName: "John Smith",
            service: "Panel Beating",
            vehicleInfo: {
                make: "Toyota",
                model: "Camry",
                year: "2020",
                color: "Silver"
            },
            date: "2024-03-20",
            time: "09:00",
            status: 'confirmed',
            estimatedDuration: "3 hours",
            assignedStaff: "Mike Wilson"
        },
        {
            id: "BK002",
            customerName: "Sarah Johnson",
            service: "Spray Painting",
            vehicleInfo: {
                make: "BMW",
                model: "3 Series",
                year: "2022",
                color: "Blue"
            },
            date: "2024-03-21",
            time: "14:00",
            status: 'pending',
            notes: "Customer requested metallic finish",
            estimatedDuration: "4 hours"
        }
    ];
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'confirmed':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'completed':
                return 'outline';
            case 'cancelled':
                return 'destructive';
            default:
                return 'default';
        }
    };
    return (<div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <button_1.Button>
          <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
          New Booking
        </button_1.Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Bookings</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
            <lucide_react_1.Calendar className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold">5</h3>
            </div>
            <lucide_react_1.AlertCircle className="h-8 w-8 text-orange-500"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
            <lucide_react_1.CheckCircle className="h-8 w-8 text-green-500"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed Today</p>
              <h3 className="text-2xl font-bold">6</h3>
            </div>
            <lucide_react_1.CheckCircle className="h-8 w-8 text-blue-500"/>
          </div>
        </card_1.Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input_1.Input placeholder="Search bookings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full"/>
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

      {/* Bookings Grid */}
      <div className="grid gap-6">
        {bookings.map((booking) => (<card_1.Card key={booking.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-semibold">{booking.customerName}</h3>
                  <badge_1.Badge variant={getStatusBadgeVariant(booking.status)}>
                    {booking.status}
                  </badge_1.Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium">{booking.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-medium">
                      {booking.vehicleInfo.make} {booking.vehicleInfo.model} ({booking.vehicleInfo.year})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">
                      {new Date(booking.date).toLocaleDateString()} {booking.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{booking.estimatedDuration}</p>
                  </div>
                </div>
                {booking.notes && (<p className="text-sm text-gray-600 mt-2">
                    Notes: {booking.notes}
                  </p>)}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {booking.assignedStaff && (<div className="flex items-center">
                    <lucide_react_1.User className="h-4 w-4 mr-1"/>
                    {booking.assignedStaff}
                  </div>)}
              </div>

              <div className="flex space-x-2">
                {booking.status === 'pending' && (<>
                    <button_1.Button variant="outline" size="sm" className="text-green-500">
                      <lucide_react_1.CheckCircle className="h-4 w-4 mr-2"/>
                      Confirm
                    </button_1.Button>
                    <button_1.Button variant="outline" size="sm" className="text-red-500">
                      <lucide_react_1.XCircle className="h-4 w-4 mr-2"/>
                      Cancel
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
          </card_1.Card>))}
      </div>
    </div>);
}
//# sourceMappingURL=BookingManagement.jsx.map