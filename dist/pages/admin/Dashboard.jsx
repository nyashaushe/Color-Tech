"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const AuthContext_1 = require("@/contexts/AuthContext");
const AdminDashboard = () => {
    const { user } = (0, AuthContext_1.useAuth)();
    const firstName = user?.fullName.split(' ')[0];
    const [serviceRequests, setServiceRequests] = (0, react_1.useState)([
        {
            id: "SR001",
            customerName: "John Doe",
            service: "Panel Beating",
            status: "in-progress",
            date: "2024-03-15",
            priority: "high"
        },
        // Add more mock data
    ]);
    const stats = {
        totalCustomers: 156,
        activeBookings: 24,
        revenue: 15679,
        pendingRequests: 12,
        completedServices: 89,
        averageRating: 4.8
    };
    return (<div className="ml-47 p-8 bg-gray-50 max-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening in your admin portal today
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <select className="border rounded-md p-2">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <card_1.Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <h3 className="text-2xl font-bold">{stats.totalCustomers}</h3>
              </div>
              <lucide_react_1.Users className="h-8 w-8 text-primary"/>
            </div>
          </card_1.Card>

          <card_1.Card className="p-6 bg-gradient-to-br from-secondary/10 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Bookings</p>
                <h3 className="text-2xl font-bold">{stats.activeBookings}</h3>
              </div>
              <lucide_react_1.Calendar className="h-8 w-8 text-secondary"/>
            </div>
          </card_1.Card>

          <card_1.Card className="p-6 bg-gradient-to-br from-green-100 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Services</p>
                <h3 className="text-2xl font-bold">{stats.completedServices}</h3>
              </div>
              <lucide_react_1.CheckCircle className="h-8 w-8 text-green-600"/>
            </div>
          </card_1.Card>

          <card_1.Card className="p-6 bg-gradient-to-br from-blue-100 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <h3 className="text-2xl font-bold">{stats.averageRating}</h3>
              </div>
              <lucide_react_1.Star className="h-8 w-8 text-blue-600"/>
            </div>
          </card_1.Card>
        </div>

        {/* Activity Feed and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <card_1.Card className="col-span-2 p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {/* Activity items */}
            </div>
          </card_1.Card>

          <card_1.Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2">
                <lucide_react_1.Wrench className="w-4 h-4"/>
                Add New Service
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2">
                <lucide_react_1.Calendar className="w-4 h-4"/>
                View Schedule
              </button>
            </div>
          </card_1.Card>
        </div>
      </div>
    </div>);
};
exports.default = AdminDashboard;
//# sourceMappingURL=Dashboard.jsx.map