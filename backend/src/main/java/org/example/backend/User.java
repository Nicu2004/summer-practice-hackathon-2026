package org.example.backend;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private int id;
    private String name;
    private String forname;
    private String email;
    private String password;
    private String birthDate;

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }
}