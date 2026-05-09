package org.example.backend.group;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupMember {
    private Integer userId;
    private String name;
    private String forname;
    @JsonProperty("isCaptain")
    private boolean isCaptain;
}