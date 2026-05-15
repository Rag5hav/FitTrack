package com.fitness.tracker.service;

import com.fitness.tracker.dto.WorkoutDTO;
import com.fitness.tracker.model.User;
import com.fitness.tracker.model.Workout;
import com.fitness.tracker.repository.UserRepository;
import com.fitness.tracker.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final AiSuggestionService aiSuggestionService;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public WorkoutDTO addWorkout(WorkoutDTO workoutDTO) {
        User user = getCurrentUser();
        
        Double effectiveVolume = aiSuggestionService.calculateEffectiveVolume(
                workoutDTO.getExerciseName(),
                workoutDTO.getSets(),
                workoutDTO.getReps(),
                workoutDTO.getWeight()
        );
        
        Workout workout = Workout.builder()
                .exerciseName(workoutDTO.getExerciseName())
                .sets(workoutDTO.getSets())
                .reps(workoutDTO.getReps())
                .weight(workoutDTO.getWeight())
                .effectiveVolume(effectiveVolume)
                .date(workoutDTO.getDate())
                .user(user)
                .build();
                
        Workout saved = workoutRepository.save(workout);
        return mapToDTO(saved);
    }

    public List<WorkoutDTO> getUserWorkouts() {
        User user = getCurrentUser();
        return workoutRepository.findByUserIdOrderByDateDesc(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void deleteWorkout(Long id) {
        User user = getCurrentUser();
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found"));
                
        if (!workout.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this workout");
        }
        
        workoutRepository.delete(workout);
    }

    private WorkoutDTO mapToDTO(Workout workout) {
        return WorkoutDTO.builder()
                .id(workout.getId())
                .exerciseName(workout.getExerciseName())
                .sets(workout.getSets())
                .reps(workout.getReps())
                .weight(workout.getWeight())
                .effectiveVolume(workout.getEffectiveVolume())
                .date(workout.getDate())
                .build();
    }
}
