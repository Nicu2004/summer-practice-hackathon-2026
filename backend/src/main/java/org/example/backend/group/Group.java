package org.example.backend.group;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Group {

    private Integer id;
    private Integer createdBy;
    private String name;
    private String description;
    private String lastMessage;
    private String city;
    private String level;
    private List<String> sports;
}