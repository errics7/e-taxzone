import React from 'react'
import { useParams } from 'react-router-dom'

const DetailPost = () => {
    let {postId} = useParams()
    return (
        <div>
            <h1>Detail post {postId}</h1>
        </div>
    )
}

export default DetailPost
