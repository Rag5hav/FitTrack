package com.fitness.tracker.controller;

import com.fitness.tracker.service.AiSuggestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class AiController {

    private final AiSuggestionService aiSuggestionService;

    @GetMapping("/ai-feedback")
    public ResponseEntity<Map<String, String>> getAiFeedback() {
        String feedback = aiSuggestionService.generateFitnessSuggestions();
        Map<String, String> response = new HashMap<>();
        response.put("feedback", feedback);
        return ResponseEntity.ok(response);
    }

    @org.springframework.web.bind.annotation.PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chatWithAi(@org.springframework.web.bind.annotation.RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        String reply = aiSuggestionService.chatWithAi(message);
        Map<String, String> response = new HashMap<>();
        response.put("reply", reply);
        return ResponseEntity.ok(response);
    }

    @org.springframework.web.bind.annotation.PostMapping("/estimate-calories")
    public ResponseEntity<Map<String, Integer>> estimateCalories(@org.springframework.web.bind.annotation.RequestBody Map<String, String> payload) {
        String food = payload.get("food");
        if (food == null || food.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Integer calories = aiSuggestionService.estimateCaloriesForFood(food);
        if (calories == null) {
            return ResponseEntity.internalServerError().build();
        }
        Map<String, Integer> response = new HashMap<>();
        response.put("calories", calories);
        return ResponseEntity.ok(response);
    }
}
