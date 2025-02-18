
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
INSERT INTO Task (project_id, name, target_start_date, target_completion_date, status, description, target_days_to_complete) VALUES
-- Kick-off Meeting
(6, 'Kick-off Meeting', '2024-05-16', '2024-05-16', 'to_do', 'Initial planning meeting for HKCC Awards Ceremony 2024', 1),

-- Ceremony Planning
(6, 'Confirm Ceremony Date', '2024-05-16', '2024-09-27', 'to_do', 'Set final date for Awards Ceremony', 5),
(6, 'Define Ceremony Theme', '2024-05-16', '2024-08-15', 'to_do', 'Decide on theme: Product Safety Carnival', 1),

-- Venue Selection
(6, 'Select and Confirm Venue', '2024-01-31', '2024-06-01', 'to_do', 'Venue at Tsuen Wan, Tsuen Wan Plaza', 7),

-- Contractor Selection
(6, 'Select Stage Production Contractor', '2024-05-20', '2024-08-02', 'to_do', 'Choose JD Stage Production at \$34,380', 2),
(6, 'Select Booth Contractor', '2024-05-20', '2024-08-02', 'to_do', 'Choose 美境展銷推廣有限公司 at \$70,000', 2),

-- Exhibitors and Booths
(6, 'Prepare Booth Exhibitors List', '2024-05-02', '2024-08-05', 'to_do', 'Invite and confirm booth exhibitors', 4),
(6, 'Finalize Exhibitor Numbers', '2024-05-31', '2024-09-20', 'to_do', '20 exhibitors on 27/09, 21 exhibitors from 28/9 to 4/10', 1),

-- Floor Plan
(6, 'Obtain Venue Floor Plan', '2024-05-01', '2024-05-31', 'to_do', 'Get floor plan from venue', 3),
(6, 'Create Updated Floor Plan', '2024-06-01', '2024-06-21', 'to_do', 'New floor plan without storeroom', 1),
(6, 'Submit Floor Plan to FEHD', '2024-07-02', '2024-07-30', 'to_do', 'Official submission of floor plan', 1),

-- Opening Ceremony
(6, 'Prepare Opening Ceremony Production', '2024-05-20', '2024-09-03', 'to_do', 'Work with JD Stage Production on opening animation', 5),
(6, 'Prepare Opening Ceremony Sound Effects', '2024-09-13', '2024-09-23', 'to_do', 'Add balloon popping and applause tracks', 8),

-- Artist/Ambassador
(6, 'Select Ceremony Ambassador', '2024-05-20', '2024-08-01', 'to_do', 'Confirmed 譚輝智 as ambassador', 3),

-- Emcee
(6, 'Select Ceremony Emcee', '2024-07-31', '2024-06-14', 'to_do', 'Confirmed Agnes Leung as emcee', 1),

-- Honorable Guests
(6, 'Generate Honorable Guest List', '2024-04-01', '2024-04-30', 'to_do', 'Initial list of potential guests', 1),
(6, 'Invite Honorable Guests', '2024-05-01', '2024-08-31', 'to_do', 'Send invitations to potential guests', 1),
(6, 'Confirm Guest Attendance', '2024-08-01', '2024-09-20', 'to_do', 'Mr. TSE Chin-wan confirmed attendance', 7),

-- Media and Invitations
(6, 'Prepare Media Invitations', '2024-05-16', '2024-08-30', 'to_do', 'Draft and prepare media invitation letters', 4),
(6, 'Send Media Invitations', '2024-09-03', '2024-09-05', 'to_do', 'First round of media invitations', 1),

-- Marketing Materials
(6, 'Create Marketing Materials', '2024-08-20', '2024-09-13', 'to_do', 'Prepare posters, flyers, backdrop, and other materials', 12);


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
(20, 6, 19, 6), -- Send Media Invitations depends on Invitation Preparation

-- Marketing Materials Dependencies
(21, 6, 19, 6); -- Create Marketing Materials depends on Media Invitation Preparation

-------------------------------
-- Project 1: Awards Ceremony
-------------------------------
-- Task 1: Create supply list (done)
UPDATE Task
SET actual_start_date = '2025-03-14',
    actual_completion_date = '2025-03-15',
    expected_cost = 10.00,
    actual_cost = 9.50
WHERE project_id = 1 AND id = 1;

-- Task 2: Buy supplies (in_progress)
UPDATE Task
SET actual_start_date = '2025-03-15',
    -- not yet finished, so no actual_completion_date
    expected_cost = 150.00,
    actual_cost = 100.00
WHERE project_id = 1 AND id = 2;

-- Task 3: Set up venue (to_do – not started yet)
UPDATE Task
SET expected_cost = 300.00
-- actual_start_date and actual_completion_date left as NULL
WHERE project_id = 1 AND id = 3;

-- Task 4: Book venue (on_hold)
UPDATE Task
SET actual_start_date = '2025-03-14',
    expected_cost = 120.00,
    actual_cost = 60.00
-- still on hold so no completion date
WHERE project_id = 1 AND id = 4;

-- Task 5: Create guest list (to_do)
UPDATE Task
SET expected_cost = 20.00
WHERE project_id = 1 AND id = 5;

-- Task 6: Send invitations (to_do)
UPDATE Task
SET expected_cost = 0.00
WHERE project_id = 1 AND id = 6;


-------------------------------
-- Project 2: Create Flyer
-------------------------------
-- Task 1: Design flyer
UPDATE Task
SET actual_start_date = '2025-03-08',
    actual_completion_date = '2025-03-10',
    expected_cost = 75.00,
    actual_cost = 80.00
WHERE project_id = 2 AND id = 1;

-- Task 2: Get design approved
UPDATE Task
SET actual_start_date = '2025-03-10',
    actual_completion_date = '2025-03-14',
    expected_cost = 20.00,
    actual_cost = 20.00
WHERE project_id = 2 AND id = 2;

-- Task 3: Print flyers
UPDATE Task
SET actual_start_date = '2025-03-14',
    actual_completion_date = '2025-03-15',
    expected_cost = 50.00,
    actual_cost = 55.00
WHERE project_id = 2 AND id = 3;


-------------------------------
-- Project 3: Create Poster
-------------------------------
-- Note: The target_completion_date for “Design poster” in the INSERT was earlier than the start date.
-- Here we “fix” it by assuming a later completion.
-- Task 1: Design poster
UPDATE Task
SET actual_start_date = '2025-03-09',
    actual_completion_date = '2025-03-12',
    expected_cost = 100.00,
    actual_cost = 95.00
WHERE project_id = 3 AND id = 1;

-- Task 2: Get design approved
UPDATE Task
SET actual_start_date = '2025-03-12',
    actual_completion_date = '2025-03-14',
    expected_cost = 30.00,
    actual_cost = 30.00
WHERE project_id = 3 AND id = 2;

-- Task 3: Print poster
UPDATE Task
SET actual_start_date = '2025-03-14',
    actual_completion_date = '2025-03-17',
    expected_cost = 70.00,
    actual_cost = 68.00
WHERE project_id = 3 AND id = 3;


-------------------------------
-- Project 4: Morning Routine
-------------------------------
-- Task 1: Wake up
UPDATE Task
SET actual_start_date = '2025-03-14',
    actual_completion_date = '2025-03-14',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 4 AND id = 1;

-- Task 2: Brush teeth
UPDATE Task
SET actual_start_date = '2025-03-14',
    actual_completion_date = '2025-03-14',
    expected_cost = 1.00,
    actual_cost = 1.00
WHERE project_id = 4 AND id = 2;

-- Task 3: Wash face
UPDATE Task
SET actual_start_date = '2025-03-14',
    actual_completion_date = '2025-03-14',
    expected_cost = 0.50,
    actual_cost = 0.50
WHERE project_id = 4 AND id = 3;

-- Task 4: Eat breakfast
UPDATE Task
SET actual_start_date = '2025-03-14',
    actual_completion_date = '2025-03-14',
    expected_cost = 5.00,
    actual_cost = 5.50
WHERE project_id = 4 AND id = 4;


-------------------------------
-- Project 5: Morning Routine of Jason
-------------------------------
-- Task 1: Wake up
UPDATE Task
SET actual_start_date = '2025-03-14',
    actual_completion_date = '2025-03-14',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 5 AND id = 1;

-- Task 2: Get off bed
UPDATE Task
SET actual_start_date = '2025-03-14',
    actual_completion_date = '2025-03-14',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 5 AND id = 2;

-- Task 3: Brush teeth
UPDATE Task
SET actual_start_date = '2025-03-14',
    actual_completion_date = '2025-03-14',
    expected_cost = 1.00,
    actual_cost = 1.00
WHERE project_id = 5 AND id = 3;

-- Task 4: Scroll Phone
UPDATE Task
SET actual_start_date = '2025-03-14',
    actual_completion_date = '2025-03-14',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 5 AND id = 4;

-- Task 5: ...
UPDATE Task
SET actual_start_date = '2025-03-14',
    actual_completion_date = '2025-03-14',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 5 AND id = 5;


-------------------------------
-- Project 6: Awards Ceremony 2024
-------------------------------

-- Task 1: Kick-off Meeting
UPDATE Task
SET actual_start_date = '2024-05-16',
    actual_completion_date = '2024-05-16',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 1;

-- Task 2: Confirm Ceremony Date
UPDATE Task
SET actual_start_date = '2024-05-16',
    actual_completion_date = '2024-06-01',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 2;

-- Task 3: Define Ceremony Theme
UPDATE Task
SET actual_start_date = '2024-05-16',
    actual_completion_date = '2024-05-30',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 3;

-- Task 4: Select and Confirm Venue
UPDATE Task
SET actual_start_date = '2024-01-31',
    actual_completion_date = '2024-06-01',
    expected_cost = 5000.00,
    actual_cost = 5200.00
WHERE project_id = 6 AND id = 4;

-- Task 5: Select Stage Production Contractor
UPDATE Task
SET actual_start_date = '2024-05-20',
    actual_completion_date = '2024-07-15',
    expected_cost = 34380.00,
    actual_cost = 35000.00
WHERE project_id = 6 AND id = 5;

-- Task 6: Select Booth Contractor
UPDATE Task
SET actual_start_date = '2024-05-20',
    actual_completion_date = '2024-07-20',
    expected_cost = 70000.00,
    actual_cost = 69000.00
WHERE project_id = 6 AND id = 6;

-- Task 7: Prepare Booth Exhibitors List
UPDATE Task
SET actual_start_date = '2024-05-02',
    actual_completion_date = '2024-05-15',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 7;

-- Task 8: Finalize Exhibitor Numbers
UPDATE Task
SET actual_start_date = '2024-05-31',
    actual_completion_date = '2024-06-05',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 8;

-- Task 9: Obtain Venue Floor Plan
UPDATE Task
SET actual_start_date = '2024-05-01',
    actual_completion_date = '2024-05-30',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 9;

-- Task 10: Create Updated Floor Plan
UPDATE Task
SET actual_start_date = '2024-06-01',
    actual_completion_date = '2024-06-20',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 10;

-- Task 11: Submit Floor Plan to FEHD
UPDATE Task
SET actual_start_date = '2024-07-02',
    actual_completion_date = '2024-07-25',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 11;

-- Task 12: Prepare Opening Ceremony Production
UPDATE Task
SET actual_start_date = '2024-05-20',
    actual_completion_date = '2024-08-15',
    expected_cost = 5000.00,
    actual_cost = 5100.00
WHERE project_id = 6 AND id = 12;

-- Task 13: Prepare Opening Ceremony Sound Effects
UPDATE Task
SET actual_start_date = '2024-09-13',
    actual_completion_date = '2024-09-23',
    expected_cost = 1500.00,
    actual_cost = 1450.00
WHERE project_id = 6 AND id = 13;

-- Task 14: Select Ceremony Ambassador
UPDATE Task
SET actual_start_date = '2024-05-20',
    actual_completion_date = '2024-06-01',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 14;

-- Task 15: Select Ceremony Emcee
-- (Note: target dates were “swapped” in our fix)
UPDATE Task
SET actual_start_date = '2024-06-14',
    actual_completion_date = '2024-07-31',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 15;

-- Task 16: Generate Honorable Guest List
UPDATE Task
SET actual_start_date = '2024-04-01',
    actual_completion_date = '2024-04-15',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 16;

-- Task 17: Invite Honorable Guests
UPDATE Task
SET actual_start_date = '2024-05-01',
    actual_completion_date = '2024-06-01',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 17;

-- Task 18: Confirm Guest Attendance
UPDATE Task
SET actual_start_date = '2024-08-01',
    actual_completion_date = '2024-08-15',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 18;

-- Task 19: Prepare Media Invitations
UPDATE Task
SET actual_start_date = '2024-05-16',
    actual_completion_date = '2024-05-30',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 19;

-- Task 20: Send Media Invitations
UPDATE Task
SET actual_start_date = '2024-09-03',
    actual_completion_date = '2024-09-05',
    expected_cost = 0.00,
    actual_cost = 0.00
WHERE project_id = 6 AND id = 20;

-- Task 21: Create Marketing Materials
UPDATE Task
SET actual_start_date = '2024-08-20',
    actual_completion_date = '2024-09-10',
    expected_cost = 4000.00,
    actual_cost = 4100.00
WHERE project_id = 6 AND id = 21;
