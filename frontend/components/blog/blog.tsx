"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trash2, 
  ImagePlus, 
  Loader2, 
  RefreshCw, 
  Edit, 
  X, 
  Eye, 
  Calendar,
  ArrowLeft
} from "lucide-react";
import axios from "axios";

interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [viewingBlog, setViewingBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchBlogs = async () => {
    try {
      setFetchLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}/api/blogs`);
      setBlogs(res.data.data || res.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  };

  const submitBlog = async () => {
    if (!title || !content) {
      setError("Title and content are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);
      setError(null);
      
      if (editMode && editingId) {
        await axios.put(`${API_URL}/api/blogs/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Blog updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/blogs`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Blog created successfully!");
      }
      
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
      setError(`Failed to ${editMode ? 'update' : 'create'} blog. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`${API_URL}/api/blogs/${id}`);
      setSuccess("Blog deleted successfully!");
      fetchBlogs();
      if (viewingBlog?.id === id) {
        setViewMode(false);
        setViewingBlog(null);
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError("Failed to delete blog. Please try again.");
    }
  };

  const startEdit = (blog: Blog) => {
    setEditMode(true);
    setEditingId(blog.id);
    setTitle(blog.title);
    setContent(blog.content);
    if (blog.image) {
      setImagePreview(`${API_URL}/uploads/${blog.image}`);
    }
    setViewMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewBlog = (blog: Blog) => {
    setViewingBlog(blog);
    setViewMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImage(null);
    setImagePreview(null);
    setEditMode(false);
    setEditingId(null);
  };

  const cancelEdit = () => {
    resetForm();
    setViewMode(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-4 md:p-8 py-8 md:py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-in fade-in duration-700">
            Modern Blog Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl">
            Create, share, and explore amazing stories
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg text-red-700 dark:text-red-400 animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg text-green-700 dark:text-green-400 animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between">
              <span>{success}</span>
              <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* View Blog Detail */}
        {viewMode && viewingBlog ? (
          <div className="mb-12 animate-in fade-in duration-500">
            <Button
              variant="outline"
              onClick={() => setViewMode(false)}
              className="mb-6 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Posts
            </Button>

            <Card className="shadow-2xl border-0 bg-white dark:bg-gray-800 overflow-hidden">
              {viewingBlog.image && (
                <div className="relative h-64 md:h-96 w-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-gray-600">
                  <img
                    src={`${API_URL}/uploads/${viewingBlog.image}`}
                    alt={viewingBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(viewingBlog.createdAt)}</span>
                  {viewingBlog.updatedAt !== viewingBlog.createdAt && (
                    <span className="text-xs">(Updated: {formatDate(viewingBlog.updatedAt)})</span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  {viewingBlog.title}
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                    {viewingBlog.content}
                  </p>
                </div>

                <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => startEdit(viewingBlog)}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Post
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteBlog(viewingBlog.id)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Create/Edit Form */}
            <Card className="mb-12 shadow-2xl border-0 bg-white dark:bg-gray-800 animate-in fade-in duration-500">
              <CardContent className="p-6 md:p-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                    {editMode ? "Edit Post" : "Create New Post"}
                  </h2>
                  {editMode && (
                    <Button variant="ghost" onClick={cancelEdit} className="gap-2">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <Input
                      placeholder="Enter an amazing title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-lg h-12 border-2 focus:border-purple-500"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Content *
                    </label>
                    <Textarea
                      placeholder="Write your story..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={8}
                      className="text-base border-2 focus:border-purple-500"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Cover Image {!editMode && "(Optional)"}
                    </label>
                    <div className="flex flex-col md:flex-row gap-4">
                      <label className="flex-1 cursor-pointer group">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all duration-300 text-center">
                          <ImagePlus className="mx-auto h-12 w-12 text-gray-400 group-hover:text-purple-500 mb-3 transition-colors" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 block">
                            Click to upload image
                          </span>
                          <span className="text-xs text-gray-400 mt-1 block">
                            PNG, JPG up to 10MB
                          </span>
                          <Input
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                            disabled={loading}
                          />
                        </div>
                      </label>
                      {imagePreview && (
                        <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-700 shadow-lg">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => {
                              setImage(null);
                              setImagePreview(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={submitBlog}
                    className="w-full text-lg py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {editMode ? "Updating..." : "Publishing..."}
                      </>
                    ) : (
                      <span>{editMode ? "Update Post" : "Publish Post"}</span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blog List */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                All Posts
              </h2>
              <Button
                variant="outline"
                onClick={fetchBlogs}
                disabled={fetchLoading}
                className="gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <RefreshCw className={`h-4 w-4 ${fetchLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {fetchLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse overflow-hidden">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <Card className="text-center p-16 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardContent>
                  <div className="text-gray-400 dark:text-gray-600 mb-6">
                    <svg
                      className="mx-auto h-24 w-24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                    No posts yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Be the first to create an amazing blog post!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
                {blogs.map((blog, index) => (
                  <Card
                    key={blog.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 hover:scale-[1.02] cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div onClick={() => viewBlog(blog)}>
                      {blog.image ? (
                        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-gray-600">
                          <img
                            src={`${API_URL}/uploads/${blog.image}`}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Eye className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-6xl font-bold text-white opacity-50">
                            {blog.title.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div onClick={() => viewBlog(blog)} className="cursor-pointer">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white leading-tight mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {blog.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm">
                          {blog.content}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(blog);
                            }}
                            className="gap-1 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteBlog(blog.id);
                            }}
                            className="gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
