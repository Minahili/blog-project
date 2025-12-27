"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string | null;
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/blogs");
      const data: Blog[] = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const submitBlog = async () => {
    if (!title || !content || !image) return alert("All fields required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    try {
      await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        body: formData,
      });
      setTitle("");
      setContent("");
      setImage(null);
      fetchBlogs();
    } catch (err) {
      console.error("Error adding blog:", err);
    }
  };

  const deleteBlog = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "DELETE",
      });
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h3 className="text-2xl font-bold text-black-600 mb-4">Dynamic BLOGS:</h3>
      {/* Add Blog Form */}
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
                src={`http://localhost:5000/uploads/${blog.image}`}
                className="mt-2 rounded"
                width="150"
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
