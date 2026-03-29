package com.fitness.tracker.service;

import com.fitness.tracker.dto.GoalDTO;
import com.fitness.tracker.model.Goal;
import com.fitness.tracker.model.User;
import com.fitness.tracker.repository.GoalRepository;
import com.fitness.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;
    private final AiSuggestionService aiSuggestionService;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public GoalDTO setOrUpdateGoal(GoalDTO goalDTO) {
        User user = getCurrentUser();
        
        Optional<Goal> existingGoal = goalRepository.findByUserId(user.getId());
        Goal goal;
        if (existingGoal.isPresent()) {
            goal = existingGoal.get();
            goal.setTargetWeight(goalDTO.getTargetWeight());
            goal.setTargetDate(goalDTO.getTargetDate());
            goal.setHeight(goalDTO.getHeight());
            goal.setCurrentWeight(goalDTO.getCurrentWeight());
        } else {
            goal = Goal.builder()
                    .targetWeight(goalDTO.getTargetWeight())
                    .targetDate(goalDTO.getTargetDate())
                    .height(goalDTO.getHeight())
                    .currentWeight(goalDTO.getCurrentWeight())
                    .user(user)
                    .build();
        }
        
        Integer aiCalories = aiSuggestionService.calculateDailyCalorieGoal(goal);
        goal.setDailyCalorieGoal(aiCalories);
                
        Goal saved = goalRepository.save(goal);
        return mapToDTO(saved);
    }

    public GoalDTO getUserGoal() {
        User user = getCurrentUser();
        return goalRepository.findByUserId(user.getId())
                .map(this::mapToDTO)
                .orElse(null);
    }

    private GoalDTO mapToDTO(Goal goal) {
        return GoalDTO.builder()
                .id(goal.getId())
                .targetWeight(goal.getTargetWeight())
                .dailyCalorieGoal(goal.getDailyCalorieGoal())
                .targetDate(goal.getTargetDate())
                .height(goal.getHeight())
                .currentWeight(goal.getCurrentWeight())
                .build();
    }
}
