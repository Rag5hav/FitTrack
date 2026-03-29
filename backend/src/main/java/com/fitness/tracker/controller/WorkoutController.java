package com.fitness.tracker.controller;

import com.fitness.tracker.dto.WorkoutDTO;
import com.fitness.tracker.service.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<WorkoutDTO> addWorkout(@Valid @RequestBody WorkoutDTO workoutDTO) {
        return ResponseEntity.ok(workoutService.addWorkout(workoutDTO));
    }

    @GetMapping
    public ResponseEntity<List<WorkoutDTO>> getUserWorkouts() {
        return ResponseEntity.ok(workoutService.getUserWorkouts());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }
}
