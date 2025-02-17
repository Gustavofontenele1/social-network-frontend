import React from "react";
interface Post {
  id: string; 
  content: string;
  author: string;
  createdAt: string;
}

interface PostFeedProps {
  posts: Post[];
}

const PostFeed: React.FC<PostFeedProps> = ({ posts }) => {
  return (
    <div className="post-feed">
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h3>{post.author}</h3>
          <p>{post.content}</p>
          <small>{post.createdAt}</small>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
