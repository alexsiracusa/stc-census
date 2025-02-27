-- Reset Sequences
ALTER SEQUENCE project_id_seq RESTART WITH 1;

----------------------------------------------------------------
-- Create Accounts
----------------------------------------------------------------
INSERT INTO Account (email, first_name, last_name, password_hash)
VALUES
    -- password: 'password'
    ('alexander.siracusa@gmail.com', 'alexander', 'siracusa', '$2b$12$bojXQ5Q/F5wpS5VnLP0Yve3Bdun41X4t3VJBnH6N2TohnmqZBkyM.'),
    -- password: 'gu'
    ('azgu@wpi.edu', 'alexander', 'gu', '$2b$12$7jTHX5prhBJWd3xXVaE./e0fWuDMjxgdKT87w2wNH0SwMfWqNKwTC'),
    -- password: 'lap'
    ('ajlap@wpi.edu', 'alexander', 'lap', '$2b$12$L3htQGEyaAe/B.BBE0n3I.mJ8jesZwWWkEWeliF3rMAi/hqigd5mu'),
    -- password: 'chu'
    ('hvchu@wpi.edu', 'ha', 'chu', '$2b$12$L4GKSPHAwupLFXbHlh.2fOs5gZxkN7o5etiL38lwosRM.C/B3KoOG');

----------------------------------------------------------------
-- Insert Projects
----------------------------------------------------------------
INSERT INTO Project (parent, name, person_in_charge_id, team_email_alias)
VALUES (NULL, 'Awards Ceremony', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Create Flyer', 1, 'wpi.smwms.email.testing@gmail.com'),
       (1, 'Create Poster', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Awards Ceremony 2024', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Project: Under Budget', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Project: Behind Schedule', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Project: On Schedule', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Project: Ahead of Schedule', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Pronounced SV', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Pronounced TV', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'High SV', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'High TV', 1, 'wpi.smwms.email.testing@gmail.com');



----------------------------------------------------------------
-- Insert Tasks with full info (planning, actual dates, costs, status)
----------------------------------------------------------------

-- Project 1: Awards Ceremony (already uses a mix of statuses)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES (1, 'Create supply list', '2025-03-14', '2025-03-15', 2, 'in_progress', '2025-03-14', NULL, 10.00, 9.50, 1),
       (1, 'Buy supplies', '2025-03-15', '2025-03-16', 2, 'in_progress', '2025-03-15', NULL, 150.00, 100.00, 2),
       (1, 'Set up venue', '2025-03-16', '2025-03-18', 3, 'to_do', NULL, NULL, 300.00, 0.00, 3),
       (1, 'Book venue', '2025-03-14', '2025-03-16', 3, 'on_hold', '2025-03-14', NULL, 120.00, 60.00, 4),
       (1, 'Create guest list', '2025-03-12', '2025-03-14', 3, 'to_do', NULL, NULL, 20.00, 0.00, NULL),
       (1, 'Send invitations', '2025-03-14', '2025-03-14', 1, 'to_do', NULL, NULL, 0.00, 0.00, NULL);

-- Project 2: Create Flyer (modified statuses)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES (2, 'Design flyer', '2025-03-08', '2025-03-10', 3, 'done', '2025-03-08', '2025-03-10', 75.00, 80.00),
       (2, 'Get design approved', '2025-03-10', '2025-03-14', 5, 'in_progress', '2025-03-10', NULL, 20.00, 20.00),
       (2, 'Print flyers', '2025-03-14', '2025-03-15', 2, 'to_do', NULL, NULL, 50.00, 55.00);

-- Project 3: Create Poster (modified statuses)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES (3, 'Design poster', '2025-03-09', '2025-03-12', 4, 'done', '2025-03-09', '2025-03-12', 100.00, 95.00),
       (3, 'Get design approved', '2025-03-12', '2025-03-14', 3, 'on_hold', '2025-03-12', NULL, 30.00, 30.00),
       (3, 'Print poster', '2025-03-14', '2025-03-17', 4, 'in_progress', '2025-03-14', NULL, 70.00, 68.00);

-- Project 4: Awards Ceremony 2024 (modified statuses)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
-- Completed tasks
(4, 'Kick-off Meeting', '2025-01-15', '2025-01-15', 1, 'done',
 'Initial planning meeting for HKCC Awards Ceremony 2025', '2025-01-15', '2025-01-15', 80.00, 75.00),
(4, 'Confirm Ceremony Date', '2025-01-16', '2025-01-20', 5, 'done',
 'Set final date for Awards Ceremony: July 24, 2025', '2025-01-16', '2025-01-19', 50.00, 50.00),
(4, 'Select and Confirm Venue', '2025-01-21', '2025-01-31', 11, 'done',
 'Venue secured at Tsuen Wan Plaza Exhibition Hall', '2025-01-21', '2025-02-03', 500.00, 520.00),
(4, 'Generate Honorable Guest List', '2025-01-21', '2025-01-25', 5, 'done',
 'Initial list of potential guests created with 45 names', '2025-01-22', '2025-01-24', 75.00, 80.00),
(4, 'Invite Honorable Guests', '2025-01-26', '2025-02-04', 10, 'done',
 'Formal invitations sent to all potential guests', '2025-01-26', '2025-02-05', 120.00, 115.00),

-- In progress tasks
(4, 'Define Ceremony Theme', '2025-02-05', '2025-02-10', 6, 'in_progress',
 'Working on theme concepts: "Product Safety Carnival" is frontrunner', '2025-02-05', NULL, 250.00, 180.00),
(4, 'Select Stage Production Contractor', '2025-02-07', '2025-02-17', 11, 'in_progress',
 'Evaluating proposals from three vendors including JD Stage Production', '2025-02-08', NULL, 340.00, 120.00),
(4, 'Confirm Guest Attendance', '2025-02-06', '2025-02-15', 10, 'in_progress',
 '18 confirmations received so far, including Mr. TSE Chin-wan', '2025-02-07', NULL, 150.00, 90.00),
(4, 'Select Ceremony Emcee', '2025-02-10', '2025-02-14', 5, 'in_progress',
 'In negotiations with Agnes Leung as primary candidate', '2025-02-11', NULL, 120.00, 400.00),

-- On hold tasks
(4, 'Select Booth Contractor', '2025-02-12', '2025-02-28', 17, 'on_hold',
 'Top choice 美境展銷推廣有限公司 has staffing issue, awaiting resolution', '2025-02-13', NULL, 70.00, 15.00),
(4, 'Obtain Venue Floor Plan', '2025-02-10', '2025-02-15', 6, 'on_hold',
 'Venue management delayed providing updated floor plans', '2025-02-11', NULL, 12.00, 60.00),
(4, 'Select Ceremony Ambassador', '2025-02-15', '2025-02-19', 5, 'on_hold',
 'First-choice ambassador 譚輝智 has scheduling conflict, awaiting response', '2025-02-15', NULL, 25.00, 800.00),

-- To do tasks
(4, 'Create Updated Floor Plan', '2025-02-16', '2025-02-21', 6, 'to_do',
 'Need to create floor plan with modified exhibition layout', NULL, NULL, 25.00, 0.00),
(4, 'Submit Floor Plan to FEHD', '2025-02-22', '2025-02-26', 5, 'to_do',
 'Official submission of floor plan for safety inspection', NULL, NULL, 1000.00, 0.00),
(4, 'Prepare Booth Exhibitors List', '2025-03-01', '2025-03-10', 10, 'to_do',
 'Identify and invite potential exhibitors for 20 booths', NULL, NULL, 1800.00, 0.00),
(4, 'Finalize Exhibitor Numbers', '2025-03-11', '2025-03-20', 10, 'to_do',
 'Confirm final exhibitor count and booth assignments', NULL, NULL, 1500.00, 0.00),
(4, 'Prepare Opening Ceremony Production', '2025-03-15', '2025-03-30', 16, 'to_do',
 'Develop opening animation and ceremony sequence', NULL, NULL, 15000.00, 0.00),
(4, 'Prepare Opening Ceremony Sound Effects', '2025-04-01', '2025-04-10', 10, 'to_do',
 'Create custom sound effects package including balloon reveal', NULL, NULL, 3500.00, 0.00),
(4, 'Prepare Media Invitations', '2025-04-15', '2025-04-25', 11, 'to_do',
 'Draft and design media invitation packages', NULL, NULL, 2000.00, 0.00),
(4, 'Send Media Invitations', '2025-04-26', '2025-05-02', 7, 'to_do',
 'Distribute invitations to 30 media outlets', NULL, NULL, 1200.00, 0.00),
(4, 'Create Marketing Materials', '2025-05-05', '2025-05-20', 16, 'to_do',
 'Design and produce posters, flyers, backdrop, and digital assets', NULL, NULL, 18000.00, 0.00);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (5, 'Kick-off Meeting', '2024-05-10', '2024-05-10', 1, 'done',
     'Initial planning meeting for Marketing Campaign', '2024-05-10', '2024-05-10', 500.00, 450.00),
    (5, 'Market Research', '2024-05-11', '2024-05-20', 10, 'done',
     'Analyze target demographics and competitors', '2024-05-11', '2024-05-18', 3000.00, 2500.00),
    (5, 'Strategy Development', '2024-05-21', '2024-05-30', 10, 'done',
     'Develop comprehensive marketing strategy', '2024-05-19', '2024-05-30', 4500.00, 4000.00),
    (5, 'Content Creation', '2024-05-31', '2024-06-15', 16, 'done',
     'Create marketing content for all channels', '2024-05-31', '2024-06-14', 8000.00, 7200.00),
    (5, 'Website Updates', '2024-06-16', '2024-06-25', 10, 'in_progress',
     'Update company website with new content', '2024-06-16', NULL, 5000.00, 4200.00),
    (5, 'Social Media Campaign', '2024-06-20', '2024-07-05', 16, 'in_progress',
     'Execute social media marketing campaign', '2024-06-20', NULL, 6500.00, 5800.00),
    (5, 'Email Marketing Setup', '2024-06-25', '2024-07-05', 11, 'in_progress',
     'Prepare email templates and mailing lists', '2024-06-25', NULL, 3500.00, 3200.00),
    (5, 'PPC Campaign Configuration', '2024-07-01', '2024-07-10', 10, 'on_hold',
     'Setup and configure pay-per-click campaigns', '2024-07-01', NULL, 7000.00, 0.00),
    (5, 'SEO Optimization', '2024-07-06', '2024-07-20', 15, 'on_hold',
     'Optimize website for search engines', '2024-07-06', NULL, 4500.00, 0.00),
    (5, 'Campaign Analytics Setup', '2024-07-11', '2024-07-15', 5, 'to_do',
     'Configure analytics to track campaign performance', NULL, NULL, 2000.00, 0.00),
    (5, 'Mid-Campaign Review', '2024-07-20', '2024-07-22', 3, 'to_do',
     'Review initial campaign performance', NULL, NULL, 1500.00, 0.00),
    (5, 'Campaign Adjustments', '2024-07-23', '2024-07-30', 8, 'to_do',
     'Make adjustments based on initial performance', NULL, NULL, 3000.00, 0.00),
    (5, 'Final Performance Analysis', '2024-08-01', '2024-08-10', 10, 'to_do',
     'Analyze overall campaign performance', NULL, NULL, 2500.00, 0.00),
    (5, 'Client Presentation', '2024-08-11', '2024-08-15', 5, 'to_do',
     'Present campaign results to client', NULL, NULL, 1000.00, 0.00);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (6, 'Project Charter Creation', '2024-02-01', '2024-02-05', 5, 'done',
     'Draft project charter and objectives', '2024-02-01', '2024-02-08', 1500.00, 1650.00),
    (6, 'Stakeholder Analysis', '2024-02-06', '2024-02-10', 5, 'done',
     'Identify and analyze key stakeholders', '2024-02-09', '2024-02-15', 2000.00, 2100.00),
    (6, 'Requirements Gathering', '2024-02-11', '2024-02-20', 10, 'done',
     'Collect detailed project requirements', '2024-02-16', '2024-02-28', 3500.00, 3800.00),
    (6, 'Project Planning', '2024-02-21', '2024-03-01', 10, 'done',
     'Create comprehensive project plan', '2024-03-01', '2024-03-15', 4000.00, 4200.00),
    (6, 'Resource Allocation', '2024-03-02', '2024-03-08', 7, 'done',
     'Assign resources to project tasks', '2024-03-16', '2024-03-25', 2500.00, 2650.00),
    (6, 'Design Phase', '2024-03-09', '2024-03-23', 15, 'in_progress',
     'System design and architecture', '2024-03-26', NULL, 7500.00, 6800.00),
    (6, 'Development Kickoff', '2024-03-24', '2024-03-30', 7, 'in_progress',
     'Begin development activities', '2024-04-10', NULL, 3000.00, 2700.00),
    (6, 'Backend Development', '2024-03-31', '2024-04-14', 15, 'in_progress',
     'Develop system backend components', '2024-04-20', NULL, 8500.00, 4200.00),
    (6, 'Frontend Development', '2024-04-15', '2024-04-29', 15, 'on_hold',
     'Develop user interface components', '2024-05-05', NULL, 7800.00, 2500.00),
    (6, 'Integration', '2024-04-30', '2024-05-09', 10, 'to_do',
     'Integrate system components', NULL, NULL, 5500.00, 0.00),
    (6, 'Testing Setup', '2024-05-10', '2024-05-16', 7, 'to_do',
     'Prepare testing environment', NULL, NULL, 3200.00, 0.00),
    (6, 'QA Testing', '2024-05-17', '2024-05-31', 15, 'to_do',
     'Perform quality assurance testing', NULL, NULL, 6500.00, 0.00),
    (6, 'User Acceptance Testing', '2024-06-01', '2024-06-10', 10, 'to_do',
     'Conduct user acceptance testing', NULL, NULL, 4800.00, 0.00),
    (6, 'Documentation', '2024-06-11', '2024-06-20', 10, 'to_do',
     'Create system documentation', NULL, NULL, 3500.00, 0.00),
    (6, 'Training Materials', '2024-06-21', '2024-06-30', 10, 'to_do',
     'Develop user training materials', NULL, NULL, 2800.00, 0.00),
    (6, 'Deployment Planning', '2024-07-01', '2024-07-07', 7, 'to_do',
     'Prepare for system deployment', NULL, NULL, 2000.00, 0.00),
    (6, 'Go-Live', '2024-07-08', '2024-07-15', 8, 'to_do',
     'System deployment to production', NULL, NULL, 4500.00, 0.00);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES
-- High-cost tasks significantly behind schedule (major negative SV%)
(7, 'Create supply list', '2025-03-04', '2025-03-05', 2, 'done', '2025-07-14', '2025-07-15', 3000.00, 3000.00, 1),
(7, 'Buy supplies', '2025-03-02', '2025-03-03', 2, 'done', '2025-07-17', '2025-07-18', 5000.00, 5000.00, 2),
(7, 'Set up venue', '2025-03-16', '2025-03-18', 3, 'done', '2025-07-27', '2025-07-29', 10000.00, 1000.00, 3),
-- Low-cost tasks slightly ahead of schedule (minor positive SV%)
(7, 'Book venue', '2025-03-14', '2025-03-16', 3, 'done', '2025-03-14', '2025-03-15', 120.00, 120.00, 4),
(7, 'Create guest list', '2025-03-12', '2025-03-14', 3, 'done', '2025-03-12', '2025-03-13', 20.00, 20.00, NULL),
(7, 'Send invitations', '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 10.00, 10.00, NULL);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES
-- Tasks with major time delays but modest costs
(8, 'Create supply list', '2025-03-01', '2025-03-03', 2, 'done', '2025-07-14', '2025-07-16', 10.00, 5.00, 1),
(8, 'Buy supplies', '2025-03-04', '2025-03-06', 2, 'done', '2025-07-20', '2025-07-22', 150.00, 0.00, 2),
(8, 'Set up venue', '2025-03-06', '2025-03-09', 3, 'done', '2025-07-26', '2025-07-27', 300.00, 0.00, 3),
-- High-cost task with minimal time delay
(8, 'Book venue', '2025-03-13', '2025-03-16', 3, 'done', '2025-03-14', '2025-03-16', 12000.00, 12000.00, 4),
(8, 'Create guest list', '2025-03-12', '2025-03-14', 3, 'done', '2025-03-12', '2025-03-14', 200.00, 200.00, NULL),
(8, 'Send invitations', '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 8000.00, 8000.00, NULL);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES
    (9, 'Market Research', '2025-02-01', '2025-02-28', 28, 'done', '2025-02-01', '2025-02-12', 5000.00, 5000.00, 1),
    (9, 'Product Design', '2025-03-01', '2025-03-15', 15, 'done', '2025-02-14', '2025-02-25', 8000.00, 8000.00, 2),
    (9, 'Prototype Development', '2025-03-16', '2025-04-05', 21, 'done', '2025-02-26', '2025-03-10', 12000.00, 12000.00, 3);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES
    (10, 'Task 1', '2025-01-01', '2025-01-15', 15, 'done', '2025-01-05', '2025-01-12', 3000.00, 3000.00, 1),
    (10, 'Task 2', '2025-01-16', '2025-01-31', 16, 'done', '2025-01-20', '2025-01-28', 3000.00, 3000.00, 2),
    (10, 'Task 3', '2025-02-01', '2025-02-20', 20, 'done', '2025-02-01', '2025-03-10', 4000.00, 4000.00, 3);


----------------------------------------------------------------
-- Insert Dependency Information (unchanged)
----------------------------------------------------------------

INSERT INTO Task_Depends_On (task_id, project_id, depends_task_id, depends_project_id)
VALUES
    -- Dependencies for Projects 1–3
    (3, 1, 4, 1),
    (3, 1, 2, 1),
    (2, 1, 1, 1),
    (6, 1, 5, 1),

    (3, 2, 2, 2),
    (2, 2, 1, 2),

    (3, 3, 2, 3),
    (2, 3, 1, 3);

-- Dependencies for Awards Ceremony 2024 (Project 4)
INSERT INTO Task_Depends_On (task_id, project_id, depends_task_id, depends_project_id)
VALUES
    -- Venue and Contractor Selection Dependencies
    (5, 4, 4, 4),   -- Stage Production Contractor depends on Venue Selection
    (6, 4, 4, 4),   -- Booth Contractor depends on Venue Selection

    -- Exhibitor and Floor Plan Dependencies
    (7, 4, 5, 4),   -- Prepare Booth Exhibitors depends on Booth Contractor selection
    (8, 4, 7, 4),   -- Finalize Exhibitor Numbers depends on preparing Exhibitors List
    (9, 4, 4, 4),   -- Obtain Venue Floor Plan depends on Venue Selection
    (10, 4, 9, 4),  -- Create Updated Floor Plan depends on Obtaining Floor Plan
    (11, 4, 10, 4), -- Submit Floor Plan to FEHD depends on Creating Floor Plan

    -- Opening Ceremony Dependencies
    (12, 4, 5, 4),  -- Opening Ceremony Production depends on Stage Production Contractor
    (13, 4, 12, 4), -- Sound Effects depends on Opening Ceremony Production

    -- Artist/Ambassador and Emcee Dependencies
    (14, 4, 12, 4), -- Artist/Ambassador selection after Opening Ceremony planning
    (15, 4, 14, 4), -- Emcee selection after Artist selection

    -- Honorable Guests and Media Invitations Dependencies
    (16, 4, 15, 4), -- Generate Honorable Guest List after Emcee confirmation
    (17, 4, 16, 4), -- Invite Honorable Guests depends on Guest List
    (18, 4, 17, 4), -- Confirm Guest Attendance depends on Invitations
    (19, 4, 18, 4), -- Prepare Media Invitations depends on Guest Confirmations
    (20, 4, 19, 4), -- Send Media Invitations depends on Invitation Preparation

    -- Marketing Materials Dependencies
    (21, 4, 19, 4); -- Create Marketing Materials depends on Media Invitation Preparation
