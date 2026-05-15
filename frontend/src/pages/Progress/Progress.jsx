import { useState, useEffect } from 'react';
import { getWorkouts } from '../../services/workout.service';
import { getAllFoodLogs } from '../../services/food.service';
import { getAiFeedback } from '../../services/goal.service';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Activity, Sparkles } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Progress = () => {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [aiFeedback, setAiFeedback] = useState(null);
    const [gettingAi, setGettingAi] = useState(false);

    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                const [workoutsData, foodLogsData] = await Promise.all([
                    getWorkouts(),
                    getAllFoodLogs()
                ]);
                
                // Aggregate by Date
                const aggregatedData = {};

                // Process Workouts (Volume)
                workoutsData.forEach(workout => {
                    const date = workout.date;
                    const volume = workout.effectiveVolume || (workout.sets * workout.reps * workout.weight);
                    if (!aggregatedData[date]) {
                        aggregatedData[date] = { date, volume: 0, calories: 0 };
                    }
                    aggregatedData[date].volume += volume;
                });

                // Process Food Logs (Calories)
                foodLogsData.forEach(food => {
                    const date = food.date;
                    if (!aggregatedData[date]) {
                        aggregatedData[date] = { date, volume: 0, calories: 0 };
                    }
                    aggregatedData[date].calories += food.calories;
                });
                
                const chartData = Object.values(aggregatedData).sort((a, b) => new Date(a.date) - new Date(b.date));
                setProgressData(chartData);
            } catch (error) {
                console.error("Error fetching progress data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgressData();
    }, []);

    const fetchAiCoachFeedback = async () => {
        setGettingAi(true);
        try {
            const data = await getAiFeedback();
            setAiFeedback(data.feedback);
        } catch (error) {
            console.error("Error fetching AI suggestions", error);
            setAiFeedback("Unable to reach the AI Coach. Please make sure your backend is running and the Gemini API key is configured in application.properties.");
        } finally {
            setGettingAi(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full text-textMuted">Loading progress data...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">AI Coach & Progress</h1>
                <p className="text-textMuted mt-1">Visualize your journey and get personalized AI suggestions based on your profile and logs.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                
                {/* AI Coach Card */}
                <div className="card border-t-4 border-t-purple-500 bg-gradient-to-br from-slate-900 to-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                                <Sparkles size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">AI Coach Suggestions</h3>
                        </div>
                        <button onClick={fetchAiCoachFeedback} disabled={gettingAi} className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
                            {gettingAi ? 'Thinking...' : 'Generate New Advice'}
                        </button>
                    </div>
                    
                    <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50 min-h-[120px]">
                        {aiFeedback ? (
                            <div className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                                {aiFeedback}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full pt-4 text-slate-500 space-y-2">
                                <Sparkles size={24} className="opacity-50" />
                                <p className="text-sm">Click "Generate New Advice" to get personalized feedback based on your profile and recent workouts.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Workout Volume & Meal Recovery Chart */}
                <div className="card">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Overall Progress: Training Volume vs Calorie Intake</h3>
                    </div>
                    
                    <div className="h-96 w-full">
                        {progressData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={progressData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="date" stroke="#94a3b8" tickFormatter={(tick) => format(parseISO(tick), 'MMM dd')} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="left" stroke="#10b981" orientation="left" axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="right" stroke="#f59e0b" orientation="right" axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem' }} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar yAxisId="left" dataKey="volume" name="Workout Volume" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Line yAxisId="right" type="monotone" dataKey="calories" name="Calorie Intake (Recovery)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-textMuted flex-col space-y-3 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                                <Activity size={32} className="text-slate-600" />
                                <p>Not enough workout or diet data to display chart.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Progress;
