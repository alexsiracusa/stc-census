
INSERT INTO Project (id, parent, name) VALUES
(1, NULL, 'Awards Ceremony'),
(2, NULL, 'Create Flyer'),
(3, 1, 'Create Poster'),
(4, NULL, 'Morning Routine'),
(5, NULL, 'Morning Routine of Jason'),
(6, NULL, 'Awards Ceremony 2024');

ALTER SEQUENCE project_id_seq RESTART WITH 7;
ALTER SEQUENCE task_seq_1 RESTART WITH 1;
ALTER SEQUENCE task_seq_2 RESTART WITH 1;
ALTER SEQUENCE task_seq_3 RESTART WITH 1;
ALTER SEQUENCE task_seq_4 RESTART WITH 1;
ALTER SEQUENCE task_seq_5 RESTART WITH 1;
ALTER SEQUENCE task_seq_6 RESTART WITH 1;
ALTER SEQUENCE task_seq_7 RESTART WITH 1;
ALTER SEQUENCE task_seq_8 RESTART WITH 1;
ALTER SEQUENCE task_seq_9 RESTART WITH 1;
ALTER SEQUENCE task_seq_10 RESTART WITH 1;

INSERT INTO Task (project_id, name, target_start_date, target_completion_date, target_days_to_complete) VALUES
(1, 'Create supply list', '2025-03-14', '2025-03-15', 3),
(1, 'Buy supplies', '2025-03-15', '2025-03-16', 4),
(1, 'Set up venue', '2025-03-16', '2025-03-18', 2),
(1, 'Book venue', '2025-03-14', '2025-03-16', 1),
(1, 'Create guest list', '2025-03-12', '2025-03-14', 5),
(1, 'Send invitations', '2025-03-14', '2025-03-14', 3),
(2, 'Design flyer', '2025-03-8', '2025-03-10', 2),
(2, 'Get design approved', '2025-03-10', '2025-03-14', 3),
(2, 'Print flyers', '2025-03-14', '2025-03-15', 4),
(3, 'Design poster', '2025-03-9', '2025-02-10', 5),
(3, 'Get design approved', '2025-03-10', '2025-03-14', 7),
(3, 'Print poster', '2025-03-14', '2025-03-17', 2),

(4, 'Wake up', '2025-03-14', '2025-03-14', 5),
(4, 'Brush teeth', '2025-03-14', '2025-03-14', 3),
(4, 'Wash face', '2025-03-14', '2025-03-14', 1),
(4, 'Eat breakfast', '2025-03-14', '2025-03-14', 10),

(5, 'Wake up', '2025-03-14', '2025-03-14', 5),
(5, 'Get off bed', '2025-03-14', '2025-03-14', 30),
(5, 'Brush teeth', '2025-03-14', '2025-03-14', 3),
(5, 'Scroll Phone', '2025-03-14', '2025-03-14', 15),
(5, '...', '2025-03-14', '2025-03-14', 20);


UPDATE Task SET status = 'done' WHERE id = 1 AND project_id = 1;
UPDATE Task SET status = 'in_progress' WHERE id = 2 AND project_id = 1;
UPDATE Task SET status = 'on_hold' WHERE id = 4 AND project_id = 1;


INSERT INTO Task_Depends_On (task_id, project_id, depends_task_id, depends_project_id) VALUES
(3, 1, 4, 1),
(3, 1, 2, 1),
(2, 1, 1, 1),
(6, 1, 5, 1),

(3, 2, 2, 2),
(2, 2, 1, 2),

(3, 3, 2, 3),
(2, 3, 1, 3),

(2, 4, 1, 4),
(3, 4, 2, 4),
(4, 4, 3, 4),

(2, 5, 1, 5),
(3, 5, 2, 5),
(4, 5, 1, 5),
(5, 5, 3, 5);

-- Insert tasks for Awards Ceremony 2024
INSERT INTO Task (project_id, name, target_start_date, target_completion_date, status, description) VALUES
-- Kick-off Meeting
(6, 'Kick-off Meeting', '2024-05-16', '2024-05-16', 'done', 'Initial planning meeting for HKCC Awards Ceremony 2024'),

-- Ceremony Planning
(6, 'Confirm Ceremony Date', '2024-05-16', '2024-09-27', 'done', 'Set final date for Awards Ceremony'),
(6, 'Define Ceremony Theme', '2024-05-16', '2024-08-15', 'done', 'Decide on theme: Product Safety Carnival'),

-- Venue Selection
(6, 'Select and Confirm Venue', '2024-01-31', '2024-06-01', 'done', 'Venue at Tsuen Wan, Tsuen Wan Plaza'),

-- Contractor Selection
(6, 'Select Stage Production Contractor', '2024-05-20', '2024-08-02', 'done', 'Choose JD Stage Production at \$34,380'),
(6, 'Select Booth Contractor', '2024-05-20', '2024-08-02', 'done', 'Choose 美境展銷推廣有限公司 at \$70,000'),

-- Exhibitors and Booths
(6, 'Prepare Booth Exhibitors List', '2024-05-02', '2024-08-05', 'done', 'Invite and confirm booth exhibitors'),
(6, 'Finalize Exhibitor Numbers', '2024-05-31', '2024-09-20', 'done', '20 exhibitors on 27/09, 21 exhibitors from 28/9 to 4/10'),

-- Floor Plan
(6, 'Obtain Venue Floor Plan', '2024-05-01', '2024-05-31', 'done', 'Get floor plan from venue'),
(6, 'Create Updated Floor Plan', '2024-06-01', '2024-06-21', 'done', 'New floor plan without storeroom'),
(6, 'Submit Floor Plan to FEHD', '2024-07-02', '2024-07-30', 'done', 'Official submission of floor plan'),

-- Opening Ceremony
(6, 'Prepare Opening Ceremony Production', '2024-05-20', '2024-09-03', 'done', 'Work with JD Stage Production on opening animation'),
(6, 'Prepare Opening Ceremony Sound Effects', '2024-09-13', '2024-09-23', 'done', 'Add balloon popping and applause tracks'),

-- Artist/Ambassador
(6, 'Select Ceremony Ambassador', '2024-05-20', '2024-08-01', 'done', 'Confirmed 譚輝智 as ambassador'),

-- Emcee
(6, 'Select Ceremony Emcee', '2024-07-31', '2024-06-14', 'done', 'Confirmed Agnes Leung as emcee'),

-- Honorable Guests
(6, 'Generate Honorable Guest List', '2024-04-01', '2024-04-30', 'done', 'Initial list of potential guests'),
(6, 'Invite Honorable Guests', '2024-05-01', '2024-08-31', 'done', 'Send invitations to potential guests'),
(6, 'Confirm Guest Attendance', '2024-08-01', '2024-09-20', 'done', 'Mr. TSE Chin-wan confirmed attendance'),

-- Media and Invitations
(6, 'Prepare Media Invitations', '2024-05-16', '2024-08-30', 'done', 'Draft and prepare media invitation letters'),
(6, 'Send Media Invitations', '2024-09-03', '2024-09-05', 'done', 'First round of media invitations'),

-- Marketing Materials
(6, 'Create Marketing Materials', '2024-08-20', '2024-09-13', 'done', 'Prepare posters, flyers, backdrop, and other materials');


-- Insert dependencies for Awards Ceremony 2024 tasks
INSERT INTO Task_Depends_On (task_id, project_id, depends_task_id, depends_project_id) VALUES
-- Venue and Contractor Selection Dependencies
(5, 6, 4, 6),  -- Stage Production Contractor depends on Venue Selection
(6, 6, 4, 6),  -- Booth Contractor depends on Venue Selection

-- Exhibitor and Floor Plan Dependencies
(7, 6, 5, 6),  -- Prepare Booth Exhibitors depends on Booth Contractor selection
(8, 6, 7, 6),  -- Finalize Exhibitor Numbers depends on Preparing Exhibitors List
(9, 6, 4, 6),  -- Obtain Venue Floor Plan depends on Venue Selection
(10, 6, 9, 6), -- Create Updated Floor Plan depends on Obtaining Floor Plan
(11, 6, 10, 6), -- Submit Floor Plan to FEHD depends on Creating Floor Plan

-- Opening Ceremony Dependencies
(12, 6, 5, 6),  -- Opening Ceremony Production depends on Stage Production Contractor
(13, 6, 12, 6), -- Sound Effects depends on Opening Ceremony Production

-- Artist/Ambassador and Emcee Dependencies
(14, 6, 12, 6), -- Artist/Ambassador selection can happen after Opening Ceremony planning
(15, 6, 14, 6), -- Emcee selection can happen after Artist selection

-- Honorable Guests and Media Invitations Dependencies
(16, 6, 15, 6), -- Generate Honorable Guest List can happen after Emcee confirmation
(17, 6, 16, 6), -- Invite Honorable Guests depends on Guest List
(18, 6, 17, 6), -- Confirm Guest Attendance depends on Invitations
(19, 6, 18, 6), -- Prepare Media Invitations depends on Guest Confirmations
(20, 6, 19, 6); -- Send Media Invitations depends on Invitation Preparation

-- Marketing Materials Dependencies
(21, 6, 19, 6); -- Create Marketing Materials depends on Media Invitation Preparation
