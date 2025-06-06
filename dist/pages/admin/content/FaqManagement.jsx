"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FaqManagement;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
function FaqManagement() {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [expandedFaq, setExpandedFaq] = (0, react_1.useState)(null);
    const faqs = [
        {
            id: "FAQ001",
            question: "How long does a typical panel beating job take?",
            answer: "The duration of a panel beating job depends on the extent of damage. Minor repairs can be completed in 1-2 days, while major repairs might take 5-7 working days. We provide a detailed timeline during the initial assessment.",
            category: "Services",
            status: 'published',
            lastUpdated: "2024-03-01",
            views: 1250
        },
        {
            id: "FAQ002",
            question: "Do you provide color matching services?",
            answer: "Yes, we use advanced computerized color matching technology to ensure your vehicle's new paint perfectly matches the existing color. Our system can match any manufacturer's color code with precision.",
            category: "Paint Work",
            status: 'draft',
            lastUpdated: "2024-03-15",
            views: 890
        }
    ];
    const toggleExpand = (id) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };
    return (<div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">FAQ Management</h1>
        <button_1.Button>
          <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
          Add FAQ
        </button_1.Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total FAQs</p>
              <h3 className="text-2xl font-bold">32</h3>
            </div>
            <lucide_react_1.HelpCircle className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <h3 className="text-2xl font-bold">28</h3>
            </div>
            <lucide_react_1.Eye className="h-8 w-8 text-green-500"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <h3 className="text-2xl font-bold">15.2K</h3>
            </div>
            <lucide_react_1.Eye className="h-8 w-8 text-orange-500"/>
          </div>
        </card_1.Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input_1.Input placeholder="Search FAQs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full"/>
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

      {/* FAQ Grid */}
      <div className="grid gap-6">
        {faqs.map((faq) => (<card_1.Card key={faq.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <button_1.Button variant="ghost" size="sm" className="p-0 hover:bg-transparent" onClick={() => toggleExpand(faq.id)}>
                      {expandedFaq === faq.id ? (<lucide_react_1.ChevronUp className="h-5 w-5"/>) : (<lucide_react_1.ChevronDown className="h-5 w-5"/>)}
                    </button_1.Button>
                    <h3 className="text-xl font-semibold">{faq.question}</h3>
                    <badge_1.Badge variant={faq.status === 'published' ? 'default' : 'secondary'}>
                      {faq.status}
                    </badge_1.Badge>
                    <badge_1.Badge variant="outline">{faq.category}</badge_1.Badge>
                  </div>
                  {expandedFaq === faq.id && (<p className="text-gray-600 mt-2 pl-7">{faq.answer}</p>)}
                </div>
              </div>

              <div className="flex justify-between items-center pl-7">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <lucide_react_1.Calendar className="h-4 w-4 mr-1"/>
                    {new Date(faq.lastUpdated).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <lucide_react_1.Eye className="h-4 w-4 mr-1"/>
                    {faq.views.toLocaleString()} views
                  </div>
                </div>

                <div className="flex space-x-2">
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
//# sourceMappingURL=FaqManagement.jsx.map