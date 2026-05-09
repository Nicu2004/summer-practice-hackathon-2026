package org.example.backend.group;

import org.example.backend.group.Group;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class GroupRepository {

    private final JdbcTemplate jdbcTemplate;

    public GroupRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // get all groups a user is member of
    public List<Group> findByUserId(int userId) {
        String sql = """
            SELECT g.id, g.name, g.description, g.created_by
            FROM groups_table g
            JOIN group_members gm ON g.id = gm.group_id
            WHERE gm.user_id = ?
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Group group = new Group();
            group.setId(rs.getInt("id"));
            group.setName(rs.getString("name"));
            group.setDescription(rs.getString("description"));
            group.setCreatedBy(rs.getInt("created_by"));
            return group;
        }, userId);
    }
    public List<Group> findAvailableForUser(int userId) {
        String sql = """
        SELECT * FROM groups_table
        WHERE id NOT IN (
            SELECT group_id FROM group_members WHERE user_id = ?
        )
    """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Group g = new Group();
            g.setId(rs.getInt("id"));
            g.setName(rs.getString("name"));
            g.setDescription(rs.getString("description"));
            g.setCity(rs.getString("city"));
            g.setLevel(rs.getString("level"));
            g.setSports(rs.getString("sports") != null
                    ? List.of(rs.getString("sports").split(","))
                    : List.of());
            g.setCreatedBy(rs.getInt("created_by"));
            return g;
        }, userId);
    }

    public void addMember(int groupId, int userId) {
        jdbcTemplate.update(
                "INSERT INTO group_members (group_id, user_id) VALUES (?, ?)",
                groupId, userId
        );
    }
    public List<GroupMember> findMembersByGroupId(int groupId) {
        String sql = """
        SELECT u.id as user_id, u.name, u.forname, gm.is_captain
        FROM group_members gm
        JOIN users u ON gm.user_id = u.id
        WHERE gm.group_id = ?
    """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            GroupMember member = new GroupMember();
            member.setUserId(rs.getInt("user_id"));
            member.setName(rs.getString("name"));
            member.setForname(rs.getString("forname"));
            member.setCaptain(rs.getBoolean("is_captain"));
            return member;
        }, groupId);
    }
    // save a new group
    public void save(Group group) {
        String sql = "INSERT INTO groups_table (name, description, city, level, sports, created_by) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                group.getName(),
                group.getDescription(),
                group.getCity(),
                group.getLevel(),
                String.join(",", group.getSports()),
                group.getCreatedBy()
        );

        Integer newId = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);

        // add creator as captain automatically
        jdbcTemplate.update(
                "INSERT INTO group_members (group_id, user_id, is_captain) VALUES (?, ?, ?)",
                newId, group.getCreatedBy(), true
        );
    }

    // get group by id
    public Group findById(int id) {
        String sql = "SELECT * FROM groups_table WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            Group group = new Group();
            group.setId(rs.getInt("id"));
            group.setName(rs.getString("name"));
            group.setDescription(rs.getString("description"));
            group.setCreatedBy(rs.getInt("created_by"));
            return group;
        }, id);
    }
}