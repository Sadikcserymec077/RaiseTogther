package com.crowdcash.controller;

import com.crowdcash.dto.*;
import com.crowdcash.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private com.crowdcash.repository.UserRepository userRepository;

    private Long getUserId(Principal principal) {
        if (principal == null) return null;
        return userRepository.findByEmail(principal.getName()).map(u -> u.getId()).orElse(null);
    }

    @PostMapping("/campaign/{campaignId}")
    public ResponseEntity<ApiResponse<QuestionResponse>> askQuestion(
            @PathVariable Long campaignId,
            @RequestBody CreateQuestionRequest request,
            Principal principal) {
        Long userId = getUserId(principal);
        QuestionResponse response = questionService.askQuestion(campaignId, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Question posted successfully", response));
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<ApiResponse<Page<QuestionResponse>>> getQuestions(
            @PathVariable Long campaignId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<QuestionResponse> result = questionService.getQuestions(campaignId, PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success("Questions fetched successfully", result));
    }

    @PostMapping("/{questionId}/answer")
    public ResponseEntity<ApiResponse<QuestionResponse>> answerQuestion(
            @PathVariable Long questionId,
            @RequestBody CreateAnswerRequest request,
            Principal principal) {
        Long userId = getUserId(principal);
        QuestionResponse response = questionService.answerQuestion(questionId, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Question answered successfully", response));
    }

    @PutMapping("/answer/{answerId}")
    public ResponseEntity<ApiResponse<AnswerResponse>> editAnswer(
            @PathVariable Long answerId,
            @RequestBody CreateAnswerRequest request,
            Principal principal) {
        Long userId = getUserId(principal);
        AnswerResponse response = questionService.editAnswer(answerId, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Answer updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(@PathVariable Long id, Principal principal) {
        Long userId = getUserId(principal);
        boolean isAdmin = false;
        if (principal instanceof Authentication auth) {
            isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }
        questionService.deleteQuestion(id, userId, isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Question deleted successfully", null));
    }
}
