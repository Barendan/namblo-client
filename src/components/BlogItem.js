import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Container, TextArea, Confirm, Button, Card, Form } from 'semantic-ui-react';

import { GET_BLOG_POST, REMOVE_BLOG, UPDATE_BLOG } from '../graphql/postsResolver';
import { AuthContext } from '../context/authContext';


const BlogItem = () => {
    const { id } = useParams();
    const { isLoading, data: blog } =  useQuery(GET_BLOG_POST, { variables: { id: id } });
    const [blogRemove] = useMutation(REMOVE_BLOG,{ refetchQueries: ['GetBlogPosts'] });
    const [blogUpdate, { data, loading, error }] = useMutation(UPDATE_BLOG);
    
    const [editActive, setEditActive] = useState(false);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState(false);
    const { user } = useContext(AuthContext);


    const navigate = useNavigate();
    
    const handleDelete = () => {
        blogRemove({
            variables: { id },
        });
        navigate('/');
    }

    const handleUpdate = () => {
        setEditActive(true);
        setTitle(blog?.getPost.title)
        setBody(blog?.getPost.body)
        setStatus(blog?.getPost.status)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const blog = { title, body, status };
        
        blogUpdate(
            {variables: { id,
                "title": blog.title,
                "body": blog.body,
                "status": blog.status
            }}
        );
        
        setEditActive(false);
    }
 
    return (
        <div className="blog-details">
            {isLoading && <div>Loading...</div>}

            { editActive && user ? (
                <div>
                    <p className="main-header">Edit your post</p>
                    <div className="form-container">
                        <Form onSubmit={handleSubmit}>

                            <Form.Field>
                                <label>Post Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder='Enter a title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    />
                            </Form.Field>

                            <Form.Field 
                                label='Status' 
                                control='select'
                                defaultValue={status}
                                onChange={(e) => setStatus(!!e.target.value)}
                            >
                                <option value=''>Draft</option>
                                <option value='true'>Publish</option>
                            </Form.Field>

                            <Form.TextArea 
                                label='Post Content' 
                                placeholder='Write your heart out...' 
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                            />


                            <Button size="huge" onClick={() => setEditActive(false)}>
                                Back
                            </Button>

                            { !loading && <Button color="green" size="huge" type="submit">
                                Update Post
                            </Button> }

                            { loading && <Button disabled color="green" size="huge" type="submit">
                                Updating Post
                            </Button> }
                        </Form>
                    </div>
                </div>
            ) :
            blog?.getPost && (
                <div>
                    <div className="main-header">Nifty Shifty Blog!</div>

                    <Container text className="post-container">
                        <h1 className="card-header">{blog.getPost.title}</h1>
                        <i>{blog.getPost.createdAt}</i>
                        
                        <TextArea className="post-body" value={blog.getPost.body} />
                    </Container>

                    { user ? (
                        <div>
                            <Button size="huge" onClick={() => navigate('/')}>
                                Back
                            </Button>
                            <Button size="huge" color="green" onClick={() => handleUpdate()}>
                                Edit
                            </Button>
                            <Button size="huge" color="red" onClick={() => setOpen(true)}> 
                                Delete
                            </Button>
                        </div>
                    ) : (
                        <Button size="huge" onClick={() => navigate('/')}>
                            Back
                        </Button>
                    )}

                    <Confirm
                        open={open}
                        content='Are you sure you want to delete this post?'
                        cancelButton='Nevermind'
                        confirmButton="Delete it"
                        onCancel={() => setOpen(false)}
                        onConfirm={handleDelete}
                    />

                </div>
            )}

        </div>
    );
}
 
export default BlogItem;