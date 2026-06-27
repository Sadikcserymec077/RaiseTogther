package com.crowdcash.controller;

import com.crowdcash.dto.ApiResponse;
import com.crowdcash.dto.CommentResponse;
import com.crowdcash.dto.CreateCommentRequest;
import com.crowdcash.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private com.crowdcash.repository.UserRepository userRepository;

    private Long getUserId(Principal principal) {
        if (principal == null) return null;
        return userRepository.findByEmail(principal.getName()).map(u -> u.getId()).orElse(null);
    }

    @PostMapping("/campaign/{campaignId}")
    public ResponseEntity<ApiResponse<CommentResponse>> postComment(
            @PathVariable Long campaignId,
            @RequestBody CreateCommentRequest request,
            Principal principal) {
        Long userId = getUserId(principal);
        CommentResponse response = commentService.postComment(campaignId, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Comment posted successfully", response));
    }

    @PostMapping("/{commentId}/reply")
    public ResponseEntity<ApiResponse<CommentResponse>> replyToComment(
            @PathVariable Long commentId,
            @RequestBody CreateCommentRequest request,
            Principal principal) {
        Long userId = getUserId(principal);
        CommentResponse response = commentService.replyToComment(commentId, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Reply posted successfully", response));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<ApiResponse<Page<CommentResponse>>> getComments(
            @PathVariable Long campaignId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CommentResponse> result = commentService.getComments(campaignId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success("Comments fetched successfully", result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CommentResponse>> editComment(
            @PathVariable Long id,
            @RequestBody CreateCommentRequest request,
            Principal principal) {
        Long userId = getUserId(principal);
        CommentResponse response = commentService.editComment(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Comment updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable Long id, Principal principal) {
        Long userId = getUserId(principal);
        boolean isAdmin = false;
        if (principal instanceof Authentication auth) {
            isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }
        commentService.deleteComment(id, userId, isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }
}
