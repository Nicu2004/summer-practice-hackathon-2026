package org.example.backend.availability;

import org.example.backend.availability.Availability;
import org.example.backend.availability.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class AvailabilityController {

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @PostMapping("/availability")
    public ResponseEntity<?> respond(@RequestBody Availability availability) {
        availability.setDate(LocalDate.now().toString());
        availabilityRepository.save(availability);
        return ResponseEntity.ok("Response saved");
    }

    @GetMapping("/availability/{userId}")
    public ResponseEntity<?> getToday(@PathVariable int userId) {
        String today = LocalDate.now().toString();
        Availability availability = availabilityRepository.findByUserAndDate(userId, today);
        return ResponseEntity.ok(availability);
    }
}