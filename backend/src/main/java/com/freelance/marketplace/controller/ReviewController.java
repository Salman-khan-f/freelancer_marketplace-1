package com.freelance.marketplace.controller;

import com.freelance.marketplace.entity.Review;
import com.freelance.marketplace.entity.Task;
import com.freelance.marketplace.entity.TaskStatus;
import com.freelance.marketplace.entity.User;
import com.freelance.marketplace.repository.ReviewRepository;
import com.freelance.marketplace.repository.UserRepository;
import com.freelance.marketplace.service.TaskService;
import com.freelance.marketplace.service.UserDetailsImpl;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final TaskService taskService;
    private final UserRepository userRepository;

    public ReviewController(ReviewRepository reviewRepository, TaskService taskService, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<Review> postReview(@RequestBody Review review, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User reviewer = userRepository.findById(userDetails.getId()).orElseThrow();
        Task task = taskService.getTaskById(review.getTask().getId());

        if (!task.getCompany().getId().equals(reviewer.getId())) {
            throw new IllegalArgumentException("Only the company that created the task can review it");
        }

        if (task.getStatus() != TaskStatus.SUBMITTED && task.getStatus() != TaskStatus.COMPLETED) {
            throw new IllegalArgumentException("Task must be SUBMITTED or COMPLETED to review");
        }

        review.setReviewer(reviewer);
        review.setReviewee(task.getFreelancer());
        review.setTask(task);

        Review savedReview = reviewRepository.save(review);
        
        // Auto-complete task upon review
        if (task.getStatus() == TaskStatus.SUBMITTED) {
            taskService.updateTaskStatus(task.getId(), TaskStatus.COMPLETED);
        }

        return ResponseEntity.ok(savedReview);
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<Review>> getReviewsForFreelancer(@PathVariable UUID freelancerId) {
        return ResponseEntity.ok(reviewRepository.findByRevieweeId(freelancerId));
    }
}
