import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ConnectReturn() {
    const { reloadUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                await reloadUser();  
                navigate('/sell'); 
            } catch {
                 navigate('/');
            }
        })();
    }, [reloadUser, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p>Leite weiter …</p>
        </div>
    );
}
