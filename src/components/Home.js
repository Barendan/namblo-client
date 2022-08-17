import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { GET_BLOG_POSTS } from '../graphql/postsResolver';
import BlogList from './BlogList.js';

const Home = () => {
  const { data: blogs, isPending, error } = useQuery(GET_BLOG_POSTS);
  const navigate = useNavigate();

  return (
    <div className="Home">
      <div className="main-header"> Nifty Shifty Blog!</div>
      { isPending && <div> Loading... </div> }
      { blogs && (
        <div>
          <BlogList blogs={blogs} />
          <hr/><br/>
          <Button 
            primary
            // color="orange"
            size="huge" 
            onClick={() => navigate('/newblog') }
          >Post New Blog </Button>
        </div>
      )}
    </div>

  )
}

export default Home;