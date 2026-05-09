package org.example.backend.availability;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Availability {
    private Integer id;
    private Integer userId;
    private String date;
    private String response;
    private String sport;
}