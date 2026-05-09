package org.example.backend.controller;

import org.example.backend.group.Group;
import org.example.backend.group.GroupMember;
import org.example.backend.group.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class GroupController {

    @Autowired
    private GroupRepository groupRepository;

    @GetMapping("/groups/user/{userId}")
    public ResponseEntity<?> getGroupsByUser(@PathVariable int userId) {
        List<Group> groups = groupRepository.findByUserId(userId);
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/groups/available/{userId}")
    public ResponseEntity<?> getAvailableGroups(@PathVariable int userId) {
        List<Group> groups = groupRepository.findAvailableForUser(userId);
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/groups/{groupId}")
    public ResponseEntity<?> getGroup(@PathVariable int groupId) {
        Group group = groupRepository.findById(groupId);
        return ResponseEntity.ok(group);
    }

    @GetMapping("/groups/{groupId}/members")
    public ResponseEntity<?> getMembers(@PathVariable int groupId) {
        List<GroupMember> members = groupRepository.findMembersByGroupId(groupId);
        return ResponseEntity.ok(members);
    }

    @PostMapping("/groups")
    public ResponseEntity<?> createGroup(@RequestBody Group group) {
        try {
            groupRepository.save(group);
            return ResponseEntity.ok("Group created");
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping("/groups/join")
    public ResponseEntity<?> joinGroup(@RequestBody Map<String, Integer> body) {
        int userId = body.get("userId");
        int groupId = body.get("groupId");
        groupRepository.addMember(groupId, userId);
        return ResponseEntity.ok("Joined successfully");
    }
}