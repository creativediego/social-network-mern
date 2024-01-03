import React from 'react';
import '.././Posts.scss';
import { usePost } from '../Post/hooks/usePost';
import { usePostOptions } from './hooks/usePostOptions';
import {
  OptionItem,
  OptionMenuProvider,
} from '../../OptionMenu/OptionMenuProvider';
import { OptionMenu } from '../../';

/**
 * `PostOptions` is a component that displays the dropdown menu options when clicking the post ellipsis button.
 *
 * It uses the `usePost`, `usePostOptions`, and `usePostDeletion` hooks to manage the post options and actions.
 *
 * @component
 * @example
 * Example usage of PostOptions component
 * <PostOptions />
 *
 * @returns {JSX.Element} A JSX element representing the post options.
 */
const PostOptions = (): JSX.Element => {
  const { post } = usePost();
  const { handleDelete } = usePostOptions(post);
  const options: OptionItem[] = [
    {
      label: 'Delete Post',
      icon: 'fa-trash-can',
      color: 'danger',
      action: () => handleDelete(),
    },
  ];
  return (
    <OptionMenuProvider>
      <OptionMenu customOptions={options} />
    </OptionMenuProvider>
  );
};

export default PostOptions;
