"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlogManagement;
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const input_1 = require("@/components/ui/input");
const lucide_react_1 = require("lucide-react");
const useData_1 = require("@/hooks/useData");
const contentService_1 = require("@/services/contentService");
function BlogManagement() {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const { data: posts, loading, error, refetch } = (0, useData_1.useData)(() => contentService_1.contentService.getBlogPosts(), []);
    const handleDelete = async (id) => {
        try {
            await contentService_1.contentService.deleteBlogPost(id);
            refetch();
        }
        catch (error) {
            console.error('Failed to delete post:', error);
        }
    };
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'published':
                return 'default';
            case 'draft':
                return 'secondary';
            case 'archived':
                return 'outline';
            default:
                return 'default';
        }
    };
    return (<div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <button_1.Button>
          <lucide_react_1.Plus className="h-4 w-4 mr-2"/>
          New Post
        </button_1.Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Posts</p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
            <lucide_react_1.FileText className="h-8 w-8 text-primary"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <h3 className="text-2xl font-bold">18</h3>
            </div>
            <lucide_react_1.Eye className="h-8 w-8 text-green-500"/>
          </div>
        </card_1.Card>
        <card_1.Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Drafts</p>
              <h3 className="text-2xl font-bold">6</h3>
            </div>
            <lucide_react_1.Edit className="h-8 w-8 text-orange-500"/>
          </div>
        </card_1.Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input_1.Input placeholder="Search blog posts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full"/>
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

      {/* Blog Posts Grid */}
      <div className="grid gap-6">
        {posts?.map((post) => (<card_1.Card key={post.id} className="p-6">
            <div className="flex gap-6">
              <div className="w-48 h-32 rounded-lg overflow-hidden">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      <badge_1.Badge variant={getStatusBadgeVariant(post.status)}>
                        {post.status}
                      </badge_1.Badge>
                    </div>
                    <p className="text-gray-600">{post.excerpt}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <lucide_react_1.User className="h-4 w-4 mr-1"/>
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <lucide_react_1.Calendar className="h-4 w-4 mr-1"/>
                    {new Date(post.publishDate).toLocaleDateString()}
                  </div>
                  <div>{post.readTime} read</div>
                  <div>Category: {post.category}</div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button_1.Button variant="outline" size="sm">
                    <lucide_react_1.Eye className="h-4 w-4 mr-2"/>
                    Preview
                  </button_1.Button>
                  <button_1.Button variant="outline" size="sm">
                    <lucide_react_1.Edit className="h-4 w-4 mr-2"/>
                    Edit
                  </button_1.Button>
                  <button_1.Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(post.id)}>
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
//# sourceMappingURL=BlogManagement.jsx.map