import { useState } from 'react';
import { addFoodLog, estimateFoodCalories } from '../../services/food.service';
import { Apple, Flame, Calendar, Tag, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const AddMeal = () => {
    const [formData, setFormData] = useState({
        mealType: 'BREAKFAST',
        foodName: '',
        calories: '',
        date: format(new Date(), 'yyyy-MM-dd')
    });
    const [loading, setLoading] = useState(false);
    const [estimatingId, setEstimatingId] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAutoEstimate = async () => {
        if (!formData.foodName.trim()) {
            alert("Please enter a food name and quantity first!");
            return;
        }
        setEstimatingId(true);
        try {
            const data = await estimateFoodCalories(formData.foodName);
            if (data && data.calories) {
                setFormData(prev => ({ ...prev, calories: data.calories }));
            }
        } catch (error) {
            console.error("Failed to estimate calories", error);
            alert("Failed to reach AI Coach for calorie estimation.");
        } finally {
            setEstimatingId(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            await addFoodLog({
                ...formData,
                calories: parseInt(formData.calories, 10)
            });
            setSuccess(true);
            setFormData({
                mealType: 'BREAKFAST',
                foodName: '',
                calories: '',
                date: format(new Date(), 'yyyy-MM-dd')
            });
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error adding meal", error);
            alert("Failed to add meal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Log Meal</h1>
                <p className="text-textMuted mt-1">Track your calorie intake for the day.</p>
            </div>

            <div className="card">
                {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 p-4 rounded-xl mb-6 flex items-center space-x-3">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">Meal logged successfully!</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-textMuted mb-2 pl-1">Meal Type</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <Tag size={18} className="text-textMuted" />
                            </div>
                            <select
                                name="mealType"
                                className="input-field pl-11 appearance-none"
                                value={formData.mealType}
                                onChange={handleChange}
                                required
                            >
                                <option value="BREAKFAST">Breakfast</option>
                                <option value="LUNCH">Lunch</option>
                                <option value="DINNER">Dinner</option>
                                <option value="SNACK">Snack</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-textMuted">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-textMuted mb-2 pl-1">Food Name / Description</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Apple size={18} className="text-textMuted" />
                            </div>
                            <input
                                type="text"
                                name="foodName"
                                className="input-field pl-11"
                                placeholder="e.g. Oatmeal with berries"
                                value={formData.foodName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-2 pl-1 flex items-center justify-between">
                                <span>Calories</span>
                                <button
                                    type="button"
                                    onClick={handleAutoEstimate}
                                    disabled={estimatingId || !formData.foodName}
                                    className="text-xs flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
                                >
                                    {estimatingId ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                    <span>AI Auto-Fill</span>
                                </button>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Flame size={18} className="text-textMuted" />
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    name="calories"
                                    className="input-field pl-11 focus:ring-purple-500"
                                    placeholder="350"
                                    value={formData.calories}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-textMuted text-sm">kcal</span>
                                </div>
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
                            {loading ? 'Logging...' : 'Log Meal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMeal;
