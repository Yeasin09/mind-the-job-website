import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Linkedin, Video, Upload, User, MapPin, Play, Briefcase, Lock, Plus, Trash2, GraduationCap } from 'lucide-react';
import { MONTHS, YEARS, UK_CITIES, COUNTRIES } from '../data/formConstants';
import { supabase } from '../lib/supabaseClient';

export const ForCandidates = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Empty State
    const [profileData, setProfileData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        city: "",
        country: "United Kingdom",
        experienceYears: "",
        skills: [],
        bio: "",
        salary: "",
        notice: "",
        roleType: "",
        email: "",
        phone: "",
        workAuth: "Select Status",
        avatar: null,
        experienceList: [],
        educationList: []
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setIsLoggedIn(true);
                // 1. Fetch Main Profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                // 2. Fetch Experiences
                const { data: experiences } = await supabase
                    .from('experiences')
                    .select('*')
                    .eq('profile_id', user.id)
                    .order('start_year', { ascending: false }); // Note: DB field is start_date, map logic needed

                // 3. Fetch Education
                const { data: education } = await supabase
                    .from('education')
                    .select('*')
                    .eq('profile_id', user.id);

                if (profile) {
                    const nameParts = (profile.full_name || "").split(" ");

                    // Map Experiences (DB -> Frontend)
                    const mappedExperience = (experiences || []).map(exp => ({
                        id: exp.id,
                        role: exp.role,
                        company: exp.company,
                        description: exp.description || "",
                        // Parse dates (stored as YYYY-MM-DD or similar, simplified here)
                        startMonth: exp.start_date ? new Date(exp.start_date).toLocaleString('default', { month: 'short' }) : 'Jan',
                        startYear: exp.start_date ? new Date(exp.start_date).getFullYear().toString() : '2024',
                        endMonth: exp.is_current ? 'Present' : (exp.end_date ? new Date(exp.end_date).toLocaleString('default', { month: 'short' }) : 'Jan'),
                        endYear: exp.is_current ? 'Present' : (exp.end_date ? new Date(exp.end_date).getFullYear().toString() : '2024')
                    }));

                    // Map Education (DB -> Frontend)
                    const mappedEducation = (education || []).map(edu => ({
                        id: edu.id,
                        institution: edu.institution,
                        degree: edu.degree,
                        startMonth: edu.start_date ? new Date(edu.start_date).toLocaleString('default', { month: 'short' }) : 'Sep',
                        startYear: edu.start_date ? new Date(edu.start_date).getFullYear().toString() : '2020',
                        endMonth: edu.end_date ? new Date(edu.end_date).toLocaleString('default', { month: 'short' }) : 'Jun',
                        endYear: edu.end_date ? new Date(edu.end_date).getFullYear().toString() : '2023'
                    }));

                    setProfileData(prev => ({
                        ...prev,
                        firstName: nameParts[0] || "",
                        middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "",
                        lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
                        email: profile.email || user.email,
                        city: profile.city || "",
                        country: profile.country || "United Kingdom",
                        bio: profile.bio || "",
                        phone: profile.phone || "",
                        avatar: profile.avatar_url,
                        experienceYears: "", // Not stored in DB explicitly in schema yet, keep local or add column
                        experienceList: mappedExperience,
                        educationList: mappedEducation
                    }));
                } else {
                    // Fallback: Use Auth Metadata if profile doesn't exist yet
                    const meta = user.user_metadata || {};
                    setProfileData(prev => ({
                        ...prev,
                        email: user.email,
                        firstName: meta.first_name || (meta.full_name ? meta.full_name.split(' ')[0] : ""),
                        lastName: meta.last_name || (meta.full_name ? meta.full_name.split(' ').slice(1).join(' ') : "")
                    }));
                    setIsEditMode(true);
                }
            } else {
                setIsLoggedIn(false);
                setIsEditMode(true);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    };



    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileData({ ...profileData, avatar: imageUrl });
        }
    };

    const getFullName = () => {
        return `${profileData.firstName} ${profileData.middleName} ${profileData.lastName}`.trim();
    };

    const handleSaveProfile = async () => {
        try {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("You must be logged in to save.");
                return;
            }

            // 1. Save Main Profile
            const profileUpdates = {
                id: user.id,
                email: profileData.email,
                full_name: `${profileData.firstName} ${profileData.middleName} ${profileData.lastName}`.trim(),
                city: profileData.city,
                country: profileData.country,
                bio: profileData.bio,
                phone: profileData.phone,
                updated_at: new Date(),
            };

            const { error: profileError } = await supabase.from('profiles').upsert(profileUpdates);
            if (profileError) throw profileError;

            // 2. Save Experiences (Sync: Delete all logic for simplicity or Upsert)
            // Strategy: Upsert all current items. If ID is number (frontend-only), remove it so DB gen UUID.
            const experienceUpserts = profileData.experienceList.map(exp => {
                const isNew = typeof exp.id === 'number';
                return {
                    id: isNew ? undefined : exp.id, // Let DB gen ID if new
                    profile_id: user.id,
                    role: exp.role,
                    company: exp.company,
                    description: exp.description,
                    is_current: exp.endYear === 'Present' || exp.endMonth === 'Present',
                    start_date: `${exp.startYear}-${new Date(`${exp.startMonth} 1, 2000`).getMonth() + 1}-01`,
                    end_date: (exp.endYear === 'Present' || exp.endMonth === 'Present') ? null
                        : `${exp.endYear}-${new Date(`${exp.endMonth} 1, 2000`).getMonth() + 1}-01`
                };
            });

            // First, delete items not in the list (Clean up deleted items)
            // Simplified: We accept that we won't delete logic right now to avoid complex diffing, 
            // OR we just upsert. If user deleted in UI, it stays in DB for now (v1 limitation).
            // BETTER: Delete all for this user and rewrite? Safer for consistency.
            await supabase.from('experiences').delete().eq('profile_id', user.id);
            if (experienceUpserts.length > 0) {
                await supabase.from('experiences').insert(experienceUpserts);
            }

            // 3. Save Education
            const educationUpserts = profileData.educationList.map(edu => {
                return {
                    profile_id: user.id,
                    institution: edu.institution,
                    degree: edu.degree,
                    start_date: `${edu.startYear}-${new Date(`${edu.startMonth} 1, 2000`).getMonth() + 1}-01`,
                    end_date: `${edu.endYear}-${new Date(`${edu.endMonth} 1, 2000`).getMonth() + 1}-01`
                };
            });

            await supabase.from('education').delete().eq('profile_id', user.id);
            if (educationUpserts.length > 0) {
                await supabase.from('education').insert(educationUpserts);
            }

            alert("Profile saved successfully!");
            setIsEditMode(false);
            fetchProfile(); // Refresh IDs
        } catch (error) {
            console.error(error);
            alert("Error saving profile: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-muted pt-32 pb-20">
            <div className="container mx-auto px-4 md:px-6">

                {/* Header / Import Section */}
                {!isLoggedIn && (
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-primary mb-4">Create your Smart Profile</h1>
                        <p className="text-text-muted mb-8">Ditch the PDF. Get discovered by top tech teams with a live, interactive profile.</p>

                        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    variant="secondary"
                                    onClick={() => alert("LinkedIn Import Coming Soon!")}
                                    className="bg-[#0077b5] hover:bg-[#0077b5]/90 text-white px-8 py-4 text-lg rounded-xl shadow-xl flex items-center gap-3 border-0"
                                >
                                    <Linkedin size={18} />
                                    Import from LinkedIn
                                </Button>
                            </motion.div>


                        </div>
                        <p className="text-xs text-gray-400 mt-3">Or fill in your details manually to see the live profile.</p>
                    </div>
                )}

                {isLoggedIn && (
                    <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider leading-none">Logged in as</p>
                                <p className="text-primary font-bold">{getFullName()}</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsEditMode(!isEditMode)}
                            className={`${isEditMode ? 'bg-primary' : 'bg-secondary'} text-white px-6 py-2 rounded-xl font-bold shadow-md hover:shadow-lg transition-all`}
                        >
                            {isEditMode ? 'View Live Profile' : 'Edit My Profile'}
                        </Button>
                    </div>
                )}

                {/* Profile Card Visualization */}
                <motion.div
                    layout
                    className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                >
                    {/* Fixed Banner (Gradient) */}
                    <div className="h-32 bg-gradient-to-r from-primary via-[#2C3E50] to-secondary relative">
                        <div className="absolute inset-0 bg-white/5 pattern-dots"></div>
                    </div>

                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Avatar */}
                            <div className="-mt-16 relative z-20 flex-shrink-0">
                                <div className={`w-32 h-32 rounded-3xl border-4 bg-gray-200 shadow-md overflow-hidden relative transition-colors ${isEditMode ? 'border-white group cursor-pointer hover:border-secondary' : 'border-secondary shadow-lg'}`}>
                                    {isEditMode && (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0 z-50 cursor-pointer"
                                        />
                                    )}
                                    {profileData.avatar ? (
                                        <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 group-hover:bg-gray-200 transition-colors">
                                            <div className="flex flex-col items-center">
                                                <Upload size={24} className="mb-1 opacity-50" />
                                                <span className="text-[10px] font-bold uppercase text-gray-500 text-center leading-tight">Upload<br />Image</span>
                                                <span className="text-[9px] text-gray-400 mt-1">Max 5MB</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Main Info */}
                            <div className="pt-4 flex-1 w-full">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                        <div className="flex-1 space-y-3 w-full">
                                            {/* Name Section */}
                                            {isEditMode ? (
                                                <div className="grid grid-cols-3 gap-2 w-full max-w-lg">
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-gray-400">First Name *</label>
                                                        <input value={profileData.firstName} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })} className="w-full font-bold text-lg border-b border-gray-200 focus:border-secondary focus:outline-none" placeholder="First" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-gray-400">Middle</label>
                                                        <input value={profileData.middleName} onChange={(e) => setProfileData({ ...profileData, middleName: e.target.value })} className="w-full font-bold text-lg border-b border-gray-200 focus:border-secondary focus:outline-none" placeholder="Middle" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] uppercase font-bold text-gray-400">Last Name *</label>
                                                        <input value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })} className="w-full font-bold text-lg border-b border-gray-200 focus:border-secondary focus:outline-none" placeholder="Last" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <h1 className="text-3xl font-bold text-primary">{getFullName()}</h1>
                                            )}

                                            {/* Location & Experience Line */}
                                            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm font-medium">
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                                    {isEditMode ? (
                                                        <div className="flex gap-2">
                                                            <select value={profileData.city} onChange={(e) => setProfileData({ ...profileData, city: e.target.value })} className="bg-transparent border-b border-gray-200 focus:border-secondary focus:outline-none text-sm w-32">
                                                                <option value="">Select City</option>
                                                                {UK_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                            </select>
                                                            <select value={profileData.country} onChange={(e) => setProfileData({ ...profileData, country: e.target.value })} className="bg-transparent border-b border-gray-200 focus:border-secondary focus:outline-none text-sm w-32">
                                                                <option value="">Select Country</option>
                                                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                            </select>
                                                        </div>
                                                    ) : (
                                                        <span>{profileData.city ? `${profileData.city}, ` : ''}{profileData.country}</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {isEditMode ? (
                                                        <>
                                                            <Briefcase size={14} className="text-gray-400" />
                                                            <span className="text-gray-400">Experience</span>
                                                            <input
                                                                value={profileData.experienceYears}
                                                                onChange={(e) => setProfileData({ ...profileData, experienceYears: e.target.value })}
                                                                placeholder="5"
                                                                className="bg-transparent border-b border-gray-200 focus:border-secondary text-center focus:outline-none w-8 font-bold text-primary"
                                                            />
                                                            <span>Years</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Briefcase size={14} className="text-gray-400" />
                                                            <span className="mr-1">Experience</span>
                                                            <span className="font-bold text-primary ml-1">{profileData.experienceYears} Years</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Tag */}
                                        <div className=" mt-2 md:mt-0">
                                            {isEditMode ? (
                                                <select
                                                    value={profileData.workAuth || "Open to work"}
                                                    onChange={(e) => setProfileData({ ...profileData, workAuth: e.target.value })}
                                                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border-none outline-none cursor-pointer focus:ring-2 focus:ring-green-300"
                                                >
                                                    <option>UK Citizen</option>
                                                    <option>Skilled Worker Visa</option>
                                                    <option>Graduate Visa</option>
                                                    <option>Indefinite Leave to Remain</option>
                                                    <option>Needs Sponsorship</option>
                                                </select>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                                                    {profileData.workAuth || "Open to work"}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Private Contact Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 p-4 bg-surface-muted rounded-2xl border border-gray-100 relative overflow-hidden group">
                                        {!isEditMode && <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity"><Lock size={14} className="text-gray-300" /></div>}
                                        <div>
                                            <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Email Address *</label>
                                            {isEditMode ? (
                                                <input
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                    placeholder="e.g. name@example.com"
                                                    className="w-full bg-transparent border-b border-gray-200 focus:border-secondary focus:outline-none py-1 text-sm font-medium text-primary mt-0.5"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-primary mt-0.5">{profileData.email || "Not Provided"}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Phone Number *</label>
                                            {isEditMode ? (
                                                <input
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    placeholder="e.g. +44 7700 900..."
                                                    className="w-full bg-transparent border-b border-gray-200 focus:border-secondary focus:outline-none py-1 text-sm font-medium text-primary mt-0.5"
                                                />
                                            ) : (
                                                <p className="text-sm font-bold text-primary mt-0.5">{profileData.phone || "Not Provided"}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Professional Summary (Moved Up) */}
                                    <div className="mb-8">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Professional Summary</label>
                                        {isEditMode ? (
                                            <div className="relative">
                                                <textarea
                                                    value={profileData.bio}
                                                    onChange={(e) => { if (e.target.value.length <= 500) setProfileData({ ...profileData, bio: e.target.value }) }}
                                                    placeholder="Tell us about yourself..."
                                                    className="w-full bg-surface-muted border-2 border-transparent focus:bg-white focus:border-secondary/20 rounded-2xl p-4 text-gray-600 leading-relaxed outline-none transition-all h-32 placeholder-gray-300"
                                                />
                                                <span className="absolute bottom-4 right-4 text-xs text-gray-400 font-medium bg-white/50 px-2 rounded">{profileData.bio.length}/500</span>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 leading-relaxed font-medium">{profileData.bio}</p>
                                        )}
                                    </div>

                                    {/* Skills (Moved Below Summary) */}
                                    <div className="mb-8">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Skills</label>
                                        <div className="flex flex-wrap gap-2">
                                            {profileData.skills.map((skill, idx) => (
                                                <span key={idx} className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 group ${isEditMode ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-default' : 'bg-secondary/10 text-secondary border border-secondary/20 shadow-sm'}`}>
                                                    {skill}
                                                    {isEditMode && (
                                                        <button
                                                            onClick={() => {
                                                                const newSkills = profileData.skills.filter((_, i) => i !== idx);
                                                                setProfileData({ ...profileData, skills: newSkills });
                                                            }}
                                                            className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-100 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            &times;
                                                        </button>
                                                    )}
                                                </span>
                                            ))}
                                            {isEditMode && (
                                                <button
                                                    onClick={() => {
                                                        const skill = prompt("Enter a new skill:");
                                                        if (skill) setProfileData({ ...profileData, skills: [...profileData.skills, skill] });
                                                    }}
                                                    className="px-4 py-1.5 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl text-sm font-bold hover:border-secondary hover:text-secondary transition-all"
                                                >
                                                    + Add
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Education (Moved Below Summary & Skills) */}
                                    <div className="mb-12">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                                <GraduationCap size={20} className="text-secondary" />
                                                Education
                                            </h3>
                                            {isEditMode && (
                                                <button
                                                    onClick={() => {
                                                        const newItem = { id: Date.now(), institution: "", degree: "", startMonth: "Sep", startYear: "2020", endMonth: "Jun", endYear: "2023" };
                                                        setProfileData({ ...profileData, educationList: [...profileData.educationList, newItem] });
                                                    }}
                                                    className="text-xs font-bold text-secondary hover:text-secondary-dark transition-colors px-3 py-1.5 bg-secondary/5 rounded-lg border border-secondary/10 flex items-center gap-1"
                                                >
                                                    <Plus size={14} /> Add Education
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            {profileData.educationList.map((edu, idx) => (
                                                <div key={edu.id} className={`group relative ${isEditMode ? 'p-4 bg-gray-50 rounded-xl border border-gray-100' : 'pl-4 border-l-2 border-gray-100'}`}>
                                                    {isEditMode && <button onClick={() => {
                                                        const newList = profileData.educationList.filter((_, i) => i !== idx);
                                                        setProfileData({ ...profileData, educationList: newList });
                                                    }} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>}

                                                    {isEditMode ? (
                                                        <div className="grid gap-2">
                                                            <input value={edu.institution} onChange={(e) => {
                                                                const list = [...profileData.educationList]; list[idx].institution = e.target.value; setProfileData({ ...profileData, educationList: list });
                                                            }} placeholder="Institution Name" className="font-bold text-gray-800 bg-transparent border-b border-gray-300 focus:border-secondary focus:outline-none w-full" />

                                                            <input value={edu.degree} onChange={(e) => {
                                                                const list = [...profileData.educationList]; list[idx].degree = e.target.value; setProfileData({ ...profileData, educationList: list });
                                                            }} placeholder="Degree / Course" className="text-sm font-medium text-secondary bg-transparent border-b border-gray-300 focus:border-secondary focus:outline-none w-full" />

                                                            <div className="flex gap-2 mt-2">
                                                                <select value={edu.startMonth} onChange={(e) => { const list = [...profileData.educationList]; list[idx].startMonth = e.target.value; setProfileData({ ...profileData, educationList: list }); }} className="text-xs bg-white border rounded p-1">{MONTHS.map(m => <option key={m}>{m}</option>)}</select>
                                                                <select value={edu.startYear} onChange={(e) => { const list = [...profileData.educationList]; list[idx].startYear = e.target.value; setProfileData({ ...profileData, educationList: list }); }} className="text-xs bg-white border rounded p-1">{YEARS.map(y => <option key={y}>{y}</option>)}</select>
                                                                <span className="text-gray-400">-</span>
                                                                <select value={edu.endMonth} onChange={(e) => { const list = [...profileData.educationList]; list[idx].endMonth = e.target.value; setProfileData({ ...profileData, educationList: list }); }} className="text-xs bg-white border rounded p-1">{MONTHS.map(m => <option key={m}>{m}</option>)}</select>
                                                                <select value={edu.endYear} onChange={(e) => { const list = [...profileData.educationList]; list[idx].endYear = e.target.value; setProfileData({ ...profileData, educationList: list }); }} className="text-xs bg-white border rounded p-1">{YEARS.map(y => <option key={y}>{y}</option>)}</select>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <h4 className="font-bold text-gray-900">{edu.institution}</h4>
                                                            <p className="text-sm text-secondary font-medium">{edu.degree}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{edu.startMonth} {edu.startYear} - {edu.endMonth} {edu.endYear}</p>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Experience Section */}
                                    <div className="pt-10 border-t border-gray-100">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                                <Briefcase size={20} className="text-secondary" />
                                                Professional Journey
                                            </h3>
                                            {isEditMode && (
                                                <button
                                                    onClick={() => {
                                                        const newJob = { id: Date.now(), role: "", company: "", startMonth: "Jan", startYear: "2024", endMonth: "Present", endYear: "2024", description: "" };
                                                        setProfileData({ ...profileData, experienceList: [...profileData.experienceList, newJob] });
                                                    }}
                                                    className="text-xs font-bold text-secondary hover:text-secondary-dark transition-colors px-3 py-1.5 bg-secondary/5 rounded-lg border border-secondary/10 flex items-center gap-1"
                                                >
                                                    <Plus size={14} /> Add Experience
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-10">
                                            {profileData.experienceList.length > 0 ? (
                                                profileData.experienceList.map((job, idx) => (
                                                    <div key={job.id} className={`relative group transition-all ${isEditMode ? 'p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100' : 'pl-8 border-l-2 border-gray-100'}`}>
                                                        {!isEditMode && <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-secondary"></div>}

                                                        {isEditMode && (
                                                            <button
                                                                onClick={() => {
                                                                    const newList = profileData.experienceList.filter((_, i) => i !== idx);
                                                                    setProfileData({ ...profileData, experienceList: newList });
                                                                }}
                                                                className="absolute -right-2 -top-2 w-7 h-7 bg-white border border-gray-100 text-gray-400 rounded-full flex items-center justify-center hover:text-red-500 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        )}

                                                        <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-3">
                                                            <div className="flex-1 w-full">
                                                                {isEditMode ? (
                                                                    <div className="space-y-2">
                                                                        <input value={job.role} onChange={(e) => {
                                                                            const newList = [...profileData.experienceList]; newList[idx].role = e.target.value; setProfileData({ ...profileData, experienceList: newList });
                                                                        }} placeholder="Job Title" className="font-bold text-lg text-primary bg-transparent border-b border-gray-200 focus:border-secondary focus:outline-none w-full" />
                                                                        <input value={job.company} onChange={(e) => {
                                                                            const newList = [...profileData.experienceList]; newList[idx].company = e.target.value; setProfileData({ ...profileData, experienceList: newList });
                                                                        }} placeholder="Company" className="text-secondary font-bold bg-transparent border-b border-gray-200 focus:border-secondary focus:outline-none w-full" />

                                                                        <div className="flex gap-2 items-center">
                                                                            <select value={job.startMonth} onChange={(e) => { const list = [...profileData.experienceList]; list[idx].startMonth = e.target.value; setProfileData({ ...profileData, experienceList: list }); }} className="text-xs bg-white border rounded p-1">{MONTHS.map(m => <option key={m}>{m}</option>)}</select>
                                                                            <select value={job.startYear} onChange={(e) => { const list = [...profileData.experienceList]; list[idx].startYear = e.target.value; setProfileData({ ...profileData, experienceList: list }); }} className="text-xs bg-white border rounded p-1">{YEARS.map(y => <option key={y}>{y}</option>)}</select>
                                                                            <span className="text-gray-400">-</span>
                                                                            <select value={job.endMonth} onChange={(e) => { const list = [...profileData.experienceList]; list[idx].endMonth = e.target.value; setProfileData({ ...profileData, experienceList: list }); }} className="text-xs bg-white border rounded p-1"><option>Present</option>{MONTHS.map(m => <option key={m}>{m}</option>)}</select>
                                                                            <select value={job.endYear} onChange={(e) => { const list = [...profileData.experienceList]; list[idx].endYear = e.target.value; setProfileData({ ...profileData, experienceList: list }); }} className="text-xs bg-white border rounded p-1">{YEARS.map(y => <option key={y}>{y}</option>)}</select>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <h4 className="font-bold text-lg text-primary leading-none">{job.role}</h4>
                                                                        <p className="text-secondary font-bold mt-1">{job.company}</p>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="text-right flex-shrink-0">
                                                                {!isEditMode && (
                                                                    <span className="text-sm font-bold text-gray-400">{job.startMonth} {job.startYear} - {job.endMonth} {job.endYear == 'Present' ? '' : job.endYear}</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {isEditMode ? (
                                                            <textarea
                                                                value={job.description}
                                                                onChange={(e) => {
                                                                    const newList = [...profileData.experienceList];
                                                                    newList[idx].description = e.target.value;
                                                                    setProfileData({ ...profileData, experienceList: newList });
                                                                }}
                                                                placeholder="Responsibilities..."
                                                                className="w-full bg-transparent text-sm text-gray-600 resize-none focus:outline-none min-h-[60px] pb-2 border-b border-gray-200 focus:border-secondary/20"
                                                            />
                                                        ) : (
                                                            <p className="text-sm text-gray-600 leading-relaxed font-medium">{job.description}</p>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                                                    <p className="text-gray-400 font-medium">No professional milestones listed yet.</p>
                                                    {isEditMode && <p className="text-xs text-secondary font-bold mt-1 uppercase tracking-widest">Add your first role above</p>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Extra Details Grid */}
                        <div className="grid md:grid-cols-2 gap-8 mt-12 pt-12 border-t border-gray-100 px-8">
                            <div className="bg-surface-muted rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[240px] border-2 border-dashed border-gray-200 hover:border-secondary transition-all cursor-pointer group relative overflow-hidden bg-gradient-to-br from-white to-surface-muted">
                                {isEditMode ? (
                                    <>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                            onChange={(e) => { if (e.target.files[0]) alert(`Mock Upload: ${e.target.files[0].name} selected!`); }}
                                        />
                                        <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all mb-4">
                                            <Video size={24} className="ml-1" />
                                        </div>
                                        <h4 className="font-bold text-primary">Video Introduction</h4>
                                        <p className="text-xs text-text-muted mt-2 max-w-[200px]">Upload a 60s pitch to transform your profile into a hiring magnet.</p>
                                        <span className="mt-4 px-4 py-1.5 bg-white rounded-lg text-[10px] font-black uppercase text-secondary shadow-sm">Click to Upload</span>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary mb-4 border border-primary/10">
                                            <Play size={32} className="ml-1" />
                                        </div>
                                        <h4 className="font-bold text-xl text-primary">Watch 60s Pitch</h4>
                                        <p className="text-sm text-gray-500 mt-1 font-medium italic">"Hi, I'm {profileData.firstName}..."</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: 'Expected Salary', value: profileData.salary, key: 'salary', placeholder: 'e.g. £70k' },
                                    { label: 'Notice Period', value: profileData.notice, key: 'notice', placeholder: 'e.g. 1 Month' },
                                ].map((field) => (
                                    <div key={field.key} className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-secondary/30 transition-all">
                                        <span className="text-xs font-black uppercase text-gray-400 tracking-widest leading-none">{field.label}</span>
                                        {isEditMode ? (
                                            <input
                                                value={field.value}
                                                onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                                                className="font-bold text-primary text-right bg-transparent focus:outline-none border-b border-transparent focus:border-secondary w-32 text-sm"
                                                placeholder={field.placeholder}
                                            />
                                        ) : (
                                            <span className="font-bold text-primary text-sm">{field.value || "Not Set"}</span>
                                        )}
                                    </div>
                                ))}

                                {/* Preferred Roles Dropdown */}
                                <div className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-secondary/30 transition-all">
                                    <span className="text-xs font-black uppercase text-gray-400 tracking-widest leading-none">Preferred Roles</span>
                                    {isEditMode ? (
                                        <select
                                            value={profileData.roleType}
                                            onChange={(e) => setProfileData({ ...profileData, roleType: e.target.value })}
                                            className="font-bold text-primary text-right bg-transparent focus:outline-none border-none text-sm cursor-pointer"
                                        >
                                            <option value="">Select...</option>
                                            <option value="Remote">Remote</option>
                                            <option value="Hybrid">Hybrid</option>
                                            <option value="In-Person">In-Person</option>
                                            <option value="Remote / Hybrid">Remote / Hybrid</option>
                                        </select>
                                    ) : (
                                        <span className="font-bold text-primary text-sm">{profileData.roleType || "Not Set"}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Save Action Bar (Only in Edit Mode) */}
                        {isEditMode && (
                            <div className="bg-gray-50 border-t border-gray-100 p-8 flex justify-center mt-12 rounded-b-3xl">
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={isLoading}
                                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-12 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoggedIn ? (isLoading ? 'Saving...' : 'Save & View Profile') : 'Save Profile Changes'}
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
