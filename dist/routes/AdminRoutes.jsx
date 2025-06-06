"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminRoutes;
const react_router_dom_1 = require("react-router-dom");
const AdminLayout_1 = __importDefault(require("@/components/AdminLayout"));
const Dashboard_1 = __importDefault(require("@/pages/admin/Dashboard"));
const ServiceManagement_1 = __importDefault(require("@/pages/admin/ServiceManagement"));
const CustomerManagement_1 = __importDefault(require("@/pages/admin/CustomerManagement"));
const ContentManagement_1 = __importDefault(require("@/pages/admin/content/ContentManagement"));
const BlogManagement_1 = __importDefault(require("@/pages/admin/content/BlogManagement"));
const GalleryManagement_1 = __importDefault(require("@/pages/admin/content/GalleryManagement"));
const TestimonialManagement_1 = __importDefault(require("@/pages/admin/content/TestimonialManagement"));
const FaqManagement_1 = __importDefault(require("@/pages/admin/content/FaqManagement"));
const BookingManagement_1 = __importDefault(require("@/pages/admin/BookingManagement"));
const InventoryManagement_1 = __importDefault(require("@/pages/admin/InventoryManagement"));
const ReviewManagement_1 = __importDefault(require("@/pages/admin/ReviewManagement"));
function AdminRoutes() {
    return (<AdminLayout_1.default>
      <react_router_dom_1.Routes>
        <react_router_dom_1.Route path="dashboard" element={<Dashboard_1.default />}/>
        <react_router_dom_1.Route path="services" element={<ServiceManagement_1.default />}/>
        <react_router_dom_1.Route path="customers" element={<CustomerManagement_1.default />}/>
        
        {/* Content Management Routes */}
        <react_router_dom_1.Route path="content" element={<ContentManagement_1.default />}/>
        <react_router_dom_1.Route path="content/blog" element={<BlogManagement_1.default />}/>
        <react_router_dom_1.Route path="content/gallery" element={<GalleryManagement_1.default />}/>
        <react_router_dom_1.Route path="content/testimonials" element={<TestimonialManagement_1.default />}/>
        <react_router_dom_1.Route path="content/faqs" element={<FaqManagement_1.default />}/>
        
        {/* Other Management Routes */}
        <react_router_dom_1.Route path="bookings" element={<BookingManagement_1.default />}/>
        <react_router_dom_1.Route path="inventory" element={<InventoryManagement_1.default />}/>
        <react_router_dom_1.Route path="reviews" element={<ReviewManagement_1.default />}/>
      </react_router_dom_1.Routes>
    </AdminLayout_1.default>);
}
//# sourceMappingURL=AdminRoutes.jsx.map