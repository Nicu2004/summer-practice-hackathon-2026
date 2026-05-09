package org.example.backend.event;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Event {
    private Integer id;
    private Integer groupId;
    private Integer createdBy;
    private String title;
    private String sport;
    private String location;
    private String eventDate;
    private String eventTime;
    private String description;
    private Integer maxPlayers;
    private Integer currentPlayers;
}