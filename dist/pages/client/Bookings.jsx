"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const ClientBookings = () => {
    return (<div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      <div className="grid gap-6">
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <lucide_react_1.Car className="w-8 h-8 text-secondary"/>
              <div>
                <h3 className="font-semibold">Panel Beating Service</h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <lucide_react_1.Calendar className="w-4 h-4"/>
                  <span>March 15, 2024</span>
                  <lucide_react_1.Clock className="w-4 h-4"/>
                  <span>10:00 AM</span>
                </div>
              </div>
            </div>
            <button_1.Button variant="outline">View Details</button_1.Button>
          </div>
        </card_1.Card>
      </div>

      <button_1.Button className="mt-6">Book New Service</button_1.Button>
    </div>);
};
exports.default = ClientBookings;
//# sourceMappingURL=Bookings.jsx.map