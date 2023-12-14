import { Navigate } from 'react-router-dom';

const AuthChecker = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('@user'));

  if (!user?.idUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthChecker;
