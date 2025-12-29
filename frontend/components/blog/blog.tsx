"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/blogs`);
      
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const submitBlog = async () => {
    if (!title || !content || !image) {
      alert("All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    try {
      await axios.post(`${API_URL}/api/blogs`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTitle("");
      setContent("");
      setImage(null);
      fetchBlogs();
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };

  const deleteBlog = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h3 className="text-2xl font-bold mb-4">Dynamic Blogs</h3>

      {/* Add Blog */}
      <Card className="p-4">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Content"
          className="mt-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Input type="file" className="mt-2" onChange={handleFileChange} />
        <Button className="mt-2 w-full" onClick={submitBlog}>
          Add Blog
        </Button>
      </Card>

      {/* Blog List */}
      {blogs.map((blog) => (
        <Card key={blog.id} className="mt-4">
          <CardContent className="p-4">
            <h2 className="font-bold">{blog.title}</h2>
            <p>{blog.content}</p>

            {blog.image && (
              <img
                src={`${API_URL}/uploads/${blog.image}`}
                className="mt-2 rounded"
                width={150}
                alt="blog"
              />
            )}

            <Button
              variant="destructive"
              className="mt-2"
              onClick={() => deleteBlog(blog.id)}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
