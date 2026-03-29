import { useState } from 'react';
import { addWorkout } from '../../services/workout.service';
import { Activity, Calendar, Hash, Weight, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const AddWorkout = () => {
    const [formData, setFormData] = useState({
        exerciseName: '',
        sets: '',
        reps: '',
        weight: '',
        date: format(new Date(), 'yyyy-MM-dd')
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            await addWorkout({
                ...formData,
                sets: parseInt(formData.sets),
                reps: parseInt(formData.reps),
                weight: parseFloat(formData.weight)
            });
            setSuccess(true);
            setFormData({
                exerciseName: '',
                sets: '',
                reps: '',
                weight: '',
                date: format(new Date(), 'yyyy-MM-dd')
            });
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error adding workout", error);
            alert("Failed to add workout");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Log Workout</h1>
                <p className="text-textMuted mt-1">Record your exercises and track your sets and reps.</p>
            </div>

            <div className="card">
                {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 p-4 rounded-xl mb-6 flex items-center space-x-3">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">Workout logged successfully!</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-textMuted mb-2 pl-1">Exercise Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Activity size={18} className="text-textMuted" />
                            </div>
                            <input
                                type="text"
                                name="exerciseName"
                                className="input-field pl-11"
                                placeholder="e.g. Bench Press"
                                value={formData.exerciseName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-2 pl-1">Sets</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Hash size={18} className="text-textMuted" />
                                </div>
                                <input
                                    type="number"
                                    name="sets"
                                    min="1"
                                    className="input-field pl-11"
                                    placeholder="3"
                                    value={formData.sets}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-2 pl-1">Reps</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Hash size={18} className="text-textMuted" />
                                </div>
                                <input
                                    type="number"
                                    name="reps"
                                    min="1"
                                    className="input-field pl-11"
                                    placeholder="10"
                                    value={formData.reps}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-2 pl-1">Weight (kg/lbs)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Weight size={18} className="text-textMuted" />
                                </div>
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    name="weight"
                                    className="input-field pl-11"
                                    placeholder="60.5"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-2 pl-1">Date</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Calendar size={18} className="text-textMuted" />
                                </div>
                                <input
                                    type="date"
                                    name="date"
                                    className="input-field pl-11"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-lg shadow-lg shadow-primary/20"
                        >
                            {loading ? 'Logging...' : 'Log Workout'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddWorkout;
