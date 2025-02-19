-- Insert Projects
INSERT INTO Project (id, parent, name) VALUES
                                           (1, NULL, 'Awards Ceremony'),
                                           (2, NULL, 'Create Flyer'),
                                           (3, 1, 'Create Poster'),
                                           (4, NULL, 'Morning Routine'),
                                           (5, NULL, 'Morning Routine of Jason'),
                                           (6, NULL, 'Awards Ceremony 2024');

-- Reset Sequences
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

----------------------------------------------------------------
-- Insert Tasks with full info (planning, actual dates, costs, status)
----------------------------------------------------------------

-- Project 1: Awards Ceremony
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (1, 'Create supply list', '2025-03-14', '2025-03-15', 2, 'done', '2025-03-14', '2025-03-15', 10.00, 9.50),
    (1, 'Buy supplies',       '2025-03-15', '2025-03-16', 2, 'in_progress', '2025-03-15', NULL,        150.00, 100.00),
    (1, 'Set up venue',       '2025-03-16', '2025-03-18', 3, 'to_do',     NULL,       NULL,         300.00, 0.00),
    (1, 'Book venue',         '2025-03-14', '2025-03-16', 3, 'on_hold',   '2025-03-14', NULL,         120.00, 60.00),
    (1, 'Create guest list',  '2025-03-12', '2025-03-14', 3, 'to_do',     NULL,       NULL,         20.00,  0.00),
    (1, 'Send invitations',   '2025-03-14', '2025-03-14', 1, 'to_do',     NULL,       NULL,         0.00,   0.00);

-- Project 2: Create Flyer
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (2, 'Design flyer',      '2025-03-08', '2025-03-10', 3, 'done', '2025-03-08', '2025-03-10', 75.00, 80.00),
    (2, 'Get design approved', '2025-03-10', '2025-03-14', 5, 'done', '2025-03-10', '2025-03-14', 20.00, 20.00),
    (2, 'Print flyers',      '2025-03-14', '2025-03-15', 2, 'done', '2025-03-14', '2025-03-15', 50.00, 55.00);

-- Project 3: Create Poster
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (3, 'Design poster',     '2025-03-09', '2025-03-12', 4, 'done', '2025-03-09', '2025-03-12', 100.00, 95.00),
    (3, 'Get design approved','2025-03-12', '2025-03-14', 3, 'done', '2025-03-12', '2025-03-14', 30.00, 30.00),
    (3, 'Print poster',      '2025-03-14', '2025-03-17', 4, 'done', '2025-03-14', '2025-03-17', 70.00, 68.00);

-- Project 4: Morning Routine
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (4, 'Wake up',       '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 0.00,  0.00),
    (4, 'Brush teeth',    '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 1.00,  1.00),
    (4, 'Wash face',      '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 0.50,  0.50),
    (4, 'Eat breakfast',   '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 5.00,  5.50);

-- Project 5: Morning Routine of Jason
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (5, 'Wake up',       '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 0.00,  0.00),
    (5, 'Get off bed',   '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 0.00,  0.00),
    (5, 'Brush teeth',    '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 1.00,  1.00),
    (5, 'Scroll Phone',   '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 0.00,  0.00),
    (5, '...',           '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 0.00,  0.00);

-- Project 6: Awards Ceremony 2024
-- (Here we’ve also added a description column.)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (6, 'Kick-off Meeting', '2024-05-16', '2024-05-16', 1, 'done',
     'Initial planning meeting for HKCC Awards Ceremony 2024', '2024-05-16', '2024-05-16', 0.00, 0.00),
    (6, 'Confirm Ceremony Date', '2024-05-17', '2024-05-21', 5, 'done',
     'Set final date for Awards Ceremony', '2024-05-17', '2024-05-21', 0.00, 0.00),
    (6, 'Define Ceremony Theme', '2024-05-22', '2024-05-26', 5, 'done',
     'Decide on theme: Product Safety Carnival', '2024-05-22', '2024-05-26', 0.00, 0.00),
    (6, 'Select and Confirm Venue', '2024-04-01', '2024-04-10', 10, 'done',
     'Venue at Tsuen Wan, Tsuen Wan Plaza', '2024-04-01', '2024-04-10', 5000.00, 5200.00),
    (6, 'Select Stage Production Contractor', '2024-05-20', '2024-06-10', 22, 'done',
     'Choose JD Stage Production', '2024-05-20', '2024-06-10', 34380.00, 35000.00),
    (6, 'Select Booth Contractor', '2024-05-20', '2024-06-12', 24, 'done',
     'Choose 美境展銷推廣有限公司', '2024-05-20', '2024-06-12', 70000.00, 69000.00),
    (6, 'Prepare Booth Exhibitors List', '2024-06-01', '2024-06-05', 5, 'done',
     'Invite and confirm booth exhibitors', '2024-06-01', '2024-06-05', 0.00, 0.00),
    (6, 'Finalize Exhibitor Numbers', '2024-06-06', '2024-06-10', 5, 'done',
     'Finalize exhibitor numbers', '2024-06-06', '2024-06-10', 0.00, 0.00),
    (6, 'Obtain Venue Floor Plan', '2024-04-15', '2024-04-20', 6, 'done',
     'Get floor plan from venue', '2024-04-15', '2024-04-20', 0.00, 0.00),
    (6, 'Create Updated Floor Plan', '2024-04-21', '2024-04-25', 5, 'done',
     'New floor plan without storeroom', '2024-04-21', '2024-04-25', 0.00, 0.00),
    (6, 'Submit Floor Plan to FEHD', '2024-04-26', '2024-04-30', 5, 'done',
     'Official submission of floor plan', '2024-04-26', '2024-04-30', 0.00, 0.00),
    (6, 'Prepare Opening Ceremony Production', '2024-06-11', '2024-06-25', 15, 'done',
     'Work with JD Stage Production on opening animation', '2024-06-11', '2024-06-25', 5000.00, 5100.00),
    (6, 'Prepare Opening Ceremony Sound Effects', '2024-06-26', '2024-07-05', 10, 'done',
     'Add balloon popping and applause tracks', '2024-06-26', '2024-07-05', 1500.00, 1450.00),
    (6, 'Select Ceremony Ambassador', '2024-05-27', '2024-05-30', 4, 'done',
     'Confirmed 譚輝智 as ambassador', '2024-05-27', '2024-05-30', 0.00, 0.00),
    (6, 'Select Ceremony Emcee', '2024-05-31', '2024-06-03', 4, 'done',
     'Confirmed Agnes Leung as emcee', '2024-05-31', '2024-06-03', 0.00, 0.00),
    (6, 'Generate Honorable Guest List', '2024-04-01', '2024-04-05', 5, 'done',
     'Initial list of potential guests', '2024-04-01', '2024-04-05', 0.00, 0.00),
    (6, 'Invite Honorable Guests', '2024-04-06', '2024-04-10', 5, 'done',
     'Send invitations to potential guests', '2024-04-06', '2024-04-10', 0.00, 0.00),
    (6, 'Confirm Guest Attendance', '2024-04-11', '2024-04-15', 5, 'done',
     'Mr. TSE Chin-wan confirmed attendance', '2024-04-11', '2024-04-15', 0.00, 0.00),
    (6, 'Prepare Media Invitations', '2024-04-16', '2024-04-20', 5, 'done',
     'Draft and prepare media invitation letters', '2024-04-16', '2024-04-20', 0.00, 0.00),
    (6, 'Send Media Invitations', '2024-04-21', '2024-04-23', 3, 'done',
     'First round of media invitations', '2024-04-21', '2024-04-23', 0.00, 0.00),
    (6, 'Create Marketing Materials', '2024-04-24', '2024-04-28', 5, 'done',
     'Prepare posters, flyers, backdrop, and other materials', '2024-04-24', '2024-04-28', 4000.00, 4100.00);

----------------------------------------------------------------
-- Insert Dependency Information (unchanged)
----------------------------------------------------------------

INSERT INTO Task_Depends_On (task_id, project_id, depends_task_id, depends_project_id) VALUES
                                                                                           -- Dependencies for Projects 1–5
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

-- Dependencies for Awards Ceremony 2024 (Project 6)
INSERT INTO Task_Depends_On (task_id, project_id, depends_task_id, depends_project_id) VALUES
                                                                                           -- Venue and Contractor Selection Dependencies
                                                                                           (5, 6, 4, 6),  -- Stage Production Contractor depends on Venue Selection
                                                                                           (6, 6, 4, 6),  -- Booth Contractor depends on Venue Selection

                                                                                           -- Exhibitor and Floor Plan Dependencies
                                                                                           (7, 6, 5, 6),  -- Prepare Booth Exhibitors depends on Booth Contractor selection
                                                                                           (8, 6, 7, 6),  -- Finalize Exhibitor Numbers depends on preparing Exhibitors List
                                                                                           (9, 6, 4, 6),  -- Obtain Venue Floor Plan depends on Venue Selection
                                                                                           (10, 6, 9, 6), -- Create Updated Floor Plan depends on Obtaining Floor Plan
                                                                                           (11, 6, 10, 6), -- Submit Floor Plan to FEHD depends on Creating Floor Plan

                                                                                           -- Opening Ceremony Dependencies
                                                                                           (12, 6, 5, 6),  -- Opening Ceremony Production depends on Stage Production Contractor
                                                                                           (13, 6, 12, 6), -- Sound Effects depends on Opening Ceremony Production

                                                                                           -- Artist/Ambassador and Emcee Dependencies
                                                                                           (14, 6, 12, 6), -- Artist/Ambassador selection after Opening Ceremony planning
                                                                                           (15, 6, 14, 6), -- Emcee selection after Artist selection

                                                                                           -- Honorable Guests and Media Invitations Dependencies
                                                                                           (16, 6, 15, 6), -- Generate Honorable Guest List after Emcee confirmation
                                                                                           (17, 6, 16, 6), -- Invite Honorable Guests depends on Guest List
                                                                                           (18, 6, 17, 6), -- Confirm Guest Attendance depends on Invitations
                                                                                           (19, 6, 18, 6), -- Prepare Media Invitations depends on Guest Confirmations
                                                                                           (20, 6, 19, 6), -- Send Media Invitations depends on Invitation Preparation

                                                                                           -- Marketing Materials Dependencies
                                                                                           (21, 6, 19, 6); -- Create Marketing Materials depends on Media Invitation Preparation
