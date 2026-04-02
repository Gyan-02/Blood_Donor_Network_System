import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { RequestBloodForm } from './components/RequestBloodForm';
import { LivePulseDashboard } from './components/LivePulseDashboard';
import { BloodVaultInventory } from './components/BloodVaultInventory';
import { DriveFinder } from './components/DriveFinder';
import { HeroProfile } from './components/HeroProfile';
import {
    Ambulance,
    LayoutDashboard,
    FlaskConical,
    MapPin,
    UserCircle,
    Droplets,
} from 'lucide-react';

const queryClient = new QueryClient();

const NAV_ITEMS = [
    { to: '/request', label: 'Request Blood', icon: Ambulance },
    { to: '/dashboard', label: 'Live Pulse', icon: LayoutDashboard },
    { to: '/inventory', label: 'Blood Vault', icon: FlaskConical },
    { to: '/drives', label: 'Drive Finder', icon: MapPin },
    { to: '/profile', label: 'Hero Profile', icon: UserCircle },
];

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div className="flex min-h-screen bg-dark-bg">
                    {/* Sidebar */}
                    <nav className="w-[72px] lg:w-[220px] bg-dark-surface border-r border-dark-border flex flex-col items-center lg:items-stretch py-6 gap-1 fixed h-full z-50">
                        {/* Logo */}
                        <div className="flex items-center gap-2 px-4 mb-8">
                            <Droplets className="w-8 h-8 text-blood-red shrink-0" />
                            <span className="hidden lg:block text-lg font-bold text-dark-text font-[Outfit]">
                                BloodNet
                            </span>
                        </div>

                        {/* Nav Links */}
                        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? 'bg-blood-red/15 text-blood-red shadow-lg shadow-blood-red/5'
                                            : 'text-dark-muted hover:text-dark-text hover:bg-dark-elevated'
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span className="hidden lg:block">{label}</span>
                            </NavLink>
                        ))}

                        {/* Bottom version */}
                        <div className="mt-auto px-4 hidden lg:block">
                            <p className="text-xs text-dark-subtle">v2.0 — Blood Bank DBMS</p>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <main className="flex-1 ml-[72px] lg:ml-[220px] min-h-screen">
                        <Routes>
                            <Route path="/" element={<Navigate to="/request" replace />} />
                            <Route path="/request" element={<RequestBloodForm />} />
                            <Route path="/dashboard" element={<LivePulseDashboard />} />
                            <Route path="/inventory" element={<BloodVaultInventory />} />
                            <Route path="/drives" element={<DriveFinder />} />
                            <Route path="/profile" element={<HeroProfile />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
