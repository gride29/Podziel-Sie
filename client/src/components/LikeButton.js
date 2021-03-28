import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button, Label, Icon, Popup } from 'semantic-ui-react';

function LikeButton({ user, post: { id, likeCount, likes } }) {
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		if (user && likes.find((like) => like.username === user.username)) {
			setLiked(true);
		} else {
			setLiked(false);
		}
	}, [user, likes]);

	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: { postId: id },
	});

	const likeButton = user ? (
		liked ? (
			<Popup
				content="Usuń polubienie"
				inverted
				trigger={
					<Button color="red">
						<Icon name="heart" />
					</Button>
				}
			/>
		) : (
			<Popup
				content="Polub wpis"
				inverted
				trigger={
					<Button color="red" basic>
						<Icon name="heart" />
					</Button>
				}
			/>
		)
	) : (
		<Popup
			content="Zaloguj się aby polubić post"
			inverted
			trigger={
				<Button as={Link} to="/login" color="red" basic>
					<Icon name="heart" />
				</Button>
			}
		/>
	);

	return user ? (
		<Button as="div" labelPosition="right" onClick={likePost}>
			{likeButton}
			<Label as="a" basic color="red" pointing="left">
				{likeCount}
			</Label>
		</Button>
	) : (
		<Button as="div" labelPosition="right">
			{likeButton}
			<Label as="a" basic color="red" pointing="left">
				{likeCount}
			</Label>
		</Button>
	);
}

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likeCount
		}
	}
`;

export default LikeButton;
