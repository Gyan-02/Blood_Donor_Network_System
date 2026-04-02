import { useState, useEffect } from 'react';
import {
    Activity, Droplets, AlertTriangle, Building2, Zap, TrendingUp,
    Radio, MapPin
} from 'lucide-react';
import clsx from 'clsx';
import type { BloodBank, CriticalRequest, DashboardStats } from '../types/schema';

// Mock data (in production, fetch from /api/dashboard/stats)
const MOCK_STATS: DashboardStats = {
    total_bags: 582,
    total_banks: 4,
    critical_requests: 2,
    pending_requests: 7,
    banks: [
        { id: 1, name: 'City Hospital Blood Bank', lat: 13.0835, lng: 80.2707, inventory: { 'A+': 45, 'A-': 12, 'B+': 38, 'B-': 8, 'AB+': 15, 'AB-': 4, 'O+': 52, 'O-': 18 } },
        { id: 2, name: 'General Hospital Blood Bank', lat: 13.0674, lng: 80.2376, inventory: { 'A+': 30, 'A-': 7, 'B+': 25, 'B-': 5, 'AB+': 10, 'AB-': 2, 'O+': 40, 'O-': 14 } },
        { id: 3, name: 'Apollo Blood Center', lat: 13.0524, lng: 80.2508, inventory: { 'A+': 60, 'A-': 20, 'B+': 55, 'B-': 12, 'AB+': 22, 'AB-': 8, 'O+': 70, 'O-': 25 } },
        { id: 4, name: 'Red Cross Blood Bank', lat: 13.0612, lng: 80.2623, inventory: { 'A+': 35, 'A-': 10, 'B+': 28, 'B-': 6, 'AB+': 14, 'AB-': 3, 'O+': 48, 'O-': 16 } },
    ],
    critical: [
        { id: 101, blood_type: 'O-', urgency: 'Critical', hospital: 'City Hospital', hospital_lat: 13.0835, hospital_lng: 80.2707, patient: 'Patient A', units_needed: 3, created_at: new Date().toISOString() },
        { id: 102, blood_type: 'AB-', urgency: 'Critical', hospital: 'General Hospital', hospital_lat: 13.0674, hospital_lng: 80.2376, patient: 'Patient B', units_needed: 2, created_at: new Date(Date.now() - 1800000).toISOString() },
    ],
};

function getTotalInventory(bank: BloodBank): number {
    return Object.values(bank.inventory).reduce((s, v) => s + v, 0);
}

function getInventoryLevel(total: number): 'high' | 'medium' | 'low' {
    if (total > 150) return 'high';
    if (total > 80) return 'medium';
    return 'low';
}

export function LivePulseDashboard() {
    const [stats] = useState<DashboardStats>(MOCK_STATS);
    const [selectedBank, setSelectedBank] = useState<BloodBank | null>(null);
    const [showRadar, setShowRadar] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => setShowRadar(prev => !prev), 4000);
        return () => clearInterval(interval);
    }, []);

    const timeSince = (dateStr: string) => {
        const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
        if (mins < 60) return `${mins}m ago`;
        return `${Math.floor(mins / 60)}h ago`;
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <div className="mb-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-dark-text font-[Outfit] flex items-center gap-3">
                    <Activity className="w-9 h-9 text-blood-red" />
                    Live Pulse Dashboard
                </h1>
                <p className="text-dark-muted mt-1">Real-time blood bank network monitoring</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Blood Bags', value: stats.total_bags, icon: Droplets, color: 'text-blood-red', bg: 'bg-blood-red/10' },
                    { label: 'Active Banks', value: stats.total_banks, icon: Building2, color: 'text-medical-blue-light', bg: 'bg-medical-blue/10' },
                    { label: 'Critical Alerts', value: stats.critical_requests, icon: AlertTriangle, color: 'text-blood-red', bg: 'bg-blood-red/10' },
                    { label: 'Pending Requests', value: stats.pending_requests, icon: TrendingUp, color: 'text-amber-warn', bg: 'bg-amber-warn/10' },
                ].map((card, i) => (
                    <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-4 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center mb-3", card.bg)}>
                            <card.icon className={clsx("w-5 h-5", card.color)} />
                        </div>
                        <p className="text-2xl font-bold text-dark-text">{card.value}</p>
                        <p className="text-xs text-dark-muted mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Map Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map */}
                <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-2xl overflow-hidden relative" style={{ minHeight: '450px' }}>
                    {/* Dark map visualization */}
                    <div className="absolute inset-0 bg-gradient-to-br from-dark-surface via-[#0d1117] to-dark-surface">
                        {/* Grid effect */}
                        <div className="absolute inset-0 opacity-8" style={{
                            backgroundImage: 'linear-gradient(rgba(69,123,157,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(69,123,157,0.15) 1px, transparent 1px)',
                            backgroundSize: '50px 50px'
                        }} />

                        {/* Radial gradient for depth */}
                        <div className="absolute inset-0" style={{
                            background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(11,14,20,0.6) 100%)'
                        }} />

                        {/* Blood bank markers */}
                        {stats.banks.map((bank, i) => {
                            const total = getTotalInventory(bank);
                            const level = getInventoryLevel(total);
                            const positions = [
                                { top: '30%', left: '35%' },
                                { top: '55%', left: '25%' },
                                { top: '40%', left: '60%' },
                                { top: '65%', left: '50%' },
                            ];
                            return (
                                <div
                                    key={bank.id}
                                    className="absolute cursor-pointer group"
                                    style={positions[i]}
                                    onClick={() => setSelectedBank(selectedBank?.id === bank.id ? null : bank)}
                                >
                                    {/* Marker */}
                                    <div className={clsx(
                                        "w-5 h-5 rounded-full border-2 transition-transform hover:scale-125",
                                        level === 'high' ? "bg-neon-green border-neon-green/50 shadow-lg shadow-neon-green/30" :
                                        level === 'medium' ? "bg-amber-warn border-amber-warn/50 shadow-lg shadow-amber-warn/30" :
                                        "bg-blood-red border-blood-red/50 shadow-lg shadow-blood-red/30"
                                    )} />
                                    {/* Label */}
                                    <div className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-dark-bg/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-dark-text whitespace-nowrap border border-dark-border opacity-0 group-hover:opacity-100 transition-opacity">
                                        {bank.name.replace(' Blood Bank', '').replace(' Blood Center', '')}
                                        <span className={clsx("ml-1 font-bold",
                                            level === 'high' ? "text-neon-green" : level === 'medium' ? "text-amber-warn" : "text-blood-red"
                                        )}>({total})</span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Critical request radar rings */}
                        {stats.critical.map((req, i) => {
                            const positions = [
                                { top: '30%', left: '35%' },
                                { top: '55%', left: '25%' },
                            ];
                            return (
                                <div key={req.id} className="absolute" style={positions[i]}>
                                    {showRadar && (
                                        <>
                                            <div className="absolute -inset-8 border-2 border-blood-red/40 rounded-full animate-radar" />
                                            <div className="absolute -inset-8 border-2 border-blood-red/40 rounded-full animate-radar" style={{ animationDelay: '1s' }} />
                                        </>
                                    )}
                                </div>
                            );
                        })}

                        {/* Connection lines (SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.4 }}>
                            <line x1="35%" y1="30%" x2="60%" y2="40%" stroke="#E63946" strokeWidth="1" strokeDasharray="6 4">
                                <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
                            </line>
                            <line x1="25%" y1="55%" x2="50%" y2="65%" stroke="#E63946" strokeWidth="1" strokeDasharray="6 4">
                                <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
                            </line>
                        </svg>

                        {/* Map Legend */}
                        <div className="absolute bottom-4 left-4 bg-dark-bg/85 backdrop-blur-sm p-3 rounded-xl border border-dark-border text-xs">
                            <p className="font-semibold text-dark-text mb-2">Network Status</p>
                            <div className="space-y-1.5">
                                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-neon-green rounded-full" /> High Stock (&gt;150)</span>
                                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-warn rounded-full" /> Medium (80-150)</span>
                                <span className="flex items-center gap-2"><span className="w-3 h-3 bg-blood-red rounded-full" /> Low (&lt;80)</span>
                                <span className="flex items-center gap-2"><Radio className="w-3 h-3 text-blood-red" /> Critical Alert</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar — Critical Alerts + Selected Bank */}
                <div className="space-y-4">
                    {/* Critical Alerts */}
                    <div className="bg-dark-card border border-blood-red/20 rounded-2xl p-5 animate-glow-border" style={{ animationDuration: '3s' }}>
                        <h3 className="text-sm font-bold text-blood-red flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-4 h-4" /> Critical Alerts
                        </h3>
                        <div className="space-y-3">
                            {stats.critical.map((req) => (
                                <div key={req.id} className="bg-dark-bg rounded-xl p-3 border border-dark-border animate-slide-right">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-lg font-bold text-blood-red">{req.blood_type}</span>
                                        <span className="text-[10px] text-dark-muted">{timeSince(req.created_at)}</span>
                                    </div>
                                    <p className="text-xs text-dark-text">{req.hospital}</p>
                                    <p className="text-xs text-dark-muted">{req.units_needed} units needed — {req.patient}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Selected Bank Details */}
                    {selectedBank && (
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-5 animate-fade-in">
                            <h3 className="text-sm font-bold text-dark-text flex items-center gap-2 mb-4">
                                <MapPin className="w-4 h-4 text-medical-blue-light" />
                                {selectedBank.name}
                            </h3>
                            <div className="grid grid-cols-4 gap-2">
                                {(Object.entries(selectedBank.inventory) as [string, number][]).map(([type, count]) => (
                                    <div key={type} className="bg-dark-bg rounded-lg p-2 text-center border border-dark-border">
                                        <p className="text-xs font-bold text-blood-red">{type}</p>
                                        <p className="text-sm font-bold text-dark-text">{count}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-dark-muted">
                                <Zap className="w-3 h-3 text-neon-green" />
                                Total: {getTotalInventory(selectedBank)} bags available
                            </div>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
                        <h3 className="text-sm font-bold text-dark-text mb-4">Blood Type Distribution</h3>
                        {['O+', 'A+', 'B+', 'O-', 'AB+', 'A-', 'B-', 'AB-'].map((type) => {
                            const total = stats.banks.reduce((s, b) => s + (b.inventory[type as keyof typeof b.inventory] || 0), 0);
                            const max = 250;
                            const pct = Math.min((total / max) * 100, 100);
                            return (
                                <div key={type} className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold text-dark-muted w-8">{type}</span>
                                    <div className="flex-1 h-2 bg-dark-bg rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blood-red to-blood-red/60 transition-all duration-1000"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-dark-muted w-8 text-right">{total}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
