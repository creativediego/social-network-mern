import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * The default Dispatch type does not know about thunks or other middleware. In order to correctly dispatch thunks, we need to use the specific customized AppDispatch type from the store that includes the thunk middleware types, and use that with useDispatch. Adding a pre-typed useDispatch hook keeps us from forgetting to import AppDispatch where it's needed.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
// Defines the (state: RootState), so we don't have to manually define in component.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
