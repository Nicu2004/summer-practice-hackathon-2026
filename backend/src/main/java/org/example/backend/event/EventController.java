package org.example.backend.event;

import org.example.backend.event.Event;
import org.example.backend.event.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping("/events/group/{groupId}")
    public ResponseEntity<?> getEventsByGroup(@PathVariable int groupId) {
        List<Event> events = eventRepository.findByGroupId(groupId);
        return ResponseEntity.ok(events);
    }

    @PostMapping("/events")
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        try {
            eventRepository.save(event);
            return ResponseEntity.ok("Event created");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping("/events/join")
    public ResponseEntity<?> joinEvent(@RequestBody Map<String, Integer> body) {
        eventRepository.joinEvent(body.get("eventId"), body.get("userId"));
        return ResponseEntity.ok("Joined event");
    }
}