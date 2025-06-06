"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const ClientProfile = () => {
    return (<div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <card_1.Card className="max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <lucide_react_1.User className="w-12 h-12 text-secondary"/>
            <div>
              <h2 className="text-2xl font-semibold">John Doe</h2>
              <p className="text-gray-600">Client since 2023</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <lucide_react_1.Mail className="w-5 h-5 text-gray-500"/>
              <span>john.doe@example.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <lucide_react_1.Phone className="w-5 h-5 text-gray-500"/>
              <span>+263 77 123 4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <lucide_react_1.MapPin className="w-5 h-5 text-gray-500"/>
              <span>123 Sample Street, Harare</span>
            </div>
          </div>

          <button_1.Button className="w-full">Edit Profile</button_1.Button>
        </div>
      </card_1.Card>
    </div>);
};
exports.default = ClientProfile;
//# sourceMappingURL=Profile.jsx.map