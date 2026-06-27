package com.crowdcash.controller;

import com.crowdcash.dto.AiAssistRequest;
import com.crowdcash.dto.AiAssistResponse;
import com.crowdcash.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class AiController {

    private final AiService aiService;

    @PostMapping("/suggest-title")
    public ResponseEntity<AiAssistResponse> suggestTitle(@RequestBody AiAssistRequest req) {
        return ResponseEntity.ok(aiService.assistCampaign(req));
    }

    @PostMapping("/improve-description")
    public ResponseEntity<AiAssistResponse> improveDescription(@RequestBody AiAssistRequest req) {
        return ResponseEntity.ok(aiService.assistCampaign(req));
    }

    @PostMapping("/fundraising-tips")
    public ResponseEntity<AiAssistResponse> fundraisingTips(@RequestBody AiAssistRequest req) {
        return ResponseEntity.ok(aiService.assistCampaign(req));
    }

    @PostMapping("/suggest-goal")
    public ResponseEntity<AiAssistResponse> suggestGoal(@RequestBody AiAssistRequest req) {
        return ResponseEntity.ok(aiService.assistCampaign(req));
    }

    @PostMapping("/validate-campaign")
    public ResponseEntity<AiAssistResponse> validateCampaign(@RequestBody AiAssistRequest req) {
        return ResponseEntity.ok(aiService.assistCampaign(req));
    }

    @PostMapping("/full-assist")
    public ResponseEntity<AiAssistResponse> fullAssist(@RequestBody AiAssistRequest req) {
        return ResponseEntity.ok(aiService.assistCampaign(req));
    }
}
