"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServiceManagement;
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
function ServiceManagement() {
    const services = [
        {
            id: "SV001",
            name: "Panel Beating",
            description: "Professional panel beating service for all vehicle types",
            duration: "2-3 hours",
            capacity: 4,
            rating: 4.7,
            status: 'active',
            bookingCount: 156
        },
        // Add more services
    ];
    return (<div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Service Management</h1>
        <button_1.Button>Add New Service</button_1.Button>
      </div>

      <div className="grid gap-6">
        {services.map((service) => (<card_1.Card key={service.id} className="p-6">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <badge_1.Badge variant={service.status === 'active' ? 'success' : 'secondary'}>
                    {service.status}
                  </badge_1.Badge>
                </div>
                <p className="text-gray-600 mt-1">{service.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <lucide_react_1.Clock className="w-4 h-4 text-gray-500"/>
                <span>{service.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <lucide_react_1.Users className="w-4 h-4 text-gray-500"/>
                <span>Capacity: {service.capacity}</span>
              </div>
              <div className="flex items-center space-x-2">
                <lucide_react_1.Star className="w-4 h-4 text-yellow-400"/>
                <span>{service.rating} Rating</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button_1.Button variant="outline" size="sm">Edit Service</button_1.Button>
              <button_1.Button variant="outline" size="sm">View Bookings</button_1.Button>
              <button_1.Button variant="outline" size="sm">Service Analytics</button_1.Button>
            </div>
          </card_1.Card>))}
      </div>
    </div>);
}
//# sourceMappingURL=ServiceManagement.jsx.map