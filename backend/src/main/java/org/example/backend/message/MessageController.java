package org.example.backend.message;

import org.example.backend.message.Message;
import org.example.backend.message.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/messages/{groupId}")
    public ResponseEntity<?> getMessages(@PathVariable int groupId) {
        List<Message> messages = messageRepository.findByGroupId(groupId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/messages")
    public ResponseEntity<?> sendMessage(@RequestBody Message message) {
        messageRepository.save(message);
        return ResponseEntity.ok("Message sent");
    }
}