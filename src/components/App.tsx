import React from 'react'

import posts from '../top.json'

function App() {
  const selectedPost = posts.data.children[0]

  return (
    <div>
      <section>
        <h1>Reddit Posts</h1>
        <ul>
          {posts.data.children.map((post) => (
            <li key={post.data.id}>
              <button type="button">
                <p>Author: {post.data.author}</p>
                <p>Created: {post.data.created}</p>
                {post.data.thumbnail && (
                  <img src={post.data.thumbnail} alt="" />
                )}
                <p>{post.data.title}</p>
                <p>ID: {post.data.id}</p>
                <p>Comments: {post.data.num_comments}</p>
                <p>URL: {post.data.url}</p>
                <p>Clicked: {post.data.clicked ? 'Yes' : 'No'}</p>
                <p>Visited: {post.data.visited ? 'Yes' : 'No'}</p>
                <p>Visited: {post.data.visited ? 'Yes' : 'No'}</p>
              </button>
            </li>
          ))}
        </ul>
        <button type="button">Dismiss All</button>
      </section>
      <main>
        <h1>{selectedPost.data.author}</h1>
        <p>Created: {selectedPost.data.created}</p>
        {selectedPost.data.thumbnail && (
          <img src={selectedPost.data.thumbnail} alt="" />
        )}
        <p>{selectedPost.data.title}</p>
        <a
          target="_blank"
          href={selectedPost.data.url}
          rel="noreferrer noopener"
        >
          {selectedPost.data.url}
        </a>
      </main>
    </div>
  )
}

export default App
