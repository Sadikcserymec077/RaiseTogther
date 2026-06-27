package com.crowdcash.scheduler;

import com.crowdcash.service.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CampaignScheduler {

    @Autowired
    private CampaignService campaignService;

    @Scheduled(cron = "0 0 0 * * *") // daily at midnight
    public void expireCampaigns() {
        System.out.println("[Scheduler] Running daily campaign expiry check...");
        campaignService.checkAndExpireCampaigns();
        System.out.println("[Scheduler] Campaign expiry check complete.");
    }
}
