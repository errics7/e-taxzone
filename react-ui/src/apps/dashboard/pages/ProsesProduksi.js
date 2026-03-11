import React, {useState, useEffect} from 'react'
import { Helmet } from "react-helmet";
import axios from "axios"
import NavHeader from "../../virtualtour360/components/NavigasiTop"
import {
    Container,
    Button,
    Box,
    Typography
} from '@mui/material'
import CreateIcon from '@mui/icons-material/Create'
import { Link } from 'react-router-dom'
import API from '../../../utils/host.config'

const ProsesProduksi = () => {
    const [blog, setBlog] = useState(null)
    
    const contentBlog = async () => {
        const response = await axios(`${API.HOST}/api/v1/blog/proses-produksi`);
        return response.data.data
    };


    useEffect(() => {
        try{
            contentBlog().then((item) => {
                setBlog(item)
            }).catch(err => {
                console.error(err)
            })
        } catch(err) {
            console.error(err)
        }
    }, [])

    return (
        <>
            <Helmet>
                <title>Blog</title>
            </Helmet>
            <NavHeader />
            <Container maxWidth="md">
                {blog === null ?
                    <Box style={{minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Box>
                            <Typography variant="h5" gutterBottom>There are no articles yet, please create one first!</Typography>
                            <Link to="/b/proses-produksi">
                                <Button startIcon={<CreateIcon />} variant="contained" color="primary">Create New Artikel</Button>
                            </Link>
                        </Box>
                    </Box> :
                    <Box>
                        <div className={`min-h-3/4 mb-4x mt-3`} dangerouslySetInnerHTML={{__html: blog.content}}></div>
                    </Box>
                }
                
            </Container>
        </>
    )
}

export default ProsesProduksi
