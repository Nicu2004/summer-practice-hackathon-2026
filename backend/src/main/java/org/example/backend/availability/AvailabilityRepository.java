package org.example.backend.availability;

import org.example.backend.availability.Availability;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class AvailabilityRepository {

    private final JdbcTemplate jdbcTemplate;

    public AvailabilityRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(Availability availability) {
        String sql = """
            INSERT INTO availability (user_id, date, response, sport)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE response = ?
        """;
        jdbcTemplate.update(sql,
                availability.getUserId(),
                availability.getDate(),
                availability.getResponse(),
                availability.getSport(),
                availability.getResponse()
        );
    }

    public Availability findByUserAndDate(int userId, String date) {
        String sql = "SELECT * FROM availability WHERE user_id = ? AND date = ?";
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Availability a = new Availability();
                a.setId(rs.getInt("id"));
                a.setUserId(rs.getInt("user_id"));
                a.setDate(rs.getString("date"));
                a.setResponse(rs.getString("response"));
                a.setSport(rs.getString("sport"));
                return a;
            }, userId, date);
        } catch (Exception e) {
            return null;
        }
    }

    public List<Availability> findAvailableUsers(String date, String sport) {
        String sql = """
            SELECT a.*, u.name, u.forname
            FROM availability a
            JOIN users u ON a.user_id = u.id
            WHERE a.date = ? AND a.sport = ? AND a.response = 'yes'
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Availability a = new Availability();
            a.setId(rs.getInt("id"));
            a.setUserId(rs.getInt("user_id"));
            a.setDate(rs.getString("date"));
            a.setResponse(rs.getString("response"));
            a.setSport(rs.getString("sport"));
            return a;
        }, date, sport);
    }
}