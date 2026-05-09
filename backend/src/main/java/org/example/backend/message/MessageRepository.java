package org.example.backend.message;

import org.example.backend.message.Message;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class MessageRepository {

    private final JdbcTemplate jdbcTemplate;

    public MessageRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Message> findByGroupId(int groupId) {
        String sql = """
            SELECT m.id, m.group_id, m.user_id, m.content, m.sent_at,
                   CONCAT(u.name, ' ', u.forname) as user_name
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.group_id = ?
            ORDER BY m.sent_at ASC
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Message msg = new Message();
            msg.setId(rs.getInt("id"));
            msg.setGroupId(rs.getInt("group_id"));
            msg.setUserId(rs.getInt("user_id"));
            msg.setUserName(rs.getString("user_name"));
            msg.setContent(rs.getString("content"));
            msg.setSentAt(rs.getString("sent_at"));
            return msg;
        }, groupId);
    }

    public void save(Message message) {
        String sql = "INSERT INTO messages (group_id, user_id, content) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql,
                message.getGroupId(),
                message.getUserId(),
                message.getContent()
        );
    }
}