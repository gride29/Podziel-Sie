import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function DeleteButton({ postId, commentId, callback }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePostOrMutation] = useMutation(mutation, {
		refetchQueries: [{ query: FETCH_POSTS_QUERY }],

		update(proxy) {
			setConfirmOpen(false);

			//  const data = proxy.readQuery({
			//      query: FETCH_POSTS_QUERY,
			//  });
			//  data.getPosts = data.getPosts.filter((p) => p.id !== postId);
			//  proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });

			if (callback) callback();
		},

		variables: {
			postId,
			commentId,
		},
	});

	return (
		<>
			<Popup
				content={commentId ? 'Usuń komentarz' : 'Usuń wpis'}
				inverted
				trigger={
					<Button
						as="div"
						color="black"
						basic
						floated="right"
						onClick={() => setConfirmOpen(true)}
					>
						<Icon name="trash" style={{ margin: 0 }} />
					</Button>
				}
			/>
			<Confirm
				open={confirmOpen}
				header="Usunięcie wpisu"
				content="Czy jesteś pewien?"
				cancelButton="Anuluj"
				confirmButton="OK"
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrMutation}
			/>
		</>
	);
}

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: String!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
			commentCount
		}
	}
`;

export default DeleteButton;
