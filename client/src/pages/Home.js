import React from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";
import PostCard from "../components/PostCard";

function Home() {
	const { loading, data: { getPosts: posts } = {} } = useQuery(
		FETCH_POSTS_QUERY
	);

	return (
		<Grid columns={3}>
			<Grid.Row className="page-title">
				<h1>Ostatnie wpisy</h1>
			</Grid.Row>
			<Grid.Row>
				{loading ? (
					<h1>Ładowanie wpisów...</h1>
				) : (
					posts &&
					posts.map((post) => (
						<Grid.Column key={post.id} style={{ marginBottom: 40 }}>
							<PostCard post={post} />
						</Grid.Column>
					))
				)}
			</Grid.Row>
		</Grid>
	);
}

const FETCH_POSTS_QUERY = gql`
	{
		getPosts {
			id
			body
			comments {
				id
				username
			}
			likeCount
			commentCount
			createdAt
			username
		}
	}
`;

export default Home;
