import { useState, useEffect, useRef } from 'react';
import {
    UserCircle, Droplets, Heart, Award, Calendar, MapPin,
    Shield, Star, TrendingUp, Clock
} from 'lucide-react';
import clsx from 'clsx';
import type { Donor, DonationRecord } from '../types/schema';

const MOCK_DONOR: Donor = {
    id: 5,
    full_name: 'Karthik Subramanian',
    blood_group: 'O-',
    age: 35,
    total_donations: 31,
    availability_status: 'Available',
    lat: 13.0878,
    lng: 80.2785,
    last_donation: '2026-02-10',
    member_since: '2019-11-30',
    contact: '+91 54321 09876',
    lives_saved: 93,
    badges: ['Platinum Hero', 'Lifesaver Legend'],
    donation_history: [
        { id: 1, date: '2026-02-10', location: 'City Hospital', type: 'Whole Blood' },
        { id: 2, date: '2025-11-15', location: 'SRM Campus Drive', type: 'Plasma' },
        { id: 3, date: '2025-08-20', location: 'General Hospital', type: 'Platelets' },
        { id: 4, date: '2025-05-12', location: 'Red Cross Center', type: 'Whole Blood' },
        { id: 5, date: '2025-02-01', location: 'City Hospital', type: 'Plasma' },
        { id: 6, date: '2024-10-18', location: 'Apollo Blood Center', type: 'Whole Blood' },
    ],
};

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<number | null>(null);

    useEffect(() => {
        const start = performance.now();
        const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * target));
            if (progress < 1) ref.current = requestAnimationFrame(step);
        };
        ref.current = requestAnimationFrame(step);
        return () => { if (ref.current) cancelAnimationFrame(ref.current); };
    }, [target, duration]);

    return <span>{count}</span>;
}

export function HeroProfile() {
    const [donor] = useState<Donor>(MOCK_DONOR);
    const isAvailable = donor.availability_status === 'Available';

    const getBadgeColor = (badge: string) => {
        if (badge.includes('Platinum')) return 'text-platinum bg-platinum/10 border-platinum/30';
        if (badge.includes('Gold')) return 'text-gold bg-gold/10 border-gold/30';
        if (badge.includes('Silver')) return 'text-silver bg-silver/10 border-silver/30';
        return 'text-bronze bg-bronze/10 border-bronze/30';
    };

    const daysSinceLastDonation = Math.floor(
        (Date.now() - new Date(donor.last_donation).getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <div className="mb-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-dark-text font-[Outfit] flex items-center gap-3">
                    <Award className="w-9 h-9 text-gold" />
                    Hero Profile
                </h1>
                <p className="text-dark-muted mt-1">Your lifesaver stats and donation journey</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6 animate-fade-in">
                        {/* Avatar with aura */}
                        <div className="flex justify-center mb-6">
                            <div className={clsx(
                                "relative w-28 h-28 rounded-full flex items-center justify-center",
                                isAvailable && "animate-green-aura"
                            )}>
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-dark-elevated to-dark-bg flex items-center justify-center border-2 border-dark-border">
                                    <UserCircle className="w-16 h-16 text-dark-muted" />
                                </div>
                                {isAvailable && (
                                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-neon-green rounded-full border-4 border-dark-card flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Metallic Name Badge */}
                        <div className="metallic-badge rounded-2xl p-4 text-center mb-4">
                            <h2 className="text-xl font-bold text-dark-text font-[Outfit]">{donor.full_name}</h2>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <Droplets className="w-5 h-5 text-blood-red" />
                                <span className="text-2xl font-black text-blood-red">{donor.blood_group}</span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className={clsx(
                            "text-center py-2 rounded-xl text-xs font-bold mb-4",
                            isAvailable
                                ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                                : "bg-dark-elevated text-dark-muted border border-dark-border"
                        )}>
                            {isAvailable ? '🟢 Available for Emergency Contact' : '🔴 Currently Unavailable'}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {donor.badges?.map((badge) => (
                                <span key={badge} className={clsx(
                                    "text-[10px] font-bold px-3 py-1 rounded-full border flex items-center gap-1",
                                    getBadgeColor(badge)
                                )}>
                                    <Star className="w-3 h-3" /> {badge}
                                </span>
                            ))}
                        </div>

                        {/* Quick Info */}
                        <div className="mt-6 space-y-3 text-xs">
                            <div className="flex items-center gap-2 text-dark-muted">
                                <Calendar className="w-3.5 h-3.5 text-dark-subtle" />
                                <span>Member since {new Date(donor.member_since).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-dark-muted">
                                <Clock className="w-3.5 h-3.5 text-dark-subtle" />
                                <span>Last donation {daysSinceLastDonation} days ago</span>
                            </div>
                            <div className="flex items-center gap-2 text-dark-muted">
                                <MapPin className="w-3.5 h-3.5 text-dark-subtle" />
                                <span>Chennai, Tamil Nadu</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats + History */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Lifesaver Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Donations', value: donor.total_donations, icon: Droplets, color: 'text-blood-red', bg: 'bg-blood-red/10', glow: true },
                            { label: 'Lives Saved', value: donor.lives_saved || 0, icon: Heart, color: 'text-neon-green', bg: 'bg-neon-green/10', glow: true },
                            { label: 'Years Active', value: Math.floor((Date.now() - new Date(donor.member_since).getTime()) / (365.25 * 24 * 60 * 60 * 1000)), icon: Shield, color: 'text-medical-blue-light', bg: 'bg-medical-blue/10', glow: false },
                            { label: 'Donor Rank', value: 0, icon: TrendingUp, color: 'text-gold', bg: 'bg-gold/10', glow: false, custom: 'TOP 5%' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-4 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                                    <stat.icon className={clsx("w-5 h-5", stat.color)} />
                                </div>
                                <p className={clsx(
                                    "text-3xl font-black",
                                    stat.color,
                                    stat.glow && "animate-counter-glow"
                                )}>
                                    {stat.custom || <AnimatedCounter target={stat.value} />}
                                </p>
                                <p className="text-xs text-dark-muted mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Donation Progress Ring */}
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6 animate-fade-in">
                        <h3 className="text-sm font-bold text-dark-text mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-medical-blue-light" /> Progress to Next Milestone
                        </h3>
                        <div className="flex items-center gap-6">
                            {/* Circular progress */}
                            <div className="relative w-24 h-24 shrink-0">
                                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-dark-bg)" strokeWidth="8" />
                                    <circle
                                        cx="50" cy="50" r="40" fill="none"
                                        stroke="var(--color-neon-green)" strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(donor.total_donations / 50) * 251.2} 251.2`}
                                        className="transition-all duration-2000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg font-bold text-dark-text">{donor.total_donations}/50</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-dark-text font-medium">
                                    {50 - donor.total_donations} more donations to reach <span className="text-gold font-bold">Diamond Donor</span> status!
                                </p>
                                <p className="text-xs text-dark-muted mt-1">
                                    You're in the top 5% of donors in your region. Keep going! 🏆
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Donation History Timeline */}
                    <div className="bg-dark-card border border-dark-border rounded-2xl p-6 animate-fade-in">
                        <h3 className="text-sm font-bold text-dark-text mb-6 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-medical-blue-light" /> Donation History
                        </h3>
                        <div className="relative pl-6">
                            {/* Timeline line */}
                            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blood-red via-dark-border to-transparent" />

                            {donor.donation_history?.map((record, i) => (
                                <div key={record.id} className="relative mb-6 last:mb-0 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                    {/* Dot */}
                                    <div className={clsx(
                                        "absolute -left-4 w-4 h-4 rounded-full border-2 border-dark-card",
                                        i === 0 ? "bg-blood-red" : "bg-dark-border"
                                    )} />

                                    <div className="bg-dark-bg rounded-xl p-4 border border-dark-border ml-2 hover:border-dark-subtle transition-colors">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-bold text-dark-text">{record.location}</span>
                                            <span className="text-[10px] text-dark-muted">{new Date(record.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={clsx(
                                                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                                record.type === 'Whole Blood' ? "bg-blood-red/10 text-blood-red" :
                                                record.type === 'Plasma' ? "bg-gold/10 text-gold" :
                                                "bg-amber-warn/10 text-amber-warn"
                                            )}>
                                                {record.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
