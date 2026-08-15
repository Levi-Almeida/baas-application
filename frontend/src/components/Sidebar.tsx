import {
    LayoutDashboard,
    CreditCard,
    ArrowLeftRight,
    Wallet,
    Webhook,
    LogOut,
} from 'lucide-react';

import {
    NavLink,
    useNavigate,
} from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        navigate('/login');
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">B</div>

                <div>
                    <strong>BranchFlow</strong>
                    <span>BaaS Platform</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard">
                    <LayoutDashboard size={19} />
                    Dashboard
                </NavLink>

                <NavLink to="/payments">
                    <CreditCard size={19} />
                    Pagamentos
                </NavLink>

                <NavLink to="/transactions">
                    <ArrowLeftRight size={19} />
                    Transações
                </NavLink>

                <NavLink to="/withdrawals">
                    <Wallet size={19} />
                    Saques
                </NavLink>

                <NavLink to="/webhooks">
                    <Webhook size={19} />
                    Webhooks
                </NavLink>
            </nav>

            <button
                className="logout-button"
                onClick={logout}
            >
                <LogOut size={19} />
                Sair
            </button>
        </aside>
    );
}