-- Define Variables
DO $$
DECLARE
    pid1 INT := 1;
    pid2 INT := 2;
    pid3 INT := 3;
    pid4 INT := 4;
    pid5 INT := 5;
    pid6 INT := 6;
    pid7 INT := 7;
    pid8 INT := 8;
    pid9 INT := 9;
    pid10 INT := 10;
    pid13 INT := 13;
BEGIN

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
       (pid1, 'Create Poster', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Awards Ceremony 2024', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Project: Under Budget', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Project: Behind Schedule', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Project: On Schedule', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Project: Ahead of Schedule', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Pronounced SV', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Pronounced TV', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'High SV', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'High TV', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Awards Ceremony 2024 (DONE)', 1, 'wpi.smwms.email.testing@gmail.com');



----------------------------------------------------------------
-- Insert Tasks with full info (planning, actual dates, costs, status)
----------------------------------------------------------------

-- Project 1: Awards Ceremony (already uses a mix of statuses)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES (pid1, 'Create supply list', '2025-03-14', '2025-03-15', 2, 'in_progress', '2025-03-14', NULL, 10.00, 9.50, 1),
       (pid1, 'Buy supplies', '2025-03-15', '2025-03-16', 2, 'in_progress', '2025-03-15', NULL, 150.00, 100.00, 2),
       (pid1, 'Set up venue', '2025-03-16', '2025-03-18', 3, 'to_do', NULL, NULL, 300.00, 0.00, 3),
       (pid1, 'Book venue', '2025-03-14', '2025-03-16', 3, 'on_hold', '2025-03-14', NULL, 120.00, 60.00, 4),
       (pid1, 'Create guest list', '2025-03-12', '2025-03-14', 3, 'to_do', NULL, NULL, 20.00, 0.00, NULL),
       (pid1, 'Send invitations', '2025-03-14', '2025-03-14', 1, 'to_do', NULL, NULL, 0.00, 0.00, NULL);

-- Project 2: Create Flyer (modified statuses)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES (pid2, 'Design flyer', '2025-03-08', '2025-03-10', 3, 'done', '2025-03-08', '2025-03-10', 75.00, 80.00),
       (pid2, 'Get design approved', '2025-03-10', '2025-03-14', 5, 'in_progress', '2025-03-10', NULL, 20.00, 20.00),
       (pid2, 'Print flyers', '2025-03-14', '2025-03-15', 2, 'to_do', NULL, NULL, 50.00, 55.00);

-- Project 3: Create Poster (modified statuses)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES (pid3, 'Design poster', '2025-03-09', '2025-03-12', 4, 'done', '2025-03-09', '2025-03-12', 100.00, 95.00),
       (pid3, 'Get design approved', '2025-03-12', '2025-03-14', 3, 'on_hold', '2025-03-12', NULL, 30.00, 30.00),
       (pid3, 'Print poster', '2025-03-14', '2025-03-17', 4, 'in_progress', '2025-03-14', NULL, 70.00, 68.00);

-- Project 4: Awards Ceremony 2024 (modified statuses)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
-- Completed tasks
(pid4, 'Kick-off Meeting', '2025-01-15', '2025-01-15', 1, 'done',
 'Initial planning meeting for HKCC Awards Ceremony 2025', '2025-01-15', '2025-01-15', 80.00, 200.00),
(pid4, 'Confirm Ceremony Date', '2025-01-16', '2025-01-20', 5, 'done',
 'Set final date for Awards Ceremony: July 24, 2025', '2025-01-16', '2025-01-19', 50.00, 250.00),
(pid4, 'Select and Confirm Venue', '2025-01-21', '2025-01-31', 11, 'done',
 'Venue secured at Tsuen Wan Plaza Exhibition Hall', '2025-01-21', '2025-02-03', 350.00, 300.00),
(pid4, 'Generate Honorable Guest List', '2025-01-21', '2025-01-25', 5, 'done',
 'Initial list of potential guests created with 45 names', '2025-01-22', '2025-01-24', 75.00, 300.00),
(pid4, 'Invite Honorable Guests', '2025-01-26', '2025-02-04', 10, 'done',
 'Formal invitations sent to all potential guests', '2025-01-26', '2025-02-05', 120.00, 150.00),

-- In progress tasks
(pid4, 'Define Ceremony Theme', '2025-02-05', '2025-02-10', 6, 'in_progress',
 'Working on theme concepts: "Product Safety Carnival" is frontrunner', '2025-02-05', NULL, 250.00, 180.00),
(pid4, 'Select Stage Production Contractor', '2025-02-07', '2025-02-17', 11, 'in_progress',
 'Evaluating proposals from three vendors including JD Stage Production', '2025-02-08', NULL, 340.00, 120.00),
(pid4, 'Confirm Guest Attendance', '2025-02-06', '2025-02-15', 10, 'in_progress',
 '18 confirmations received so far, including Mr. TSE Chin-wan', '2025-02-07', NULL, 150.00, 90.00),
(pid4, 'Select Ceremony Emcee', '2025-02-10', '2025-02-14', 5, 'in_progress',
 'In negotiations with Agnes Leung as primary candidate', '2025-02-11', NULL, 120.00, 400.00),

-- On hold tasks
(pid4, 'Select Booth Contractor', '2025-02-12', '2025-02-28', 17, 'on_hold',
 'Top choice 美境展銷推廣有限公司 has staffing issue, awaiting resolution', '2025-02-13', NULL, 70.00, 15.00),
(pid4, 'Obtain Venue Floor Plan', '2025-02-10', '2025-02-15', 6, 'on_hold',
 'Venue management delayed providing updated floor plans', '2025-02-11', NULL, 12.00, 60.00),
(pid4, 'Select Ceremony Ambassador', '2025-02-15', '2025-02-19', 5, 'on_hold',
 'First-choice ambassador 譚輝智 has scheduling conflict, awaiting response', '2025-02-15', NULL, 25.00, 800.00),

-- To do tasks
(pid4, 'Create Updated Floor Plan', '2025-02-16', '2025-02-21', 6, 'to_do',
 'Need to create floor plan with modified exhibition layout', NULL, NULL, 25.00, 0.00),
(pid4, 'Submit Floor Plan to FEHD', '2025-02-22', '2025-02-26', 5, 'to_do',
 'Official submission of floor plan for safety inspection', NULL, NULL, 300.00, 0.00),
(pid4, 'Prepare Booth Exhibitors List', '2025-03-01', '2025-03-10', 10, 'to_do',
 'Identify and invite potential exhibitors for 20 booths', NULL, NULL, 650.00, 0.00),
(pid4, 'Finalize Exhibitor Numbers', '2025-03-11', '2025-03-20', 10, 'to_do',
 'Confirm final exhibitor count and booth assignments', NULL, NULL, 500.00, 0.00),
(pid4, 'Prepare Opening Ceremony Production', '2025-03-15', '2025-03-30', 16, 'to_do',
 'Develop opening animation and ceremony sequence', NULL, NULL, 400.00, 0.00),
(pid4, 'Prepare Opening Ceremony Sound Effects', '2025-04-01', '2025-04-10', 10, 'to_do',
 'Create custom sound effects package including balloon reveal', NULL, NULL, 500.00, 0.00),
(pid4, 'Prepare Media Invitations', '2025-04-15', '2025-04-25', 11, 'to_do',
 'Draft and design media invitation packages', NULL, NULL, 200.00, 0.00),
(pid4, 'Send Media Invitations', '2025-04-26', '2025-05-02', 7, 'to_do',
 'Distribute invitations to 30 media outlets', NULL, NULL, 420.00, 0.00),
(pid4, 'Create Marketing Materials', '2025-05-05', '2025-05-20', 16, 'to_do',
 'Design and produce posters, flyers, backdrop, and digital assets', NULL, NULL, 400.00, 0.00);

-- Awards Ceremony 2024 (DONE)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
-- Completed tasks
(pid13, 'Kick-off Meeting', '2024-01-15', '2024-01-15', 1, 'done',
 'Initial planning meeting for HKCC Awards Ceremony 2024', '2024-01-15', '2024-01-15', 80.00, 75.00),
(pid13, 'Confirm Ceremony Date', '2024-01-16', '2024-01-20', 5, 'done',
 'Set final date for Awards Ceremony: July 24, 2024', '2024-01-16', '2024-01-19', 50.00, 50.00),
(pid13, 'Select and Confirm Venue', '2024-01-21', '2024-01-31', 11, 'done',
 'Venue secured at Tsuen Wan Plaza Exhibition Hall', '2024-01-21', '2024-02-03', 500.00, 520.00),
(pid13, 'Generate Honorable Guest List', '2024-01-21', '2024-01-25', 5, 'done',
 'Initial list of potential guests created with 45 names', '2024-01-22', '2024-01-24', 75.00, 80.00),
(pid13, 'Invite Honorable Guests', '2024-01-26', '2024-02-04', 10, 'done',
 'Formal invitations sent to all potential guests', '2024-01-26', '2024-02-05', 120.00, 115.00),
(pid13, 'Define Ceremony Theme', '2024-02-05', '2024-02-10', 6, 'done',
 'Working on theme concepts: "Product Safety Carnival" is frontrunner', '2024-02-05', '2024-02-10', 250.00, 180.00),
(pid13, 'Select Stage Production Contractor', '2024-02-07', '2024-02-17', 11, 'done',
 'Evaluating proposals from three vendors including JD Stage Production', '2024-02-08', '2024-02-17', 340.00, 120.00),
(pid13, 'Confirm Guest Attendance', '2024-02-06', '2024-02-15', 10, 'done',
 '18 confirmations received so far, including Mr. TSE Chin-wan', '2024-02-07', '2024-02-15', 150.00, 90.00),
(pid13, 'Select Ceremony Emcee', '2024-02-10', '2024-02-14', 5, 'done',
 'In negotiations with Agnes Leung as primary candidate', '2024-02-11', '2024-02-14', 120.00, 400.00),
(pid13, 'Select Booth Contractor', '2024-02-12', '2024-02-28', 17, 'done',
 'Top choice 美境展銷推廣有限公司 has staffing issue, awaiting resolution', '2024-02-13', '2024-02-28', 70.00, 15.00),
(pid13, 'Obtain Venue Floor Plan', '2024-02-10', '2024-02-15', 6, 'done',
 'Venue management delayed providing updated floor plans', '2024-02-11', '2024-02-15', 12.00, 60.00),
(pid13, 'Select Ceremony Ambassador', '2024-02-15', '2024-02-19', 5, 'done',
 'First-choice ambassador 譚輝智 has scheduling conflict, awaiting response', '2024-02-15', '2024-02-19', 25.00, 800.00),
(pid13, 'Create Updated Floor Plan', '2024-02-16', '2024-02-21', 6, 'done',
 'Need to create floor plan with modified exhibition layout', '2024-02-16', '2024-02-21', 25.00, 25.00),
(pid13, 'Submit Floor Plan to FEHD', '2024-02-22', '2024-02-26', 5, 'done',
 'Official submission of floor plan for safety inspection', '2024-02-22', '2024-02-26', 1000.00, 1000.00),
(pid13, 'Prepare Booth Exhibitors List', '2024-03-01', '2024-03-10', 10, 'done',
 'Identify and invite potential exhibitors for 20 booths', '2024-03-01', '2024-03-10', 1800.00, 1800.00),
(pid13, 'Finalize Exhibitor Numbers', '2024-03-11', '2024-03-20', 10, 'done',
 'Confirm final exhibitor count and booth assignments', '2024-03-11', '2024-03-20', 1500.00, 1500.00),
(pid13, 'Prepare Opening Ceremony Production', '2024-03-15', '2024-03-30', 16, 'done',
 'Develop opening animation and ceremony sequence', '2024-03-15', '2024-03-30', 15000.00, 15000.00),
(pid13, 'Prepare Opening Ceremony Sound Effects', '2024-04-01', '2024-04-10', 10, 'done',
 'Create custom sound effects package including balloon reveal', '2024-04-01', '2024-04-10', 3500.00, 3500.00),
(pid13, 'Prepare Media Invitations', '2024-04-15', '2024-04-25', 11, 'done',
 'Draft and design media invitation packages', '2024-04-15', '2024-04-25', 2000.00, 2000.00),
(pid13, 'Send Media Invitations', '2024-04-26', '2024-05-02', 7, 'done',
 'Distribute invitations to 30 media outlets', '2024-04-26', '2024-05-02', 1200.00, 1200.00),
(pid13, 'Create Marketing Materials', '2024-05-05', '2024-05-20', 16, 'done',
 'Design and produce posters, flyers, backdrop, and digital assets', '2024-05-05', '2024-05-20', 18000.00, 18000.00);

-- Project 5: Project: Under Budget (modified dates and costs)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (pid5, 'Kick-off Meeting', '2025-02-10', '2025-02-10', 1, 'done',
     'Initial planning meeting for Marketing Campaign', '2025-02-10', '2025-02-10', 500.00, 450.00),
    (pid5, 'Market Research', '2025-02-11', '2025-02-20', 10, 'done',
     'Analyze target demographics and competitors', '2025-02-11', '2025-02-18', 3000.00, 2500.00),
    (pid5, 'Strategy Development', '2025-02-21', '2025-03-02', 10, 'done',
     'Develop comprehensive marketing strategy', '2025-02-19', '2025-03-02', 4500.00, 4000.00),
    (pid5, 'Content Creation', '2025-03-03', '2025-03-15', 13, 'done',
     'Create marketing content for all channels', '2025-03-03', '2025-03-14', 8000.00, 7200.00),
    (pid5, 'Website Updates', '2025-03-16', '2025-03-25', 10, 'in_progress',
     'Update company website with new content', '2025-03-16', NULL, 5000.00, 4200.00),
    (pid5, 'Social Media Campaign', '2025-03-20', '2025-04-05', 16, 'in_progress',
     'Execute social media marketing campaign', '2025-03-20', NULL, 6500.00, 5800.00),
    (pid5, 'Email Marketing Setup', '2025-03-25', '2025-04-05', 11, 'in_progress',
     'Prepare email templates and mailing lists', '2025-03-25', NULL, 3500.00, 3200.00),
    (pid5, 'PPC Campaign Configuration', '2025-04-01', '2025-04-10', 10, 'on_hold',
     'Setup and configure pay-per-click campaigns', '2025-04-01', NULL, 7000.00, 0.00),
    (pid5, 'SEO Optimization', '2025-04-06', '2025-04-20', 15, 'on_hold',
     'Optimize website for search engines', '2025-04-06', NULL, 4500.00, 0.00),
    (pid5, 'Campaign Analytics Setup', '2025-04-11', '2025-04-15', 5, 'to_do',
     'Configure analytics to track campaign performance', NULL, NULL, 2000.00, 0.00),
    (pid5, 'Mid-Campaign Review', '2025-04-20', '2025-04-22', 3, 'to_do',
     'Review initial campaign performance', NULL, NULL, 1500.00, 0.00),
    (pid5, 'Campaign Adjustments', '2025-04-23', '2025-04-30', 8, 'to_do',
     'Make adjustments based on initial performance', NULL, NULL, 3000.00, 0.00),
    (pid5, 'Final Performance Analysis', '2025-05-01', '2025-05-10', 10, 'to_do',
     'Analyze overall campaign performance', NULL, NULL, 2500.00, 0.00),
    (pid5, 'Client Presentation', '2025-05-11', '2025-05-15', 5, 'to_do',
     'Present campaign results to client', NULL, NULL, 1000.00, 0.00);

-- Project 6: Project: Behind Schedule (modified dates and costs)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (pid6, 'Project Charter Creation', '2025-02-01', '2025-02-05', 5, 'done',
     'Draft project charter and objectives', '2025-02-01', '2025-02-08', 1500.00, 1650.00),
    (pid6, 'Stakeholder Analysis', '2025-02-06', '2025-02-10', 5, 'done',
     'Identify and analyze key stakeholders', '2025-02-09', '2025-02-15', 2000.00, 2100.00),
    (pid6, 'Requirements Gathering', '2025-02-11', '2025-02-20', 10, 'done',
     'Collect detailed project requirements', '2025-02-16', '2025-02-28', 3500.00, 3800.00),
    (pid6, 'Project Planning', '2025-02-21', '2025-03-01', 10, 'done',
     'Create comprehensive project plan', '2025-03-01', '2025-03-15', 4000.00, 4200.00),
    (pid6, 'Resource Allocation', '2025-03-02', '2025-03-08', 7, 'done',
     'Assign resources to project tasks', '2025-03-16', '2025-03-25', 2500.00, 2650.00),
    (pid6, 'Design Phase', '2025-03-09', '2025-03-23', 15, 'in_progress',
     'System design and architecture', '2025-03-26', NULL, 7500.00, 6800.00),
    (pid6, 'Development Kickoff', '2025-03-24', '2025-03-30', 7, 'in_progress',
     'Begin development activities', '2025-04-10', NULL, 3000.00, 2700.00),
    (pid6, 'Backend Development', '2025-03-31', '2025-04-14', 15, 'in_progress',
     'Develop system backend components', '2025-04-20', NULL, 8500.00, 4200.00),
    (pid6, 'Frontend Development', '2025-04-15', '2025-04-29', 15, 'on_hold',
     'Develop user interface components', '2025-05-05', NULL, 7800.00, 2500.00),
    (pid6, 'Integration', '2025-04-30', '2025-05-09', 10, 'to_do',
     'Integrate system components', NULL, NULL, 5500.00, 0.00),
    (pid6, 'Testing Setup', '2025-05-10', '2025-05-16', 7, 'to_do',
     'Prepare testing environment', NULL, NULL, 3200.00, 0.00),
    (pid6, 'QA Testing', '2025-05-17', '2025-05-31', 15, 'to_do',
     'Perform quality assurance testing', NULL, NULL, 6500.00, 0.00),
    (pid6, 'User Acceptance Testing', '2025-06-01', '2025-06-10', 10, 'to_do',
     'Conduct user acceptance testing', NULL, NULL, 4800.00, 0.00),
    (pid6, 'Documentation', '2025-06-11', '2025-06-20', 10, 'to_do',
     'Create system documentation', NULL, NULL, 3500.00, 0.00),
    (pid6, 'Training Materials', '2025-06-21', '2025-06-30', 10, 'to_do',
     'Develop user training materials', NULL, NULL, 2800.00, 0.00),
    (pid6, 'Deployment Planning', '2025-07-01', '2025-07-07', 7, 'to_do',
     'Prepare for system deployment', NULL, NULL, 2000.00, 0.00),
    (pid6, 'Go-Live', '2025-07-08', '2025-07-15', 8, 'to_do',
     'System deployment to production', NULL, NULL, 4500.00, 0.00);

-- Project 7: Project: On Schedule (modified dates and costs)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES
    (pid7, 'Create supply list', '2025-02-25', '2025-02-26', 2, 'done', '2025-02-25', '2025-02-26', 3000.00, 3000.00, 1),
    (pid7, 'Buy supplies', '2025-02-27', '2025-02-28', 2, 'done', '2025-02-27', '2025-02-28', 5000.00, 5000.00, 2),
    (pid7, 'Set up venue', '2025-03-01', '2025-03-03', 3, 'done', '2025-03-01', '2025-03-03', 10000.00, 1000.00, 3),
    (pid7, 'Book venue', '2025-03-04', '2025-03-06', 3, 'in_progress', '2025-03-04', NULL, 120.00, 120.00, 4),
    (pid7, 'Create guest list', '2025-03-07', '2025-03-09', 3, 'to_do', NULL, NULL, 20.00, 0.00, NULL),
    (pid7, 'Send invitations', '2025-03-10', '2025-03-10', 1, 'to_do', NULL, NULL, 10.00, 0.00, NULL);

-- Project 8: Project: Ahead of Schedule (modified dates and costs)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES
    (pid8, 'Create supply list', '2025-02-20', '2025-02-22', 3, 'done', '2025-02-20', '2025-02-21', 10.00, 5.00, 1),
    (pid8, 'Buy supplies', '2025-02-23', '2025-02-25', 3, 'done', '2025-02-23', '2025-02-24', 150.00, 0.00, 2),
    (pid8, 'Set up venue', '2025-02-26', '2025-02-28', 3, 'done', '2025-02-26', '2025-02-27', 300.00, 0.00, 3),
    (pid8, 'Book venue', '2025-03-01', '2025-03-03', 3, 'done', '2025-03-01', '2025-03-02', 12000.00, 12000.00, 4),
    (pid8, 'Create guest list', '2025-03-04', '2025-03-06', 3, 'in_progress', '2025-03-04', NULL, 200.00, 200.00, NULL),
    (pid8, 'Send invitations', '2025-03-07', '2025-03-07', 1, 'to_do', NULL, NULL, 8000.00, 0.00, NULL);

-- Project 9: Pronounced SV (modified dates and costs)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES
    (pid9, 'Market Research', '2025-02-01', '2025-02-28', 28, 'done', '2025-02-01', '2025-02-12', 5000.00, 5000.00, 1),
    (pid9, 'Product Design', '2025-03-01', '2025-03-15', 15, 'done', '2025-02-14', '2025-02-25', 8000.00, 8000.00, 2),
    (pid9, 'Prototype Development', '2025-03-16', '2025-04-05', 21, 'done', '2025-02-26', '2025-03-10', 12000.00, 12000.00, 3);

-- Project 10: Pronounced TV (modified dates and costs)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES
    (pid10, 'Task 1', '2025-01-01', '2025-01-15', 15, 'done', '2025-01-05', '2025-01-12', 3000.00, 3000.00, 1),
    (pid10, 'Task 2', '2025-01-16', '2025-01-31', 16, 'done', '2025-01-20', '2025-01-28', 3000.00, 3000.00, 2),
    (pid10, 'Task 3', '2025-02-01', '2025-02-20', 20, 'done', '2025-02-01', '2025-03-04', 4000.00, 4000.00, 3);


----------------------------------------------------------------
-- Insert Dependency Information (unchanged)
----------------------------------------------------------------

INSERT INTO Task_Depends_On (task_id, project_id, depends_task_id, depends_project_id)
VALUES
    -- Dependencies for Projects 1–3
    (3, pid1, 4, pid1),
    (3, pid1, 2, pid1),
    (2, pid1, 1, pid1),
    (6, pid1, 5, pid1),

    (3, pid2, 2, pid2),
    (2, pid2, 1, pid2),

    (3, pid3, 2, pid3),
    (2, pid3, 1, pid3);

-- Dependencies for Awards Ceremony 2024 (Project 4)
INSERT INTO Task_Depends_On (task_id, project_id, depends_task_id, depends_project_id)
VALUES
    -- Venue and Contractor Selection Dependencies
    (5, pid4, 4, pid4),   -- Stage Production Contractor depends on Venue Selection
    (6, pid4, 4, pid4),   -- Booth Contractor depends on Venue Selection

    -- Exhibitor and Floor Plan Dependencies
    (7, pid4, 5, pid4),   -- Prepare Booth Exhibitors depends on Booth Contractor selection
    (8, pid4, 7, pid4),   -- Finalize Exhibitor Numbers depends on preparing Exhibitors List
    (9, pid4, 4, pid4),   -- Obtain Venue Floor Plan depends on Venue Selection
    (10, pid4, 9, pid4),  -- Create Updated Floor Plan depends on Obtaining Floor Plan
    (11, pid4, 10, pid4), -- Submit Floor Plan to FEHD depends on Creating Floor Plan

    -- Opening Ceremony Dependencies
    (12, pid4, 5, pid4),  -- Opening Ceremony Production depends on Stage Production Contractor
    (13, pid4, 12, pid4), -- Sound Effects depends on Opening Ceremony Production

    -- Artist/Ambassador and Emcee Dependencies
    (14, pid4, 12, pid4), -- Artist/Ambassador selection after Opening Ceremony planning
    (15, pid4, 14, pid4), -- Emcee selection after Artist selection

    -- Honorable Guests and Media Invitations Dependencies
    (16, pid4, 15, pid4), -- Generate Honorable Guest List after Emcee confirmation
    (17, pid4, 16, pid4), -- Invite Honorable Guests depends on Guest List
    (18, pid4, 17, pid4), -- Confirm Guest Attendance depends on Invitations
    (19, pid4, 18, pid4), -- Prepare Media Invitations depends on Guest Confirmations
    (20, pid4, 19, pid4), -- Send Media Invitations depends on Invitation Preparation

    -- Marketing Materials Dependencies
    (21, pid4, 19, pid4); -- Create Marketing Materials depends on Media Invitation Preparation

END $$;