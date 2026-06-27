package com.crowdcash.service;

import com.crowdcash.dto.AiAssistRequest;
import com.crowdcash.dto.AiAssistResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${ai.api-key:}")
    private String anthropicApiKey;

    @Value("${ai.api-url:https://api.anthropic.com/v1/messages}")
    private String apiUrl;

    @Value("${ai.model:claude-3-haiku-20240307}")
    private String model;

    private final ObjectMapper objectMapper;

    public AiAssistResponse assistCampaign(AiAssistRequest req) {
        if(anthropicApiKey == null || anthropicApiKey.isBlank()) {
            return new AiAssistResponse(); // fallback if no key
        }
        
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", anthropicApiKey);
        headers.set("anthropic-version", "2023-06-01");
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
            "model", model,
            "max_tokens", 1000,
            "messages", List.of(Map.of("role", "user", "content", buildPrompt(req)))
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            return parseAiResponse(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return new AiAssistResponse(); // fallback
        }
    }

    private String buildPrompt(AiAssistRequest req) {
        return String.format(
            "You are an expert crowdfunding campaign advisor for an Indian crowdfunding platform.\n" +
            "Analyze this campaign and respond ONLY with valid JSON, no extra text.\n" +
            "Title: %s\nCategory: %s\nDescription: %s\nCurrent Goal: %s\nLocation: %s\n" +
            "Return ONLY:\n" +
            "{\n  \"suggestedTitle\": \"...\",\n  \"improvedDescription\": \"...\",\n  \"improvedStory\": \"...\",\n  \"suggestedGoal\": 0,\n  \"fundraisingTips\": [\"tip1\"],\n  \"missingFields\": [\"field1\"],\n  \"generalAdvice\": \"...\"\n}",
            req.getTitle(), req.getCategory(), req.getDescription(), req.getCurrentGoal(), req.getLocation()
        );
    }
    
    private AiAssistResponse parseAiResponse(String body) {
        try {
            JsonNode root = objectMapper.readTree(body);
            String content = root.path("content").get(0).path("text").asText();
            // find json block if present
            int start = content.indexOf("{");
            int end = content.lastIndexOf("}") + 1;
            if (start != -1 && end != -1) {
                content = content.substring(start, end);
            }
            return objectMapper.readValue(content, AiAssistResponse.class);
        } catch(Exception e) {
            return new AiAssistResponse();
        }
    }
}
