"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GalleryManagement;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
function GalleryManagement() {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const galleryItems = [
        {
            id: "GA001",
            title: "Complete Body Restoration",
            description: "Full restoration of a vintage car including panel beating and respraying",
            category: "Restoration",
            type: 'before-after',
            beforeImage: "https://images.unsplash.com/photo-1589739900266-43b2843f4c12",
            afterImage: "https://images.unsplash.com/photo-1596883040737-6d38c9e905b0",
            uploadDate: "2024-03-01",
            views: 1250
        },
        {
            id: "GA002",
            title: "Custom Paint Job",
            description: "Premium metallic paint finish with custom design",
            category: "Paint Work",
            type: 'showcase',
            image: "https://images.unsplash.com/photo-1611566026373-c6c8da0ea861",
            uploadDate: "2024-03-15",
            views: 890
        }
    ];
    return (<div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <button_1.Button>
          <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
          Add Images
        </button_1.Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Images</p>
              <h3 className="text-2xl font-bold">156</h3>
            </div>
            <lucide_react_1.Image className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Before/After Sets</p>
              <h3 className="text-2xl font-bold">48</h3>
            </div>
            <lucide_react_1.Upload className="h-8 w-8 text-green-500"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <h3 className="text-2xl font-bold">25.6K</h3>
            </div>
            <lucide_react_1.Eye className="h-8 w-8 text-orange-500"/>
          </div>
        </card_1.Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input_1.Input placeholder="Search gallery..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full"/>
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

      {/* Gallery Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {galleryItems.map((item) => (<card_1.Card key={item.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <badge_1.Badge>{item.category}</badge_1.Badge>
              </div>

              {item.type === 'before-after' ? (<div className="grid grid-cols-2 gap-4">
                  <div className="relative aspect-video">
                    <img src={item.beforeImage} alt="Before" className="rounded-lg object-cover w-full h-full"/>
                    <div className="absolute top-2 left-2">
                      <badge_1.Badge variant="secondary">Before</badge_1.Badge>
                    </div>
                  </div>
                  <div className="relative aspect-video">
                    <img src={item.afterImage} alt="After" className="rounded-lg object-cover w-full h-full"/>
                    <div className="absolute top-2 left-2">
                      <badge_1.Badge variant="secondary">After</badge_1.Badge>
                    </div>
                  </div>
                </div>) : (<div className="relative aspect-video">
                  <img src={item.image} alt={item.title} className="rounded-lg object-cover w-full h-full"/>
                </div>)}

              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <lucide_react_1.Calendar className="h-4 w-4 mr-1"/>
                    {new Date(item.uploadDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <lucide_react_1.Eye className="h-4 w-4 mr-1"/>
                    {item.views.toLocaleString()} views
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
                  <button_1.Button variant="outline" size="sm">
                    <lucide_react_1.MoreVertical className="h-4 w-4"/>
                  </button_1.Button>
                </div>
              </div>
            </div>
          </card_1.Card>))}
      </div>
    </div>);
}
//# sourceMappingURL=GalleryManagement.jsx.map