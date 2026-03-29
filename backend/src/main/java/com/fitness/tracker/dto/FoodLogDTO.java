package com.fitness.tracker.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FoodLogDTO {
    private Long id;
    
    @NotBlank(message = "Meal type is required")
    private String mealType;
    
    @NotBlank(message = "Food name is required")
    private String foodName;
    
    @NotNull(message = "Calories are required")
    @Min(value = 1, message = "Calories must be positive")
    private Integer calories;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
}
