import { useState, useEffect } from 'react';
import { getUserGoal, setOrUpdateGoal } from '../../services/goal.service';
import { User as UserIcon } from 'lucide-react';

const Profile = () => {
    const [goal, setGoal] = useState({ height: '', currentWeight: '', targetWeight: '', targetDate: '', dailyCalorieGoal: '' });
    const [loading, setLoading] = useState(true);
    const [savingGoal, setSavingGoal] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const goalData = await getUserGoal();
                if (goalData) {
                    setGoal({
                        height: goalData.height || '',
                        currentWeight: goalData.currentWeight || '',
                        targetWeight: goalData.targetWeight || '',
                        targetDate: goalData.targetDate || '',
                        dailyCalorieGoal: goalData.dailyCalorieGoal || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setGoal({ ...goal, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSavingGoal(true);
        try {
            const result = await setOrUpdateGoal({
                targetWeight: parseFloat(goal.targetWeight),
                targetDate: goal.targetDate,
                height: parseFloat(goal.height),
                currentWeight: parseFloat(goal.currentWeight)
            });
            // Result comes back with the AI computed calorie goal!
            setGoal(prev => ({ ...prev, dailyCalorieGoal: result.dailyCalorieGoal }));
            alert("Profile updated successfully! AI has set your daily calorie goal to: " + result.dailyCalorieGoal + " kcal");
        } catch (error) {
            console.error("Error saving profile", error);
            alert("Failed to update profile");
        } finally {
            setSavingGoal(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full text-textMuted">Loading profile...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Your Profile</h1>
                <p className="text-textMuted mt-1">Manage your physical goals and let our AI calculate your daily targets.</p>
            </div>

            <div className="card border-t-4 border-t-blue-500">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                        <UserIcon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Physical Profile & Targets</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-2">Height (cm)</label>
                            <input type="number" step="0.5" name="height" className="input-field" value={goal.height} onChange={handleChange} required placeholder="e.g. 175" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-2">Current Weight (kg)</label>
                            <input type="number" step="0.5" name="currentWeight" className="input-field" value={goal.currentWeight} onChange={handleChange} required placeholder="e.g. 80.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-2">Target Weight (kg)</label>
                            <input type="number" step="0.5" name="targetWeight" className="input-field" value={goal.targetWeight} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-2">Target Date</label>
                            <input type="date" name="targetDate" className="input-field" value={goal.targetDate} onChange={handleChange} required />
                        </div>
                    </div>

                    {goal.dailyCalorieGoal && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-sm text-emerald-400 font-semibold mb-1">AI Generated Daily Calorie Limit</p>
                                <p className="text-2xl font-bold text-white">{goal.dailyCalorieGoal} <span className="text-sm font-normal text-slate-400">kcal / day</span></p>
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={savingGoal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors w-full shadow-lg shadow-blue-500/20 mt-4 h-12">
                        {savingGoal ? 'AI is computing your new calorie target...' : 'Save Profile & Update Targets'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
