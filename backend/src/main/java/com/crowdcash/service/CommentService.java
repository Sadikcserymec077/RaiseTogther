package com.crowdcash.service;

import com.crowdcash.dto.CommentResponse;
import com.crowdcash.dto.CreateCommentRequest;
import com.crowdcash.dto.UserSummaryResponse;
import com.crowdcash.model.Campaign;
import com.crowdcash.model.Comment;
import com.crowdcash.model.User;
import com.crowdcash.model.enums.NotificationType;
import com.crowdcash.repository.CampaignRepository;
import com.crowdcash.repository.CommentRepository;
import com.crowdcash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public CommentResponse postComment(Long campaignId, CreateCommentRequest request, Long userId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = Comment.builder()
                .campaign(campaign)
                .author(author)
                .content(request.getContent())
                .isDeleted(false)
                .build();

        comment = commentRepository.save(comment);

        // Notify campaign owner
        if (!campaign.getCreator().getId().equals(userId)) {
            String title = "New Comment on Your Campaign";
            String msg = author.getName() + " commented: \"" + truncateContent(comment.getContent()) + "\"";
            notificationService.createNotification(
                    campaign.getCreator().getId(),
                    NotificationType.NEW_COMMENT,
                    title,
                    msg,
                    campaign.getId(),
                    "CAMPAIGN"
            );
        }

        return mapToResponse(comment);
    }

    public CommentResponse replyToComment(Long commentId, CreateCommentRequest request, Long userId) {
        Comment parent = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment reply = Comment.builder()
                .campaign(parent.getCampaign())
                .author(author)
                .content(request.getContent())
                .parentComment(parent)
                .isDeleted(false)
                .build();

        reply = commentRepository.save(reply);

        // Notify parent comment author if not replying to oneself
        if (!parent.getAuthor().getId().equals(userId)) {
            String title = "Reply to your comment";
            String msg = author.getName() + " replied: \"" + truncateContent(reply.getContent()) + "\"";
            notificationService.createNotification(
                    parent.getAuthor().getId(),
                    NotificationType.NEW_COMMENT,
                    title,
                    msg,
                    parent.getCampaign().getId(),
                    "CAMPAIGN"
            );
        }

        return mapToResponse(reply);
    }

    public Page<CommentResponse> getComments(Long campaignId, Pageable pageable) {
        return commentRepository.findByCampaignIdAndParentCommentIsNull(campaignId, pageable)
                .map(this::mapToResponse);
    }

    public CommentResponse editComment(Long id, CreateCommentRequest request, Long userId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized comment access");
        }

        comment.setContent(request.getContent());
        comment = commentRepository.save(comment);
        return mapToResponse(comment);
    }

    public void deleteComment(Long id, Long userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!isAdmin && !comment.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized comment access");
        }

        comment.setIsDeleted(true);
        comment.setContent("This comment was removed.");
        commentRepository.save(comment);
    }

    private CommentResponse mapToResponse(Comment c) {
        List<CommentResponse> replyResponses = c.getReplies() != null ?
                c.getReplies().stream().map(this::mapToResponse).collect(Collectors.toList()) : List.of();

        UserSummaryResponse authorResponse = UserSummaryResponse.builder()
                .id(c.getAuthor().getId())
                .name(c.getAuthor().getName())
                .email(c.getAuthor().getEmail())
                .profilePicture(c.getAuthor().getProfilePicture())
                .build();

        return CommentResponse.builder()
                .id(c.getId())
                .content(c.getContent())
                .author(authorResponse)
                .isDeleted(c.getIsDeleted())
                .createdAt(c.getCreatedAt())
                .replies(replyResponses)
                .build();
    }

    private String truncateContent(String content) {
        if (content == null) return "";
        return content.length() > 50 ? content.substring(0, 47) + "..." : content;
    }
}
