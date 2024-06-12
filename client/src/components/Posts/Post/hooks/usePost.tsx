import {
  Context,
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { IPost } from '../../../../interfaces/IPost';
import { IPostService } from '../../../../services/postService';

/**
 * `IPostContext` is an interface for the context of the `PostProvider`.
 * It includes a `post` field, which is an `IPost`, a `setPost` function, which sets the `post`, and a `postService`, which is the post API service.
 *
 * @see {@link IPost} for the interface of a post.
 * @see {@link IPostService} for the interface of a post service.
 */
interface IPostContext {
  post: IPost;
  setPost: (post: IPost) => void;
  postService: IPostService;
}

/**
 * `PostContext` is a context for providing the `post`, `setPost` function, and `postService` to child components.
 * It is created with `React.createContext` and its initial value is `null`.
 *
 * @see {@link React.createContext} for the function that creates the context.
 * @see {@link IPostContext} for the interface of the context.
 */
export const PostContext: Context<IPostContext | null> =
  createContext<IPostContext | null>(null);

/**
 * `PostProvider` is a component that provides the `post`, `setPost` function, and `postService` to child components via the `PostContext`.
 * It uses the `useState` and `useEffect` hooks from React to manage the `post` state and update it with the post context.
 *
 * @param {PostProviderProps} props - The properties passed to the component.
 * @param {IPost} props.initialPost - The initial post.
 * @param {IPostService} props.postService - The post service.
 * @param {ReactNode} props.children - The children to be rendered in the provider.
 *
 * @returns {JSX.Element} The `PostProvider` component, which includes the `PostContext.Provider` that provides the `post`, `setPost` function, and `postService` to child components.
 *
 * @example
 * <PostProvider initialPost={initialPost} postService={postService}>
 *   <ChildComponent />
 * </PostProvider>
 *
 * @see {@link PostContext} for the context that provides the `post`, `setPost` function, and `postService`.
 * @see {@link PostProviderProps} for the interface of the properties.
 * @see {@link useState} and {@link useEffect} for the hooks that manage the `post` state and update it when the `initialPost` prop changes.
 */
export const PostProvider = ({
  initialPost,
  postService,
  children,
}: {
  initialPost: IPost;
  postService: IPostService;
  children: ReactNode;
}): JSX.Element => {
  const [post, setPost] = useState<IPost>(initialPost);

  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);
  return (
    <PostContext.Provider value={{ post, setPost, postService }}>
      {children}
    </PostContext.Provider>
  );
};

/**
 * `usePost` is a custom hook that provides the `post`, `setPost` function, and `postService` from the `PostContext`.
 * It uses the `useContext` hook from React to access the `PostContext`.
 * If the `usePost` hook is used outside of a `PostProvider`, it throws an error.
 *
 * @returns {IPostContext} An object containing the `post`, `setPost` function, and `postService`.
 *
 * @example
 * const { post, setPost, postService } = usePost();
 *
 * @see {@link PostContext} for the context that provides the `post`, `setPost` function, and `postService.
 * @see {@link useContext} for the hook that accesses the context.
 * @see {@link IPostContext} for the interface of the returned object.
 */
export const usePost = (): IPostContext => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  const { post, setPost, postService } = context;

  return { post, setPost, postService };
};
