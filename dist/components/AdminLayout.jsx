"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminLayout;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const AuthContext_1 = require("@/contexts/AuthContext");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
function AdminLayout({ children }) {
    const [isSidebarOpen, setSidebarOpen] = (0, react_1.useState)(true);
    const { user, logout } = (0, AuthContext_1.useAuth)();
    const location = (0, react_router_dom_1.useLocation)();
    const navItems = [
        {
            title: "Dashboard",
            path: "/admin/dashboard",
            icon: <lucide_react_1.LayoutDashboard className="h-5 w-5"/>
        },
        {
            title: "Services",
            path: "/admin/services",
            icon: <lucide_react_1.Wrench className="h-5 w-5"/>
        },
        {
            title: "Bookings",
            path: "/admin/bookings",
            icon: <lucide_react_1.Calendar className="h-5 w-5"/>
        },
        {
            title: "Customers",
            path: "/admin/customers",
            icon: <lucide_react_1.Users className="h-5 w-5"/>
        },
        {
            title: "Content",
            path: "/admin/content",
            icon: <lucide_react_1.FileText className="h-5 w-5"/>,
            submenu: [
                { title: "Blog", path: "/admin/content/blog", icon: <lucide_react_1.FileText className="h-5 w-5"/> },
                { title: "Gallery", path: "/admin/content/gallery", icon: <lucide_react_1.Image className="h-5 w-5"/> },
                { title: "Testimonials", path: "/admin/content/testimonials", icon: <lucide_react_1.MessageSquare className="h-5 w-5"/> },
                { title: "FAQs", path: "/admin/content/faqs", icon: <lucide_react_1.HelpCircle className="h-5 w-5"/> }
            ]
        },
        {
            title: "Inventory",
            path: "/admin/inventory",
            icon: <lucide_react_1.Package className="h-5 w-5"/>
        },
        {
            title: "Reviews",
            path: "/admin/reviews",
            icon: <lucide_react_1.Star className="h-5 w-5"/>
        },
        {
            title: "Settings",
            path: "/admin/settings",
            icon: <lucide_react_1.Settings className="h-5 w-5"/>
        }
    ];
    return (<div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-200 w-64`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-primary">Admin Portal</h1>
          <button_1.Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <lucide_react_1.X className="h-5 w-5"/>
          </button_1.Button>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (<div key={item.path}>
              {item.submenu ? (<dropdown_menu_1.DropdownMenu>
                  <dropdown_menu_1.DropdownMenuTrigger asChild>
                    <button_1.Button variant="ghost" className="w-full justify-between">
                      <span className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </span>
                      <lucide_react_1.ChevronDown className="h-4 w-4"/>
                    </button_1.Button>
                  </dropdown_menu_1.DropdownMenuTrigger>
                  <dropdown_menu_1.DropdownMenuContent className="w-56" align="start" side="right">
                    {item.submenu.map((subItem) => (<dropdown_menu_1.DropdownMenuItem key={subItem.path} asChild>
                        <react_router_dom_1.Link to={subItem.path} className="flex items-center">
                          {subItem.icon}
                          <span className="ml-2">{subItem.title}</span>
                        </react_router_dom_1.Link>
                      </dropdown_menu_1.DropdownMenuItem>))}
                  </dropdown_menu_1.DropdownMenuContent>
                </dropdown_menu_1.DropdownMenu>) : (<react_router_dom_1.Link to={item.path} className={`flex items-center px-4 py-2 rounded-lg transition-colors ${location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'}`}>
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </react_router_dom_1.Link>)}
            </div>))}
        </nav>
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-margin ${isSidebarOpen ? 'ml-64' : 'ml-0'} md:ml-64`}>
        <div className="p-4 pt-6">
          {/* Header */}
          <header className="bg-white p-4 mb-6 rounded-lg shadow-sm flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-xl font-semibold text-gray-800">
              {(() => {
            const pathSegment = location.pathname.split('/').pop() || '';
            return pathSegment
                ? pathSegment.charAt(0).toUpperCase() + pathSegment.slice(1)
                : 'Dashboard';
        })()}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-primary">
                <lucide_react_1.Bell className="h-5 w-5"/>
              </button>
              <dropdown_menu_1.DropdownMenu>
                <dropdown_menu_1.DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary">
                    <lucide_react_1.UserCircle className="h-6 w-6"/>
                    <span>{user?.fullName || 'Admin'}</span>
                    <lucide_react_1.ChevronDown className="h-4 w-4"/>
                  </button>
                </dropdown_menu_1.DropdownMenuTrigger>
                <dropdown_menu_1.DropdownMenuContent align="end">
                  <dropdown_menu_1.DropdownMenuLabel>My Account</dropdown_menu_1.DropdownMenuLabel>
                  <dropdown_menu_1.DropdownMenuSeparator />
                  <dropdown_menu_1.DropdownMenuItem>
                    <react_router_dom_1.Link to="/admin/settings" className="flex items-center w-full">
                      <lucide_react_1.Settings className="mr-2 h-4 w-4"/>
                      <span>Settings</span>
                    </react_router_dom_1.Link>
                  </dropdown_menu_1.DropdownMenuItem>
                  <dropdown_menu_1.DropdownMenuItem onClick={logout}>
                    <lucide_react_1.LogOut className="mr-2 h-4 w-4"/>
                    <span>Logout</span>
                  </dropdown_menu_1.DropdownMenuItem>
                </dropdown_menu_1.DropdownMenuContent>
              </dropdown_menu_1.DropdownMenu>
            </div>
          </header>
          {children}
        </div>
      </main>

      {/* Mobile menu button */}
      {!isSidebarOpen && (<button className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <lucide_react_1.Menu className="h-6 w-6 text-primary"/>
        </button>)}
    </div>);
}
//# sourceMappingURL=AdminLayout.jsx.map