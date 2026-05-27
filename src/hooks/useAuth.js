import { useSelector } from 'react-redux';
import {
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthInitialized,
} from '../redux/slices/authSlice';

export function useAuth() {
  return {
    user:            useSelector(selectUser),
    token:           useSelector(selectToken),
    isAuthenticated: useSelector(selectIsAuthenticated),
    authLoading:     useSelector(selectAuthLoading),
    initialized:     useSelector(selectAuthInitialized),
  };
}
