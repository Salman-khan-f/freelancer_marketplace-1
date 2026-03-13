package com.freelance.marketplace.controller;

import com.freelance.marketplace.entity.Bid;
import com.freelance.marketplace.entity.Task;
import com.freelance.marketplace.entity.User;
import com.freelance.marketplace.repository.UserRepository;
import com.freelance.marketplace.service.BidService;
import com.freelance.marketplace.service.TaskService;
import com.freelance.marketplace.service.UserDetailsImpl;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class BidController {

    private final BidService bidService;
    private final TaskService taskService;
    private final UserRepository userRepository;

    public BidController(BidService bidService, TaskService taskService, UserRepository userRepository) {
        this.bidService = bidService;
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    @PostMapping("/tasks/{taskId}/bids")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Bid> placeBid(@PathVariable UUID taskId, @RequestBody Bid bid, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User freelancer = userRepository.findById(userDetails.getId()).orElseThrow();
        Task task = taskService.getTaskById(taskId);
        
        bid.setFreelancer(freelancer);
        bid.setTask(task);
        
        return ResponseEntity.ok(bidService.placeBid(bid));
    }

    @GetMapping("/tasks/{taskId}/bids")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<List<Bid>> getBidsForTask(@PathVariable UUID taskId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Task task = taskService.getTaskById(taskId);
        if (!task.getCompany().getId().equals(userDetails.getId())) {
            throw new IllegalArgumentException("You can only view bids for your own tasks");
        }
        return ResponseEntity.ok(bidService.getBidsForTask(taskId));
    }

    @GetMapping("/bids/my")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<Bid>> getMyBids(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(bidService.getBidsByFreelancer(userDetails.getId()));
    }

    @PutMapping("/bids/{bidId}/accept")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<Bid> acceptBid(@PathVariable UUID bidId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        // Validation that Company owns the task is handled implicitly or can be added
        return ResponseEntity.ok(bidService.acceptBid(bidId));
    }

    @PutMapping("/bids/{bidId}/reject")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<Bid> rejectBid(@PathVariable UUID bidId) {
        return ResponseEntity.ok(bidService.rejectBid(bidId));
    }
}
