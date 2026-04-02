import { useState } from 'react';
import {
    MapPin, Clock, Calendar, Users, CheckCircle2, ChevronRight,
    Radio, Zap
} from 'lucide-react';
import clsx from 'clsx';
import type { DonationDrive } from '../types/schema';

const MOCK_DRIVES: DonationDrive[] = [
    {
        id: 1, name: 'SRM Campus Blood Drive', organizer: 'SRM Red Cross Society',
        location: 'SRM University Main Campus, Kattankulathur',
        lat: 12.8231, lng: 80.0444,
        start_time: '2026-03-20T09:00:00', end_time: '2026-03-20T17:00:00',
        status: 'Active', total_slots: 100, booked_slots: 67, available_slots: 33,
        description: 'Annual mega blood donation drive. Free health checkup for all donors!',
    },
    {
        id: 2, name: 'City Hospital Emergency Drive', organizer: 'City Hospital Foundation',
        location: 'City Hospital, T. Nagar, Chennai',
        lat: 13.0418, lng: 80.2341,
        start_time: '2026-03-21T08:00:00', end_time: '2026-03-21T14:00:00',
        status: 'Upcoming', total_slots: 50, booked_slots: 12, available_slots: 38,
        description: 'Urgent drive to replenish O- and AB- stocks. Walk-ins welcome.',
    },
    {
        id: 3, name: 'Tech Park Donation Camp', organizer: 'TIDEL Park Welfare Committee',
        location: 'TIDEL Park, Taramani, Chennai',
        lat: 12.9862, lng: 80.2426,
        start_time: '2026-03-22T10:00:00', end_time: '2026-03-22T16:00:00',
        status: 'Upcoming', total_slots: 75, booked_slots: 30, available_slots: 45,
        description: 'Corporate blood donation camp with complimentary refreshments.',
    },
    {
        id: 4, name: 'Marina Beach Awareness Drive', organizer: 'Youth Blood Donors Network',
        location: 'Marina Beach, Triplicane, Chennai',
        lat: 13.0500, lng: 80.2824,
        start_time: '2026-03-15T07:00:00', end_time: '2026-03-15T12:00:00',
        status: 'Completed', total_slots: 120, booked_slots: 118, available_slots: 2,
        description: 'Community drive with blood group testing and awareness sessions.',
    },
];

function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function DriveFinder() {
    const [drives] = useState<DonationDrive[]>(MOCK_DRIVES);
    const [filter, setFilter] = useState<'all' | 'Active' | 'Upcoming' | 'Completed'>('all');
    const [bookingId, setBookingId] = useState<number | null>(null);
    const [booked, setBooked] = useState<Set<number>>(new Set());
    const [swiping, setSwiping] = useState<number | null>(null);
    const [swipeProgress, setSwipeProgress] = useState(0);

    const filtered = filter === 'all' ? drives : drives.filter(d => d.status === filter);

    const handleSwipeStart = (driveId: number) => {
        setSwiping(driveId);
        setSwipeProgress(0);
    };

    const handleSwipeMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (swiping === null) return;
        const target = e.currentTarget as HTMLDivElement;
        const rect = target.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const progress = Math.min(Math.max((clientX - rect.left) / (rect.width - 48), 0), 1);
        setSwipeProgress(progress);
    };

    const handleSwipeEnd = () => {
        if (swiping !== null && swipeProgress > 0.8) {
            setBooked(prev => new Set([...prev, swiping]));
            setBookingId(swiping);
            setTimeout(() => setBookingId(null), 3000);
        }
        setSwiping(null);
        setSwipeProgress(0);
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <div className="mb-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-dark-text font-[Outfit] flex items-center gap-3">
                    <MapPin className="w-9 h-9 text-neon-green" />
                    Drive Finder
                </h1>
                <p className="text-dark-muted mt-1">Find and join donation drives near you</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'Active', 'Upcoming', 'Completed'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={clsx(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                            filter === f
                                ? "bg-neon-green/15 text-neon-green border border-neon-green/30"
                                : "bg-dark-card text-dark-muted border border-dark-border hover:bg-dark-elevated"
                        )}
                    >
                        {f === 'all' ? 'All Drives' : f}
                    </button>
                ))}
            </div>

            {/* Booking Confirmation Toast */}
            {bookingId !== null && (
                <div className="fixed top-4 right-4 z-50 bg-neon-green/15 border border-neon-green/30 text-neon-green px-4 py-3 rounded-xl animate-slide-right flex items-center gap-2 shadow-2xl">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium text-sm">Appointment booked!</span>
                </div>
            )}

            {/* Drive Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((drive, i) => (
                    <div
                        key={drive.id}
                        className="bg-dark-card border border-dark-border rounded-2xl p-5 animate-fade-in transition-all hover:border-dark-subtle"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        {/* Status Badge + Name */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="text-base font-bold text-dark-text mb-1">{drive.name}</h3>
                                <p className="text-xs text-dark-muted">{drive.organizer}</p>
                            </div>
                            <span className={clsx(
                                "text-[10px] font-bold px-3 py-1 rounded-full shrink-0 ml-2",
                                drive.status === 'Active' ? "bg-neon-green/15 text-neon-green animate-neon-pulse" :
                                drive.status === 'Upcoming' ? "bg-medical-blue/15 text-medical-blue-light" :
                                "bg-dark-elevated text-dark-muted"
                            )}>
                                {drive.status === 'Active' && <Radio className="w-3 h-3 inline mr-1" />}
                                {drive.status === 'Active' ? 'LIVE NOW' : drive.status.toUpperCase()}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-dark-muted">
                                <MapPin className="w-3.5 h-3.5 text-dark-subtle" />
                                <span>{drive.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-dark-muted">
                                <Calendar className="w-3.5 h-3.5 text-dark-subtle" />
                                <span>{formatDate(drive.start_time)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-dark-muted">
                                <Clock className="w-3.5 h-3.5 text-dark-subtle" />
                                <span>{formatTime(drive.start_time)} — {formatTime(drive.end_time)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-dark-muted">
                                <Users className="w-3.5 h-3.5 text-dark-subtle" />
                                <span>{drive.booked_slots}/{drive.total_slots} slots booked</span>
                                <span className={clsx(
                                    "font-bold",
                                    drive.available_slots > 20 ? "text-neon-green" :
                                    drive.available_slots > 5 ? "text-amber-warn" : "text-blood-red"
                                )}>({drive.available_slots} left)</span>
                            </div>
                        </div>

                        <p className="text-xs text-dark-subtle mb-4 leading-relaxed">{drive.description}</p>

                        {/* Slot Progress Bar */}
                        <div className="mb-4">
                            <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-neon-green/80 to-neon-green transition-all duration-1000"
                                    style={{ width: `${(drive.booked_slots / drive.total_slots) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Swipe to Book */}
                        {drive.status !== 'Completed' && !booked.has(drive.id) ? (
                            <div
                                className="swipe-btn"
                                onMouseDown={() => handleSwipeStart(drive.id)}
                                onMouseMove={handleSwipeMove}
                                onMouseUp={handleSwipeEnd}
                                onMouseLeave={handleSwipeEnd}
                                onTouchStart={() => handleSwipeStart(drive.id)}
                                onTouchMove={handleSwipeMove}
                                onTouchEnd={handleSwipeEnd}
                            >
                                {/* Fill background */}
                                <div
                                    className="absolute inset-0 rounded-full bg-neon-green/10 transition-all"
                                    style={{ width: swiping === drive.id ? `${swipeProgress * 100}%` : '0%' }}
                                />

                                {/* Thumb */}
                                <div
                                    className="swipe-btn-thumb"
                                    style={{
                                        transform: swiping === drive.id
                                            ? `translateX(${swipeProgress * (200)}px)`
                                            : 'translateX(0)',
                                    }}
                                >
                                    <ChevronRight className="w-5 h-5 text-dark-bg" />
                                </div>

                                {/* Label */}
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-dark-muted pointer-events-none">
                                    {swiping === drive.id && swipeProgress > 0.7 ? '✅ Release to confirm!' : 'Slide to Book Appointment →'}
                                </span>
                            </div>
                        ) : booked.has(drive.id) ? (
                            <div className="flex items-center gap-2 justify-center py-3 text-neon-green text-sm font-semibold bg-neon-green/5 rounded-full border border-neon-green/20">
                                <CheckCircle2 className="w-4 h-4" />
                                Appointment Confirmed!
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 justify-center py-3 text-dark-subtle text-sm bg-dark-bg rounded-full">
                                Drive Completed
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Mini map area */}
            <div className="mt-8 bg-dark-card border border-dark-border rounded-2xl overflow-hidden" style={{ height: '250px' }}>
                <div className="relative w-full h-full bg-gradient-to-br from-dark-surface via-dark-bg to-dark-surface">
                    <div className="absolute inset-0 opacity-8" style={{
                        backgroundImage: 'linear-gradient(rgba(0,230,118,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />

                    {/* Drive markers */}
                    {drives.map((drive, i) => {
                        const positions = [
                            { top: '25%', left: '20%' },
                            { top: '40%', left: '60%' },
                            { top: '65%', left: '40%' },
                            { top: '50%', left: '80%' },
                        ];
                        return (
                            <div key={drive.id} className="absolute group" style={positions[i]}>
                                <div className={clsx(
                                    "w-4 h-4 rounded-full border-2",
                                    drive.status === 'Active' ? "bg-neon-green border-neon-green/50 shadow-lg shadow-neon-green/30 animate-pulse-dot" :
                                    drive.status === 'Upcoming' ? "bg-medical-blue-light border-medical-blue/50" :
                                    "bg-dark-subtle border-dark-border"
                                )} />
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-dark-bg/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] text-dark-text whitespace-nowrap border border-dark-border opacity-0 group-hover:opacity-100 transition-opacity">
                                    {drive.name}
                                </div>
                            </div>
                        );
                    })}

                    <div className="absolute bottom-3 left-3 bg-dark-bg/80 backdrop-blur-sm p-2 rounded-lg text-[10px] flex gap-3 border border-dark-border">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" /> Live</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-medical-blue-light rounded-full" /> Upcoming</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-dark-subtle rounded-full" /> Done</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
