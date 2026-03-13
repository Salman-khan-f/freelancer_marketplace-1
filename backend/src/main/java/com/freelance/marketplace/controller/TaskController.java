package com.freelance.marketplace.controller;

import com.freelance.marketplace.entity.Task;
import com.freelance.marketplace.service.TaskService;
import com.freelance.marketplace.service.UserDetailsImpl;
import com.freelance.marketplace.entity.User;
import com.freelance.marketplace.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    public TaskController(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<Task> createTask(@RequestBody Task task, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User company = userRepository.findById(userDetails.getId()).orElseThrow();
        task.setCompany(company);
        return ResponseEntity.ok(taskService.createTask(task));
    }

    @GetMapping
    public ResponseEntity<Page<Task>> getOpenTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(taskService.getOpenTasks(PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping("/company")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<List<Task>> getTasksByCompany(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskService.getTasksByCompany(userDetails.getId()));
    }

    @GetMapping("/freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<List<Task>> getTasksByFreelancer(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(taskService.getTasksByFreelancer(userDetails.getId()));
    }

    @PutMapping("/{id}/submit")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<Task> submitTaskWork(@PathVariable UUID id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Task task = taskService.getTaskById(id);
        if (!task.getFreelancer().getId().equals(userDetails.getId())) {
            throw new IllegalArgumentException("You are not assigned to this task");
        }
        return ResponseEntity.ok(taskService.updateTaskStatus(id, com.freelance.marketplace.entity.TaskStatus.SUBMITTED));
    }
}
