"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InventoryManagement;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
function InventoryManagement() {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const inventory = [
        {
            id: "INV001",
            name: "Premium Car Paint - Red",
            category: "Paint",
            quantity: 50,
            threshold: 20,
            supplier: "AutoPaint Pro",
            status: 'in-stock',
            lastOrdered: "2024-03-01",
            price: 89.99
        },
        {
            id: "INV002",
            name: "Body Filler - Standard",
            category: "Body Materials",
            quantity: 15,
            threshold: 25,
            supplier: "Auto Body Supply Co",
            status: 'low-stock',
            lastOrdered: "2024-02-15",
            price: 45.50
        },
        {
            id: "INV003",
            name: "Clear Coat - Premium",
            category: "Paint",
            quantity: 0,
            threshold: 10,
            supplier: "AutoPaint Pro",
            status: 'out-of-stock',
            lastOrdered: "2024-01-30",
            price: 129.99
        }
    ];
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'in-stock':
                return 'default';
            case 'low-stock':
                return 'secondary';
            case 'out-of-stock':
                return 'destructive';
            default:
                return 'default';
        }
    };
    return (<div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <button_1.Button>
          <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
          Add Item
        </button_1.Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <h3 className="text-2xl font-bold">65</h3>
            </div>
            <lucide_react_1.Package className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
            <lucide_react_1.AlertCircle className="h-8 w-8 text-orange-500"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <h3 className="text-2xl font-bold">3</h3>
            </div>
            <lucide_react_1.AlertCircle className="h-8 w-8 text-red-500"/>
          </div>
        </card_1.Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input_1.Input placeholder="Search inventory..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full"/>
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

      {/* Inventory Grid */}
      <div className="grid gap-6">
        {inventory.map((item) => (<card_1.Card key={item.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <badge_1.Badge variant={getStatusBadgeVariant(item.status)}>
                    {item.status}
                  </badge_1.Badge>
                </div>
                <p className="text-gray-600 mt-1">Category: {item.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-500">Threshold: {item.threshold}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Supplier</p>
                <p>{item.supplier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Ordered</p>
                <p>{new Date(item.lastOrdered).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p>${item.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button_1.Button variant="outline" size="sm">
                <lucide_react_1.ShoppingCart className="h-4 w-4 mr-2"/>
                Order
              </button_1.Button>
              <button_1.Button variant="outline" size="sm">
                <lucide_react_1.Edit className="h-4 w-4 mr-2"/>
                Edit
              </button_1.Button>
              <button_1.Button variant="outline" size="sm">
                <lucide_react_1.History className="h-4 w-4 mr-2"/>
                History
              </button_1.Button>
            </div>
          </card_1.Card>))}
      </div>
    </div>);
}
//# sourceMappingURL=InventoryManagement.jsx.map