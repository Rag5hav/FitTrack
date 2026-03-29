import { useState, useEffect } from 'react';
import { Activity, Flame, Target } from 'lucide-react';
import { getWorkouts } from '../../services/workout.service';
import { getDailyTotalCalories } from '../../services/food.service';
import { getUserGoal } from '../../services/goal.service';
import { format } from 'date-fns';

const Dashboard = () => {
    const [workouts, setWorkouts] = useState([]);
    const [calories, setCalories] = useState(0);
    const [goal, setGoal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const today = format(new Date(), 'yyyy-MM-dd');
                const [workoutsData, caloriesData, goalData] = await Promise.all([
                    getWorkouts(),
                    getDailyTotalCalories(today),
                    getUserGoal()
                ]);
                
                setWorkouts(workoutsData.slice(0, 5)); // Keep only recent 5
                setCalories(caloriesData || 0);
                if (goalData) setGoal(goalData);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-full text-textMuted">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-textMuted mt-1">Welcome back. Here's your fitness overview for today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Calories Card */}
                <div className="card flex items-center p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all duration-500"></div>
                    <div className="p-4 bg-rose-500/20 text-rose-500 rounded-2xl mr-5">
                        <Flame size={28} />
                    </div>
                    <div>
                        <p className="text-textMuted text-sm font-medium mb-1">Calories Today</p>
                        <h3 className="text-3xl font-bold text-white">{calories} <span className="text-base font-normal text-textMuted ml-1">kcal</span></h3>
                    </div>
                </div>

                {/* Workouts Card */}
                <div className="card flex items-center p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
                    <div className="p-4 bg-emerald-500/20 text-emerald-500 rounded-2xl mr-5">
                        <Activity size={28} />
                    </div>
                    <div>
                        <p className="text-textMuted text-sm font-medium mb-1">Total Workouts</p>
                        <h3 className="text-3xl font-bold text-white">{workouts.length}</h3>
                    </div>
                </div>

                {/* Goal Card */}
                <div className="card flex items-center p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
                    <div className="p-4 bg-blue-500/20 text-blue-500 rounded-2xl mr-5">
                        <Target size={28} />
                    </div>
                    <div>
                        <p className="text-textMuted text-sm font-medium mb-1">Target Weight</p>
                        <h3 className="text-3xl font-bold text-white">
                            {goal?.targetWeight ? `${goal.targetWeight}` : '--'} <span className="text-base font-normal text-textMuted ml-1">kg</span>
                        </h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Workouts */}
                <div className="card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Recent Workouts</h3>
                    </div>
                    
                    {workouts.length === 0 ? (
                        <div className="text-center py-8 text-textMuted bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                            No workouts logged yet. Time to hit the gym!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {workouts.map((workout) => (
                                <div key={workout.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/50">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                                            <Activity size={18} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{workout.exerciseName}</p>
                                            <p className="text-xs text-textMuted">{workout.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-white">{workout.sets}x{workout.reps}</p>
                                        <p className="text-xs text-emerald-400">{workout.weight} kg</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Calorie Goal Progress */}
                <div className="card p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-bold text-white w-full text-left mb-8">Daily Goal Progress</h3>
                    
                    <div className="relative w-48 h-48 mb-6">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="8" />
                            <circle 
                                cx="50" 
                                cy="50" 
                                r="40" 
                                fill="transparent" 
                                stroke="#10b981" 
                                strokeWidth="8" 
                                strokeDasharray="251.2" 
                                strokeDashoffset={
                                    goal?.dailyCalorieGoal 
                                        ? 251.2 - (251.2 * Math.min(calories / goal.dailyCalorieGoal, 1)) 
                                        : 251.2
                                } 
                                strokeLinecap="round" 
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white">{calories}</span>
                            <span className="text-xs text-textMuted uppercase tracking-wider mt-1">
                                / {goal?.dailyCalorieGoal || 2000} kcal
                            </span>
                        </div>
                    </div>
                    <p className="text-textMuted">
                        {goal?.dailyCalorieGoal && calories >= goal.dailyCalorieGoal 
                            ? <span className="text-emerald-400 font-medium">Daily goal reached! Awesome job!</span> 
                            : "Keep eating healthy to hit your goal."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
