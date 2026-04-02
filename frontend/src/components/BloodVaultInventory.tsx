import { useState, useEffect } from 'react';
import {
    FlaskConical, AlertTriangle, Clock, Droplets, ShieldAlert, Package
} from 'lucide-react';
import clsx from 'clsx';
import type { InventoryItem, ExpiringBatch, ComponentType } from '../types/schema';

const MOCK_INVENTORY: InventoryItem[] = [
    { component_type: 'Whole Blood', quantity_ml: 12500, total_bags: 50, expiring_soon: 5, batch_numbers: ['WB-2026-001', 'WB-2026-002', 'WB-2026-003'] },
    { component_type: 'Plasma', quantity_ml: 8200, total_bags: 41, expiring_soon: 8, batch_numbers: ['PL-2026-010', 'PL-2026-011'] },
    { component_type: 'Platelets', quantity_ml: 3800, total_bags: 19, expiring_soon: 12, batch_numbers: ['PT-2026-020', 'PT-2026-021', 'PT-2026-022'] },
    { component_type: 'Red Cells', quantity_ml: 15400, total_bags: 62, expiring_soon: 3, batch_numbers: ['RC-2026-030', 'RC-2026-031'] },
];

const MOCK_EXPIRING: ExpiringBatch[] = [
    { id: 1, batch_number: 'WB-2026-001', component_type: 'Whole Blood', blood_type: 'A+', quantity_ml: 450, collection_date: '2026-02-15', expiry_date: '2026-03-22', status: 'Available', location: 'City Hospital' },
    { id: 2, batch_number: 'PT-2026-020', component_type: 'Platelets', blood_type: 'O+', quantity_ml: 200, collection_date: '2026-03-15', expiry_date: '2026-03-20', status: 'Expiring', location: 'Apollo Blood Center' },
    { id: 3, batch_number: 'PL-2026-011', component_type: 'Plasma', blood_type: 'B-', quantity_ml: 200, collection_date: '2026-02-20', expiry_date: '2026-03-21', status: 'Expiring', location: 'Red Cross Blood Bank' },
    { id: 4, batch_number: 'PT-2026-021', component_type: 'Platelets', blood_type: 'AB+', quantity_ml: 200, collection_date: '2026-03-16', expiry_date: '2026-03-21', status: 'Expiring', location: 'General Hospital' },
    { id: 5, batch_number: 'WB-2026-003', component_type: 'Whole Blood', blood_type: 'O-', quantity_ml: 450, collection_date: '2026-02-18', expiry_date: '2026-03-23', status: 'Available', location: 'City Hospital' },
    { id: 6, batch_number: 'PT-2026-022', component_type: 'Platelets', blood_type: 'A-', quantity_ml: 200, collection_date: '2026-03-14', expiry_date: '2026-03-19', status: 'Expired', location: 'Apollo Blood Center' },
];

const MAX_ML = 20000;

function getLiquidClass(type: ComponentType): string {
    switch (type) {
        case 'Whole Blood': return 'whole-blood';
        case 'Plasma': return 'plasma';
        case 'Platelets': return 'platelets';
        case 'Red Cells': return 'red-cells';
    }
}

function getDaysUntilExpiry(expiryDate: string): number {
    const now = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function BloodVaultInventory() {
    const [inventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
    const [expiring] = useState<ExpiringBatch[]>(MOCK_EXPIRING);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimateIn(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const totalBags = inventory.reduce((s, i) => s + i.total_bags, 0);
    const totalML = inventory.reduce((s, i) => s + i.quantity_ml, 0);
    const totalExpiring = inventory.reduce((s, i) => s + i.expiring_soon, 0);

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <div className="mb-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-dark-text font-[Outfit] flex items-center gap-3">
                    <FlaskConical className="w-9 h-9 text-medical-blue-light" />
                    Blood Vault
                </h1>
                <p className="text-dark-muted mt-1">Futuristic inventory management</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Total Bags', value: totalBags, icon: Package, color: 'text-medical-blue-light', bg: 'bg-medical-blue/10' },
                    { label: 'Total Volume', value: `${(totalML / 1000).toFixed(1)}L`, icon: Droplets, color: 'text-neon-green', bg: 'bg-neon-green/10' },
                    { label: 'Expiring Soon', value: totalExpiring, icon: AlertTriangle, color: 'text-amber-warn', bg: 'bg-amber-warn/10' },
                ].map((s, i) => (
                    <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-4 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={clsx("w-9 h-9 rounded-lg flex items-center justify-center mb-2", s.bg)}>
                            <s.icon className={clsx("w-4 h-4", s.color)} />
                        </div>
                        <p className="text-xl font-bold text-dark-text">{s.value}</p>
                        <p className="text-xs text-dark-muted">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Test Tubes Section */}
                <div className="lg:col-span-2">
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-dark-text mb-6">Component Levels</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {inventory.map((item, idx) => {
                                const fillPct = Math.min((item.quantity_ml / MAX_ML) * 100, 100);
                                return (
                                    <div key={item.component_type} className="flex flex-col items-center animate-fade-in" style={{ animationDelay: `${idx * 0.15}s` }}>
                                        {/* Test Tube Cap */}
                                        <div className="w-[70px] h-[14px] bg-dark-elevated border border-dark-border rounded-t-md mb-0 relative z-10" />

                                        {/* Test Tube Body */}
                                        <div className="test-tube" style={{ width: '60px', height: '180px' }}>
                                            {/* Measurement marks */}
                                            {[25, 50, 75].map(pct => (
                                                <div key={pct} className="absolute w-full border-t border-dark-border/30" style={{ bottom: `${pct}%` }}>
                                                    <span className="absolute -left-6 -top-2 text-[8px] text-dark-subtle">{pct}%</span>
                                                </div>
                                            ))}

                                            {/* Liquid */}
                                            <div
                                                className={clsx("test-tube-liquid relative", getLiquidClass(item.component_type))}
                                                style={{
                                                    height: animateIn ? `${fillPct}%` : '0%',
                                                    transition: `height 1.5s ease-out ${idx * 0.2}s`
                                                }}
                                            >
                                                {/* Wave top effect */}
                                                <div className="absolute top-0 left-0 right-0 h-2 opacity-50" style={{
                                                    background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                                                    borderRadius: '50% 50% 0 0',
                                                }} />
                                            </div>
                                        </div>

                                        {/* Labels */}
                                        <p className="text-xs font-bold text-dark-text mt-3 text-center">{item.component_type}</p>
                                        <p className="text-sm font-bold text-dark-muted">{(item.quantity_ml / 1000).toFixed(1)}L</p>
                                        <p className="text-[10px] text-dark-subtle">{item.total_bags} bags</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Batch Details Table */}
                        <div className="mt-8">
                            <h3 className="text-sm font-bold text-dark-text mb-3">Batch Registry</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b border-dark-border text-dark-muted text-left">
                                            <th className="pb-2 font-medium">Batch</th>
                                            <th className="pb-2 font-medium">Type</th>
                                            <th className="pb-2 font-medium">Blood</th>
                                            <th className="pb-2 font-medium">Volume</th>
                                            <th className="pb-2 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expiring.map((batch) => (
                                            <tr key={batch.id} className="border-b border-dark-border/50 hover:bg-dark-elevated/50 transition-colors">
                                                <td className="py-2 font-mono text-dark-text">{batch.batch_number}</td>
                                                <td className="py-2 text-dark-muted">{batch.component_type}</td>
                                                <td className="py-2"><span className="text-blood-red font-bold">{batch.blood_type}</span></td>
                                                <td className="py-2 text-dark-muted">{batch.quantity_ml}ml</td>
                                                <td className="py-2">
                                                    <span className={clsx(
                                                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                                        batch.status === 'Available' ? "bg-neon-green/10 text-neon-green" :
                                                        batch.status === 'Expiring' ? "bg-amber-warn/10 text-amber-warn" :
                                                        "bg-blood-red/10 text-blood-red"
                                                    )}>{batch.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expiry Threat Sidebar */}
                <div className="space-y-4">
                    <div className="bg-dark-card border border-amber-warn/20 rounded-2xl p-5 animate-amber-glow">
                        <h3 className="text-sm font-bold text-amber-warn flex items-center gap-2 mb-4">
                            <ShieldAlert className="w-4 h-4" /> Expiry Threat Monitor
                        </h3>
                        <div className="space-y-3">
                            {expiring
                                .filter(b => b.status === 'Expiring' || b.status === 'Expired')
                                .sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())
                                .map((batch) => {
                                    const days = getDaysUntilExpiry(batch.expiry_date);
                                    const isExpired = days <= 0;
                                    return (
                                        <div key={batch.id} className={clsx(
                                            "bg-dark-bg rounded-xl p-3 border animate-slide-right",
                                            isExpired ? "border-blood-red/30" : "border-amber-warn/20"
                                        )}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-mono text-xs text-dark-text">{batch.batch_number}</span>
                                                <span className={clsx(
                                                    "text-xs font-bold",
                                                    isExpired ? "text-blood-red" : "text-amber-warn"
                                                )}>
                                                    {isExpired ? '⛔ EXPIRED' : `⏳ ${days}d left`}
                                                </span>
                                            </div>
                                            <p className="text-xs text-dark-muted">{batch.component_type} — {batch.blood_type}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <Clock className="w-3 h-3 text-dark-subtle" />
                                                <span className="text-[10px] text-dark-subtle">{batch.location}</span>
                                            </div>

                                            {/* Countdown bar */}
                                            {!isExpired && (
                                                <div className="mt-2 h-1.5 bg-dark-elevated rounded-full overflow-hidden">
                                                    <div
                                                        className={clsx("h-full rounded-full transition-all",
                                                            days <= 1 ? "bg-blood-red" : "bg-amber-warn"
                                                        )}
                                                        style={{ width: `${Math.max(100 - days * 15, 10)}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Auto-Trigger Info */}
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
                        <h3 className="text-xs font-bold text-dark-muted mb-2 uppercase tracking-wider">System Trigger</h3>
                        <p className="text-xs text-dark-subtle leading-relaxed">
                            The MySQL trigger <code className="text-medical-blue-light bg-dark-bg px-1 rounded">auto_expire_check</code> automatically marks units past their <code className="text-medical-blue-light bg-dark-bg px-1 rounded">expiry_date</code> as <span className="text-blood-red font-bold">'Expired'</span> and removes them from available inventory.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
