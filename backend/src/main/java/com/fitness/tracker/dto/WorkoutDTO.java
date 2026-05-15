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
public class WorkoutDTO {
    private Long id;
    
    @NotBlank(message = "Exercise name is required")
    private String exerciseName;
    
    @Min(value = 1, message = "Sets must be at least 1")
    private Integer sets;
    
    @Min(value = 1, message = "Reps must be at least 1")
    private Integer reps;
    
    @Min(value = 0, message = "Weight cannot be negative")
    private Double weight;
    
    private Double effectiveVolume;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
}
