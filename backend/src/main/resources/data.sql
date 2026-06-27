-- Roles
INSERT IGNORE INTO roles (id, name) VALUES (1, 'ROLE_USER'), (2, 'ROLE_ADMIN');

-- Admin user (password: Sadik#1212 — BCrypt hash)
-- Email: sadik.cse.rymec@gmail.com
INSERT IGNORE INTO users (id, name, email, password, is_email_verified, is_active, created_at, updated_at)
VALUES (1, 'Sadik Admin', 'sadik.cse.rymec@gmail.com',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        true, true, NOW(), NOW());

INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (1, 1), (1, 2);

-- Badges
INSERT IGNORE INTO badges (name, description, type) VALUES
('Top Donor',       'Donated over ₹50,000 in total',           'TOP_DONOR'),
('Verified Creator','Had first campaign approved',              'VERIFIED_CREATOR'),
('100 Donations',   'Made 100 successful donations',            'HUNDRED_DONATIONS'),
('First Campaign',  'Created first campaign',                   'FIRST_CAMPAIGN'),
('Goal Achieved',   'Campaign reached 100% funding',            'GOAL_ACHIEVED'),
('Fast Growing',    'Reached 50% goal within 48 hours',         'FAST_GROWING'),
('Community Hero',  'Donated to 10+ different campaigns',       'COMMUNITY_HERO'),
('Early Backer',    'Donated within 24h of campaign going live','EARLY_BACKER');
