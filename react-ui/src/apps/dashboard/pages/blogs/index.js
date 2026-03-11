import React from 'react'
import { Link } from 'react-router-dom'

const Blogs = () => {
    return (
        <div>
            <h1>List blog posts</h1>
            <Link to="/blogs/post/1"><h3>About Page</h3></Link>
            <Link to="/blogs/post">Create New Posts</Link>
        </div>
    )
}

export default Blogs
