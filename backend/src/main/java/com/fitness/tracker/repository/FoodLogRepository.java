package com.fitness.tracker.repository;

import com.fitness.tracker.model.FoodLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodLogRepository extends JpaRepository<FoodLog, Long> {
    List<FoodLog> findByUserIdAndDateOrderByMealTypeAsc(Long userId, LocalDate date);
    
    List<FoodLog> findByUserIdOrderByDateAsc(Long userId);
    
    @Query("SELECT SUM(f.calories) FROM FoodLog f WHERE f.user.id = :userId AND f.date = :date")
    Integer getTotalCaloriesByUserIdAndDate(Long userId, LocalDate date);
}
