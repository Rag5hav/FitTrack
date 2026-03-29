package com.fitness.tracker.controller;

import com.fitness.tracker.dto.FoodLogDTO;
import com.fitness.tracker.service.FoodLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/food")
@RequiredArgsConstructor
public class FoodLogController {

    private final FoodLogService foodLogService;

    @PostMapping
    public ResponseEntity<FoodLogDTO> addFoodLog(@Valid @RequestBody FoodLogDTO foodLogDTO) {
        return ResponseEntity.ok(foodLogService.addFoodLog(foodLogDTO));
    }

    @GetMapping
    public ResponseEntity<List<FoodLogDTO>> getDailyFoodLogs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(foodLogService.getDailyFoodLogs(date));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FoodLogDTO>> getAllFoodLogs() {
        return ResponseEntity.ok(foodLogService.getAllFoodLogs());
    }

    @GetMapping("/calories")
    public ResponseEntity<Integer> getDailyTotalCalories(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(foodLogService.getDailyTotalCalories(date));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFoodLog(@PathVariable Long id) {
        foodLogService.deleteFoodLog(id);
        return ResponseEntity.noContent().build();
    }
}
