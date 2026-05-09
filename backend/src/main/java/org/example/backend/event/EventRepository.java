package org.example.backend.event;

import org.example.backend.event.Event;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class EventRepository {

    private final JdbcTemplate jdbcTemplate;

    public EventRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(Event event) {
        String sql = """
            INSERT INTO events (group_id, created_by, title, sport, location, event_date, event_time, description, max_players)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        jdbcTemplate.update(sql,
                event.getGroupId(),
                event.getCreatedBy(),
                event.getTitle(),
                event.getSport(),
                event.getLocation(),
                event.getEventDate(),
                event.getEventTime(),
                event.getDescription(),
                event.getMaxPlayers()
        );

        // add creator as first participant
        Integer newId = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
        jdbcTemplate.update(
                "INSERT INTO event_participants (event_id, user_id, status) VALUES (?, ?, 'going')",
                newId, event.getCreatedBy()
        );
    }

    public List<Event> findByGroupId(int groupId) {
        String sql = """
            SELECT e.*,
                   (SELECT COUNT(*) FROM event_participants ep WHERE ep.event_id = e.id) as current_players
            FROM events e
            WHERE e.group_id = ?
            ORDER BY e.event_date ASC, e.event_time ASC
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Event e = new Event();
            e.setId(rs.getInt("id"));
            e.setGroupId(rs.getInt("group_id"));
            e.setCreatedBy(rs.getInt("created_by"));
            e.setTitle(rs.getString("title"));
            e.setSport(rs.getString("sport"));
            e.setLocation(rs.getString("location"));
            e.setEventDate(rs.getString("event_date"));
            e.setEventTime(rs.getString("event_time"));
            e.setDescription(rs.getString("description"));
            e.setMaxPlayers(rs.getInt("max_players"));
            e.setCurrentPlayers(rs.getInt("current_players"));
            return e;
        }, groupId);
    }

    public void joinEvent(int eventId, int userId) {
        jdbcTemplate.update(
                "INSERT INTO event_participants (event_id, user_id, status) VALUES (?, ?, 'going')",
                eventId, userId
        );
    }
}