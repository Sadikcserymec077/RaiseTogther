package com.crowdcash.service;

import com.crowdcash.dto.AnswerResponse;
import com.crowdcash.dto.CreateAnswerRequest;
import com.crowdcash.dto.CreateQuestionRequest;
import com.crowdcash.dto.QuestionResponse;
import com.crowdcash.dto.UserSummaryResponse;
import com.crowdcash.model.Answer;
import com.crowdcash.model.Campaign;
import com.crowdcash.model.Question;
import com.crowdcash.model.User;
import com.crowdcash.model.enums.NotificationType;
import com.crowdcash.repository.AnswerRepository;
import com.crowdcash.repository.CampaignRepository;
import com.crowdcash.repository.QuestionRepository;
import com.crowdcash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public QuestionResponse askQuestion(Long campaignId, CreateQuestionRequest request, Long userId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        User asker = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Question question = Question.builder()
                .campaign(campaign)
                .askedBy(asker)
                .content(request.getContent())
                .isAnswered(false)
                .build();

        question = questionRepository.save(question);

        // Notify campaign owner
        if (!campaign.getCreator().getId().equals(userId)) {
            String title = "New Question on Your Campaign";
            String msg = asker.getName() + " asked: \"" + truncateContent(question.getContent()) + "\"";
            notificationService.createNotification(
                    campaign.getCreator().getId(),
                    NotificationType.NEW_QUESTION,
                    title,
                    msg,
                    campaign.getId(),
                    "CAMPAIGN"
            );
        }

        return mapToResponse(question);
    }

    public Page<QuestionResponse> getQuestions(Long campaignId, Pageable pageable) {
        return questionRepository.findByCampaignId(campaignId, pageable)
                .map(this::mapToResponse);
    }

    public QuestionResponse answerQuestion(Long questionId, CreateAnswerRequest request, Long userId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Campaign campaign = question.getCampaign();
        if (!campaign.getCreator().getId().equals(userId)) {
            throw new RuntimeException("Only campaign creator can answer questions");
        }

        User owner = campaign.getCreator();

        Answer answer = Answer.builder()
                .question(question)
                .answeredBy(owner)
                .content(request.getContent())
                .build();

        answer = answerRepository.save(answer);

        question.setIsAnswered(true);
        question.setAnswer(answer);
        questionRepository.save(question);

        // Notify question author
        if (!question.getAskedBy().getId().equals(userId)) {
            String title = "Your Question Was Answered";
            String msg = owner.getName() + " answered your question: \"" + truncateContent(answer.getContent()) + "\"";
            notificationService.createNotification(
                    question.getAskedBy().getId(),
                    NotificationType.NEW_QUESTION,
                    title,
                    msg,
                    campaign.getId(),
                    "CAMPAIGN"
            );
        }

        return mapToResponse(question);
    }

    public AnswerResponse editAnswer(Long answerId, CreateAnswerRequest request, Long userId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        if (!answer.getAnsweredBy().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized answer access");
        }

        answer.setContent(request.getContent());
        answer = answerRepository.save(answer);
        return mapToAnswerResponse(answer);
    }

    public void deleteQuestion(Long id, Long userId, boolean isAdmin) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!isAdmin && !question.getAskedBy().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized question access");
        }

        questionRepository.delete(question);
    }

    private QuestionResponse mapToResponse(Question q) {
        UserSummaryResponse askedByRes = UserSummaryResponse.builder()
                .id(q.getAskedBy().getId())
                .name(q.getAskedBy().getName())
                .email(q.getAskedBy().getEmail())
                .profilePicture(q.getAskedBy().getProfilePicture())
                .build();

        AnswerResponse answerRes = q.getAnswer() != null ? mapToAnswerResponse(q.getAnswer()) : null;

        return QuestionResponse.builder()
                .id(q.getId())
                .content(q.getContent())
                .askedBy(askedByRes)
                .isAnswered(q.getIsAnswered())
                .answer(answerRes)
                .createdAt(q.getCreatedAt())
                .build();
    }

    private AnswerResponse mapToAnswerResponse(Answer a) {
        UserSummaryResponse answeredByRes = UserSummaryResponse.builder()
                .id(a.getAnsweredBy().getId())
                .name(a.getAnsweredBy().getName())
                .email(a.getAnsweredBy().getEmail())
                .profilePicture(a.getAnsweredBy().getProfilePicture())
                .build();

        return AnswerResponse.builder()
                .id(a.getId())
                .content(a.getContent())
                .answeredBy(answeredByRes)
                .createdAt(a.getCreatedAt())
                .build();
    }

    private String truncateContent(String content) {
        if (content == null) return "";
        return content.length() > 50 ? content.substring(0, 47) + "..." : content;
    }
}
