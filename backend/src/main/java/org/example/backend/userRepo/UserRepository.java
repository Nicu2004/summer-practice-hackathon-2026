package org.example.backend.userRepo;

import org.example.backend.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    public User findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            User u = new User();
            u.setId(rs.getInt("id"));
            u.setName(rs.getString("name"));
            u.setForname(rs.getString("forname"));
            u.setEmail(rs.getString("email"));
            u.setPassword(rs.getString("password"));
            u.setBirthDate(rs.getString("birth_date"));
            return u;
        }, email);
    }
    public User findByEmailAndPassword(String email, String password) {
        String sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            User user = new User();
            user.setId(rs.getInt("id"));
            user.setName(rs.getString("name"));
            user.setForname(rs.getString("forname"));
            user.setEmail(rs.getString("email"));
            user.setPassword(rs.getString("password"));
            user.setBirthDate(rs.getString("birth_date"));
            return user;
        }, email, password);
    }
    public void save(User user) {
        String sql = "INSERT INTO users (name, forname, email, password, birth_date) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                user.getName(),
                user.getForname(),
                user.getEmail(),
                user.getPassword(),
                user.getBirthDate()
        );
    }
}
