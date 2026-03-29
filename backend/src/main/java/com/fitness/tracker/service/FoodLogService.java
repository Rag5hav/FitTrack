package com.fitness.tracker.service;

import com.fitness.tracker.dto.FoodLogDTO;
import com.fitness.tracker.model.FoodLog;
import com.fitness.tracker.model.User;
import com.fitness.tracker.repository.FoodLogRepository;
import com.fitness.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodLogService {

    private final FoodLogRepository foodLogRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public FoodLogDTO addFoodLog(FoodLogDTO foodLogDTO) {
        User user = getCurrentUser();
        
        FoodLog foodLog = FoodLog.builder()
                .mealType(foodLogDTO.getMealType())
                .foodName(foodLogDTO.getFoodName())
                .calories(foodLogDTO.getCalories())
                .date(foodLogDTO.getDate())
                .user(user)
                .build();
                
        FoodLog saved = foodLogRepository.save(foodLog);
        return mapToDTO(saved);
    }

    public List<FoodLogDTO> getDailyFoodLogs(LocalDate date) {
        User user = getCurrentUser();
        return foodLogRepository.findByUserIdAndDateOrderByMealTypeAsc(user.getId(), date)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<FoodLogDTO> getAllFoodLogs() {
        User user = getCurrentUser();
        return foodLogRepository.findByUserIdOrderByDateAsc(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Integer getDailyTotalCalories(LocalDate date) {
        User user = getCurrentUser();
        Integer calories = foodLogRepository.getTotalCaloriesByUserIdAndDate(user.getId(), date);
        return calories != null ? calories : 0;
    }

    public void deleteFoodLog(Long id) {
        User user = getCurrentUser();
        FoodLog foodLog = foodLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food log not found"));
                
        if (!foodLog.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this food log");
        }
        
        foodLogRepository.delete(foodLog);
    }

    private FoodLogDTO mapToDTO(FoodLog foodLog) {
        return FoodLogDTO.builder()
                .id(foodLog.getId())
                .mealType(foodLog.getMealType())
                .foodName(foodLog.getFoodName())
                .calories(foodLog.getCalories())
                .date(foodLog.getDate())
                .build();
    }
}
