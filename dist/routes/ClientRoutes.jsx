"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClientRoutes;
const react_router_dom_1 = require("react-router-dom");
const ClientLayout_1 = __importDefault(require("@/components/ClientLayout"));
const Dashboard_1 = __importDefault(require("@/pages/client/Dashboard"));
const Bookings_1 = __importDefault(require("@/pages/client/Bookings"));
const History_1 = __importDefault(require("@/pages/client/History"));
const Reviews_1 = __importDefault(require("@/pages/client/Reviews"));
const Profile_1 = __importDefault(require("@/pages/client/Profile"));
function ClientRoutes() {
    return (<ClientLayout_1.default>
      <react_router_dom_1.Routes>
        <react_router_dom_1.Route path="dashboard" element={<Dashboard_1.default />}/>
        <react_router_dom_1.Route path="bookings" element={<Bookings_1.default />}/>
        <react_router_dom_1.Route path="history" element={<History_1.default />}/>
        <react_router_dom_1.Route path="reviews" element={<Reviews_1.default />}/>
        <react_router_dom_1.Route path="profile" element={<Profile_1.default />}/>
      </react_router_dom_1.Routes>
    </ClientLayout_1.default>);
}
//# sourceMappingURL=ClientRoutes.jsx.map