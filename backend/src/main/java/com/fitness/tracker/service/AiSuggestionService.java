package com.fitness.tracker.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.tracker.model.Goal;
import com.fitness.tracker.model.User;
import com.fitness.tracker.repository.GoalRepository;
import com.fitness.tracker.repository.UserRepository;
import com.fitness.tracker.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiSuggestionService {

    @Value("${ai.groq.api.key}")
    private String groqApiKey;

    private final GoalRepository goalRepository;
    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String generateFitnessSuggestions() {
        if (groqApiKey == null || groqApiKey.trim().isEmpty() || groqApiKey.contains("YOUR_GROQ_API_KEY_HERE")) {
            return "AI Features are currently disabled because the Groq API key is not configured. Please add your key to application.properties.";
        }

        User user = getCurrentUser();
        Goal goal = goalRepository.findByUserId(user.getId()).orElse(null);
        
        if (goal == null || goal.getHeight() == null || goal.getCurrentWeight() == null) {
            return "Please update your Goal settings with your Height and Current Weight in the Progress page so the AI can provide accurate suggestions.";
        }

        List<String> recentWorkouts = workoutRepository.findByUserIdOrderByDateDesc(user.getId())
                .stream()
                .limit(10)
                .map(w -> w.getDate() + ": " + w.getExerciseName() + " (" + w.getSets() + " sets x " + w.getReps() + " reps, " + w.getWeight() + "kg)")
                .collect(Collectors.toList());

        String prompt = buildPrompt(goal, recentWorkouts);

        return callGroqApi(prompt);
    }

    private String buildPrompt(Goal goal, List<String> recentWorkouts) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert personal trainer and nutritionist AI.\n");
        sb.append("A user has provided the following physical profile:\n");
        sb.append("- Height: ").append(goal.getHeight()).append(" cm\n");
        sb.append("- Current Weight: ").append(goal.getCurrentWeight()).append(" kg\n");
        
        if (goal.getTargetWeight() != null) {
            sb.append("- Target Weight Goal: ").append(goal.getTargetWeight()).append(" kg\n");
        }
        
        if (!recentWorkouts.isEmpty()) {
            sb.append("\nHere are their most recent workouts:\n");
            recentWorkouts.forEach(w -> sb.append("- ").append(w).append("\n"));
        } else {
            sb.append("\nThe user hasn't logged any workouts recently.\n");
        }

        sb.append("\nPlease analyze their profile and provide a concise, encouraging fitness assessment. Include:\n");
        sb.append("1. A recommended daily calorie intake based on their goals.\n");
        sb.append("2. Feedback on how they are doing (good/bad/neutral based on their logs).\n");
        sb.append("3. 2-3 actionable suggestions to help them improve and reach their target weight efficiently.\n");
        sb.append("\nFormat your response in plain text with clear bullet points, keeping it under 250 words.");

        return sb.toString();
    }

    public Integer calculateDailyCalorieGoal(Goal goal) {
        if (groqApiKey == null || groqApiKey.trim().isEmpty() || groqApiKey.contains("YOUR_GROQ_API_KEY_HERE")) {
            return 2000; // Default fallback if no api key 
        }

        StringBuilder sb = new StringBuilder();
        sb.append("A user wants to know their daily calorie goal limit. Their profile is:\n");
        sb.append("- Height: ").append(goal.getHeight()).append(" cm\n");
        sb.append("- Current Weight: ").append(goal.getCurrentWeight()).append(" kg\n");
        sb.append("- Target Weight Goal: ").append(goal.getTargetWeight()).append(" kg\n");
        sb.append("- Target Date to achieve this by: ").append(goal.getTargetDate()).append("\n");
        sb.append("\nPlease calculate a realistic and healthy daily calorie intake limit (in kcal) for this user to achieve their goal by the target date. Reply ONLY with an integer representing the exact daily calories (e.g. 2100). Do not provide any explanation or text.");

        try {
            String responseText = callGroqApi(sb.toString());
            // The response should be just the number. Parse it.
            return Integer.parseInt(responseText.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            e.printStackTrace();
            return 2000;
        }
    }

    public String chatWithAi(String userMessage) {
        if (groqApiKey == null || groqApiKey.trim().isEmpty() || groqApiKey.contains("YOUR_GROQ_API_KEY_HERE")) {
            return "AI Features are currently disabled because the Groq API key is not configured.";
        }

        User user = getCurrentUser();
        Goal goal = goalRepository.findByUserId(user.getId()).orElse(null);

        StringBuilder sb = new StringBuilder();
        sb.append("System Instructions:\n");
        sb.append("You are a specialized AI Fitness Coach working inside a web application.\n");
        sb.append("Your job is to answer queries about workouts, meals, and fitness problems.\n");
        sb.append("If the user asks for a workout plan, you MUST suggest a workout according to their available time and personal goals.\n");
        sb.append("CRITICAL: Any workout plan MUST be formatted strictly as a Markdown TABLE with the following columns: Exercise Name, Sets, Reps, Time Per Set, Rest Time.\n\n");

        if (goal != null) {
            sb.append("User Context:\n");
            if (goal.getHeight() != null) sb.append("- Height: ").append(goal.getHeight()).append(" cm\n");
            if (goal.getCurrentWeight() != null) sb.append("- Current Weight: ").append(goal.getCurrentWeight()).append(" kg\n");
            if (goal.getTargetWeight() != null) sb.append("- Target Weight: ").append(goal.getTargetWeight()).append(" kg\n");
            if (goal.getDailyCalorieGoal() != null) sb.append("- Goal Calorie Limit: ").append(goal.getDailyCalorieGoal()).append(" kcal\n");
        }

        sb.append("\nUser query: ").append(userMessage);

        return callGroqApi(sb.toString());
    }

    public Integer estimateCaloriesForFood(String foodDescription) {
        if (groqApiKey == null || groqApiKey.trim().isEmpty() || groqApiKey.contains("YOUR_GROQ_API_KEY_HERE")) {
            return null;
        }

        StringBuilder sb = new StringBuilder();
        sb.append("You are a nutrition API. ");
        sb.append("The user has eaten the following: \"").append(foodDescription).append("\".\n");
        sb.append("Estimate the total calories for this food/meal. Reply ONLY with an integer representing the exact calories (e.g. 350). Do not provide any explanation.");

        try {
            String responseText = callGroqApi(sb.toString());
            return Integer.parseInt(responseText.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String callGroqApi(String prompt) {
        String url = "https://api.groq.com/openai/v1/chat/completions";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama-3.3-70b-versatile");
            requestBody.put("messages", new Object[]{
                Map.of("role", "user", "content", prompt)
            });

            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
            String response = restTemplate.postForObject(url, entity, String.class);

            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode textNode = rootNode.path("choices").get(0).path("message").path("content");
            
            return textNode.asText();
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to generate AI suggestion. Please check your API key and connection: " + e.getMessage();
        }
    }

    public Double calculateEffectiveVolume(String exerciseName, int sets, int reps, double weight) {
        if (groqApiKey == null || groqApiKey.trim().isEmpty() || groqApiKey.contains("YOUR_GROQ_API_KEY_HERE")) {
            return null;
        }

        StringBuilder sb = new StringBuilder();
        sb.append("You are a fitness calculation API. ");
        sb.append("Calculate the Effective Volume for the workout: ").append(exerciseName)
          .append(" with ").append(sets).append(" sets, ").append(reps).append(" reps, and ")
          .append(weight).append(" weight.\n");
        sb.append("The formula is: Effective Volume = (Sets * Reps * Weight) * E * R * T, where E is Exercise coefficient, R is Range-of-motion factor, and T is Intensity factor (RIR/RPE).\n");
        sb.append("Estimate E, R, and T appropriately for this exercise and calculate the final Effective Volume.\n");
        sb.append("Reply ONLY with a single numeric value (can be decimal) representing the final effective volume. Do not provide any explanation.");

        try {
            String responseText = callGroqApi(sb.toString());
            // Extract the first number found (handling potential decimal point)
            String numberStr = responseText.replaceAll("[^0-9.]", "");
            if (numberStr.isEmpty()) return null;
            return Double.parseDouble(numberStr);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
