import React, { useContext, createContext, ReactNode } from 'react';
import { IPost } from '../../../../interfaces/IPost';
import { IPostService } from '../../../../services/postService';

/**
 * `IPostContext` is the interface for the context of a single post.
 *
 * @typedef {Object} IPostContext
 * @property {IPost} post - The post object.
 * @property {IPostService} postService - The post service object.
 */
interface IPostContext {
  post: IPost;
  postService: IPostService;
}

/**
 * `PostContext` is the context for a single post.
 * It gives nested components (such as stats) access to its data.
 *
 * @type {React.Context<IPostContext | null>}
 */

export const PostContext: React.Context<IPostContext | null> =
  createContext<IPostContext | null>(null);

/**
 * `PostProvider` is a context provider for a single post.
 * It provides the post and post service to its child components.
 *
 * @component
 * @example
 * Example usage of PostProvider component
 * <PostProvider post={samplePost} postService={samplePostService}>
 *   <ChildComponent />
 * </PostProvider>
 *
 * @param {Object} props - The properties that define the PostProvider component.
 * @param {IPost} props.post - The post object to be provided.
 * @param {IPostService} props.postService - The post service object to be provided.
 * @param {ReactNode} props.children - The child components.
 *
 * @returns {JSX.Element} A JSX element representing the PostProvider component.
 */
export const PostProvider = ({
  post,
  postService,
  children,
}: {
  post: IPost;
  postService: IPostService;
  children: ReactNode;
}): JSX.Element => {
  return (
    <PostContext.Provider value={{ post, postService }}>
      {children}
    </PostContext.Provider>
  );
};

/**
 * `usePost` is a custom hook that provides the post and post service from the `PostContext`.
 *
 * It should be used within a `PostProvider` component.
 *
 * @hook
 * @example
 * Example usage of usePost hook
 * const { post, postService } = usePost();
 *
 * @returns {IPostContext} The post and post service from the `PostContext`.
 * @throws {Error} If `usePost` is used outside a `PostProvider` component.
 */
export const usePost = (): IPostContext => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  const { post, postService } = context;

  return { post, postService };
};
