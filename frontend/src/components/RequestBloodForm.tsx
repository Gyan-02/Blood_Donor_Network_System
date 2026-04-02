import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGeolocation } from '../hooks/useGeolocation';
import type { BloodType } from '../types/schema';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
    AlertCircle, Ambulance, CheckCircle2, MapPin, Upload, Phone,
    MessageSquare, ShieldCheck, Clock, Truck, Siren, Hospital, Zap,
    FileText, Image as ImageIcon, X
} from 'lucide-react';
import clsx from 'clsx';

const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const HOSPITALS = [
    'City Hospital', 'General Hospital', 'Apollo Blood Center',
    'Red Cross Blood Bank', 'SRM Medical Center', 'Fortis Hospital',
    'MIOT International', 'Global Hospitals', 'Kauvery Hospital',
];

const requestSchema = z.object({
    patientName: z.string().min(2, "Patient name is required"),
    bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as [string, ...string[]]),
    quantity: z.number().min(1).max(10),
    urgency: z.enum(['CRITICAL', 'PLANNED']),
    hospitalName: z.string().optional(),
    requiredBy: z.string().optional(),
    contactMethod: z.enum(['anonymous', 'whatsapp', 'sms']).optional(),
    transportNeeded: z.boolean().optional(),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export function RequestBloodForm() {
    const { latitude, longitude, loading: geoLoading, error: geoError } = useGeolocation();
    const [activeDonors, setActiveDonors] = useState(14);
    const [hospitalSearch, setHospitalSearch] = useState('');
    const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RequestFormValues>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            quantity: 1,
            urgency: 'CRITICAL',
            contactMethod: 'whatsapp',
            transportNeeded: false,
        }
    });

    const selectedBloodType = watch('bloodType');
    const urgency = watch('urgency');
    const contactMethod = watch('contactMethod');
    const transportNeeded = watch('transportNeeded');
    const isCritical = urgency === 'CRITICAL';

    // Simulate active donor count
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveDonors(prev => prev + (Math.random() > 0.5 ? 1 : -1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Simple map visualization using a dark tile image
    useEffect(() => {
        if (latitude && longitude && mapRef.current && !mapLoaded) {
            setMapLoaded(true);
        }
    }, [latitude, longitude, mapLoaded]);

    const filteredHospitals = HOSPITALS.filter(h =>
        h.toLowerCase().includes(hospitalSearch.toLowerCase())
    );

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            setUploadedFile(e.dataTransfer.files[0].name);
        }
    }, []);

    const onSubmit = (data: RequestFormValues) => {
        if (!latitude || !longitude) {
            alert("Location needed to find nearest blood bank.");
            return;
        }
        console.log("Submitting Request:", { ...data, latitude, longitude });
        alert(`Request Sent for ${data.bloodType}! Finding nearby donors...`);
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Page Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold text-dark-text font-[Outfit] flex items-center gap-3">
                        <Ambulance className="w-9 h-9 text-blood-red" />
                        Request Blood
                    </h1>
                    <p className="text-dark-muted mt-1">Find compatible donors near you instantly.</p>
                </div>

                <div
                    className={clsx(
                        "bg-dark-card rounded-2xl border p-6 md:p-8 transition-all duration-500",
                        isCritical
                            ? "border-blood-red/40 animate-glow-border"
                            : "border-dark-border"
                    )}
                    style={{ animationDuration: isCritical ? '2s' : '0s' }}
                >
                    {/* Geolocation Status Banner */}
                    <div className={clsx(
                        "mb-5 p-3 rounded-xl text-sm flex items-center gap-2 font-medium",
                        geoLoading ? "bg-medical-blue/10 text-medical-blue-light" :
                            geoError ? "bg-blood-red/10 text-blood-red" :
                                "bg-neon-green/10 text-neon-green"
                    )}>
                        {geoLoading ? (
                            <><MapPin className="w-4 h-4 animate-pulse" /> Locating you...</>
                        ) : geoError ? (
                            <><AlertCircle className="w-4 h-4" /> Location Error: {geoError}</>
                        ) : (
                            <><CheckCircle2 className="w-4 h-4" /> Location Found: {latitude?.toFixed(4)}, {longitude?.toFixed(4)}</>
                        )}
                    </div>

                    {/* Live Map Widget */}
                    {!geoLoading && !geoError && (
                        <div ref={mapRef} className="mb-5 rounded-xl overflow-hidden border border-dark-border bg-dark-surface relative" style={{ height: '200px' }}>
                            {/* Dark map visualization */}
                            <div className="absolute inset-0 bg-gradient-to-br from-dark-surface via-dark-bg to-dark-surface">
                                {/* Grid lines for map effect */}
                                <div className="absolute inset-0 opacity-10" style={{
                                    backgroundImage: 'linear-gradient(rgba(69,123,157,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(69,123,157,0.3) 1px, transparent 1px)',
                                    backgroundSize: '40px 40px'
                                }} />

                                {/* User location dot */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 bg-medical-blue rounded-full animate-pulse-dot shadow-lg shadow-medical-blue/40" />
                                    <div className="absolute -inset-6 border-2 border-medical-blue/30 rounded-full animate-radar" />
                                </div>

                                {/* Simulated donor dots */}
                                {[
                                    { top: '25%', left: '30%' }, { top: '60%', left: '70%' },
                                    { top: '35%', left: '65%' }, { top: '70%', left: '25%' },
                                    { top: '20%', left: '80%' }, { top: '75%', left: '55%' },
                                    { top: '45%', left: '15%' }, { top: '55%', left: '85%' },
                                ].map((pos, i) => (
                                    <div key={i} className="absolute" style={{ ...pos }}>
                                        <div className="map-marker-donor" style={{ animationDelay: `${i * 0.3}s` }} />
                                    </div>
                                ))}

                                {/* Blood bank markers */}
                                {[
                                    { top: '30%', left: '50%' }, { top: '65%', left: '40%' },
                                ].map((pos, i) => (
                                    <div key={`bank-${i}`} className="absolute" style={{ ...pos }}>
                                        <div className="map-marker-bank" />
                                    </div>
                                ))}

                                {/* Legend */}
                                <div className="absolute bottom-3 left-3 bg-dark-bg/80 backdrop-blur-sm p-2 rounded-lg text-xs flex gap-3 border border-dark-border">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-blood-red rounded-full" /> Donors
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-medical-blue rounded-full" /> Banks
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 bg-medical-blue rounded-full animate-pulse" /> You
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Real-Time Stats Banner */}
                    <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-neon-green/5 via-neon-green/10 to-neon-green/5 border border-neon-green/20 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-neon-green animate-pulse" />
                        <span className="text-neon-green font-semibold text-sm">
                            ⚡ {activeDonors} compatible donors active near this location right now
                        </span>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* 1. Urgency Toggle */}
                        <div className="grid grid-cols-2 gap-3 p-1.5 bg-dark-bg rounded-xl">
                            {['CRITICAL', 'PLANNED'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setValue('urgency', type as any)}
                                    className={clsx(
                                        "py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2",
                                        urgency === type
                                            ? (type === 'CRITICAL'
                                                ? 'bg-blood-red text-white shadow-lg shadow-blood-red/30'
                                                : 'bg-medical-blue text-white shadow-lg shadow-medical-blue/30')
                                            : "text-dark-muted hover:bg-dark-elevated"
                                    )}
                                >
                                    {type === 'CRITICAL' ? (
                                        <><Siren className="w-4 h-4" /> LIFE THREATENING</>
                                    ) : (
                                        <><Clock className="w-4 h-4" /> PLANNED SURGERY</>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* 2. Blood Type Grid */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-3">Required Blood Group</label>
                            <div className="grid grid-cols-4 gap-2">
                                {BLOOD_TYPES.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setValue('bloodType', type)}
                                        className={clsx(
                                            "h-14 rounded-xl font-bold text-lg border-2 transition-all duration-200 flex items-center justify-center",
                                            selectedBloodType === type
                                                ? "border-blood-red bg-blood-red/15 text-blood-red shadow-lg shadow-blood-red/10"
                                                : "border-dark-border text-dark-muted hover:border-dark-subtle hover:bg-dark-elevated"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                            {errors.bloodType && <p className="text-blood-red text-xs mt-1">{errors.bloodType.message}</p>}
                        </div>

                        {/* 3. Patient Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-muted mb-1">Patient Name</label>
                                <input
                                    {...register('patientName')}
                                    className="w-full p-3 rounded-xl bg-dark-bg border border-dark-border text-dark-text focus:ring-2 focus:ring-blood-red/50 focus:border-blood-red/50 focus:outline-none transition-all placeholder:text-dark-subtle"
                                    placeholder="e.g. John Doe"
                                />
                                {errors.patientName && <p className="text-blood-red text-xs mt-1">{errors.patientName.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-muted mb-1">Units Needed</label>
                                <input
                                    type="number"
                                    {...register('quantity', { valueAsNumber: true })}
                                    className="w-full p-3 rounded-xl bg-dark-bg border border-dark-border text-dark-text focus:ring-2 focus:ring-blood-red/50 focus:border-blood-red/50 focus:outline-none transition-all"
                                    min={1} max={10}
                                />
                            </div>
                        </div>

                        {/* 4. Hospital Autocomplete */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-dark-muted mb-1 flex items-center gap-2">
                                <Hospital className="w-4 h-4" /> Admitting Hospital & Ward
                            </label>
                            <input
                                value={hospitalSearch}
                                onChange={(e) => {
                                    setHospitalSearch(e.target.value);
                                    setShowHospitalDropdown(true);
                                    setValue('hospitalName', e.target.value);
                                }}
                                onFocus={() => setShowHospitalDropdown(true)}
                                onBlur={() => setTimeout(() => setShowHospitalDropdown(false), 200)}
                                className="w-full p-3 rounded-xl bg-dark-bg border border-dark-border text-dark-text focus:ring-2 focus:ring-medical-blue/50 focus:border-medical-blue/50 focus:outline-none transition-all placeholder:text-dark-subtle"
                                placeholder="Search hospital name..."
                            />
                            {showHospitalDropdown && filteredHospitals.length > 0 && (
                                <div className="absolute z-20 w-full mt-1 bg-dark-elevated border border-dark-border rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                                    {filteredHospitals.map((h) => (
                                        <button
                                            key={h}
                                            type="button"
                                            onMouseDown={() => {
                                                setHospitalSearch(h);
                                                setValue('hospitalName', h);
                                                setShowHospitalDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-dark-text hover:bg-dark-card transition-colors flex items-center gap-2"
                                        >
                                            <Hospital className="w-4 h-4 text-dark-muted" /> {h}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 5. Required By Time */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Required By
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { label: '2 Hours', value: '2h' },
                                    { label: 'Today', value: 'today' },
                                    { label: 'Tomorrow', value: 'tomorrow' },
                                    { label: 'Custom', value: 'custom' },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setValue('requiredBy', opt.value)}
                                        className={clsx(
                                            "py-2.5 rounded-lg text-xs font-semibold border transition-all",
                                            watch('requiredBy') === opt.value
                                                ? "border-amber-warn bg-amber-warn/10 text-amber-warn"
                                                : "border-dark-border text-dark-muted hover:bg-dark-elevated"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 6. Upload Medical Document */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Upload Medical Requisition / Doctor's Note
                                <span className="text-dark-subtle text-xs">(Optional — speeds up verification)</span>
                            </label>
                            <div
                                className={clsx("upload-zone", dragActive && "dragging")}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                {uploadedFile ? (
                                    <div className="flex items-center justify-center gap-2 text-neon-green">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <span className="text-sm font-medium">{uploadedFile}</span>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }} className="ml-2 text-dark-muted hover:text-blood-red">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 mx-auto mb-2 text-dark-muted" />
                                        <p className="text-sm text-dark-muted">Drag & drop or <span className="text-medical-blue-light font-medium">browse files</span></p>
                                        <div className="flex items-center justify-center gap-3 mt-2 text-xs text-dark-subtle">
                                            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>
                                            <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> JPG/PNG</span>
                                        </div>
                                    </>
                                )}
                                <input id="file-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => {
                                    if (e.target.files?.[0]) setUploadedFile(e.target.files[0].name);
                                }} />
                            </div>
                        </div>

                        {/* 7. Preferred Contact Method */}
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> Preferred Contact Method
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'anonymous' as const, label: 'Anonymous', icon: ShieldCheck, desc: 'Call Masking' },
                                    { value: 'whatsapp' as const, label: 'WhatsApp', icon: MessageSquare, desc: 'Direct Chat' },
                                    { value: 'sms' as const, label: 'SMS', icon: Phone, desc: 'Text Alert' },
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setValue('contactMethod', opt.value)}
                                        className={clsx(
                                            "p-3 rounded-xl border text-center transition-all",
                                            contactMethod === opt.value
                                                ? "border-medical-blue bg-medical-blue/10 text-medical-blue-light"
                                                : "border-dark-border text-dark-muted hover:bg-dark-elevated"
                                        )}
                                    >
                                        <opt.icon className="w-5 h-5 mx-auto mb-1" />
                                        <p className="text-xs font-semibold">{opt.label}</p>
                                        <p className="text-[10px] text-dark-subtle">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 8. Transport Assistance */}
                        <div className="p-4 rounded-xl bg-dark-bg border border-dark-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-dark-muted" />
                                    <span className="text-sm font-medium text-dark-text">Transport Assistance Needed?</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setValue('transportNeeded', !transportNeeded)}
                                    className={clsx(
                                        "w-12 h-7 rounded-full transition-all duration-300 relative",
                                        transportNeeded ? "bg-neon-green" : "bg-dark-border"
                                    )}
                                >
                                    <span className={clsx(
                                        "absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-300",
                                        transportNeeded ? "left-5.5" : "left-0.5"
                                    )} />
                                </button>
                            </div>
                            {transportNeeded && (
                                <p className="mt-3 text-xs text-amber-warn bg-amber-warn/5 p-2 rounded-lg border border-amber-warn/20 animate-fade-in">
                                    🚗 I need someone who can also arrange transport to the hospital. Nearby volunteers will be notified.
                                </p>
                            )}
                        </div>

                        {/* Submit Action */}
                        <button
                            type="submit"
                            disabled={geoLoading || !!geoError}
                            className={clsx(
                                "w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                                isCritical
                                    ? "bg-blood-red text-white animate-pulse-button"
                                    : "bg-dark-elevated text-dark-text hover:bg-dark-border border border-dark-border"
                            )}
                        >
                            {isCritical ? (
                                <><Siren className="w-5 h-5" /> SEND EMERGENCY ALERT</>
                            ) : (
                                'Request Blood Units'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
