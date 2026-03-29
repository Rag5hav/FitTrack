package com.fitness.tracker.controller;

import com.fitness.tracker.dto.GoalDTO;
import com.fitness.tracker.service.GoalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalDTO> setOrUpdateGoal(@Valid @RequestBody GoalDTO goalDTO) {
        return ResponseEntity.ok(goalService.setOrUpdateGoal(goalDTO));
    }

    @GetMapping
    public ResponseEntity<GoalDTO> getUserGoal() {
        GoalDTO goal = goalService.getUserGoal();
        if (goal == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(goal);
    }
}
