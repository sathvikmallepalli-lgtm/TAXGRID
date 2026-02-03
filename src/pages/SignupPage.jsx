import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Signup from '../components/Signup';

export default function SignupPage() {
    const { register, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSignup = (userData) => {
        const result = register(userData);
        if (result.success) {
            navigate('/dashboard');
        } else {
            alert(result.error);
        }
    };

    const handleSwitchToLogin = () => {
        navigate('/login');
    };

    return <Signup onSignup={handleSignup} onSwitchToLogin={handleSwitchToLogin} />;
}
