package org.example.backend.message;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    private Integer id;
    private Integer groupId;
    private Integer userId;
    private String userName;
    private String content;
    private String sentAt;
}