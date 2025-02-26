-- Reset Sequences
ALTER SEQUENCE project_id_seq RESTART WITH 1;

----------------------------------------------------------------
-- Create Accounts
----------------------------------------------------------------
INSERT INTO Account
(email, first_name, last_name, password_hash)
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
       (NULL, 'Morning Routine', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Morning Routine of Jason', 1, 'wpi.smwms.email.testing@gmail.com'),
       (NULL, 'Awards Ceremony 2024', 1, 'wpi.smwms.email.testing@gmail.com');

INSERT INTO Project (parent, name, person_in_charge_id, team_email_alias)
VALUES
    (NULL, 'Project: Under Budget', 1, 'wpi.smwms.email.testing@gmail.com'),
    (NULL, 'Project: On Budget', 1, 'wpi.smwms.email.testing@gmail.com'),
    (NULL, 'Project: Over Budget', 1, 'wpi.smwms.email.testing@gmail.com'),
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

-- Project 4: Morning Routine (modified statuses)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES (4, 'Wake up', '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 0.00, 0.00),
       (4, 'Brush teeth', '2025-03-14', '2025-03-14', 1, 'in_progress', '2025-03-14', NULL, 1.00, 1.00),
       (4, 'Wash face', '2025-03-14', '2025-03-14', 1, 'on_hold', '2025-03-14', NULL, 0.50, 0.50),
       (4, 'Eat breakfast', '2025-03-14', '2025-03-14', 1, 'to_do', NULL, NULL, 5.00, 5.50);

-- Project 5: Morning Routine of Jason (modified statuses)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES (5, 'Wake up', '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 0.00, 0.00),
       (5, 'Get off bed', '2025-03-14', '2025-03-14', 1, 'in_progress', '2025-03-14', NULL, 0.00, 0.00),
       (5, 'Brush teeth', '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 1.00, 1.00),
       (5, 'Scroll Phone', '2025-03-14', '2025-03-14', 1, 'to_do', NULL, NULL, 0.00, 0.00),
       (5, '...', '2025-03-14', '2025-03-14', 1, 'on_hold', '2025-03-14', NULL, 0.00, 0.00);

-- Project 6: Awards Ceremony 2024 (modified statuses)
INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
-- Completed tasks
(6, 'Kick-off Meeting', '2025-01-15', '2025-01-15', 1, 'done',
 'Initial planning meeting for HKCC Awards Ceremony 2025', '2025-01-15', '2025-01-15', 80.00, 75.00),
(6, 'Confirm Ceremony Date', '2025-01-16', '2025-01-20', 5, 'done',
 'Set final date for Awards Ceremony: July 24, 2025', '2025-01-16', '2025-01-19', 50.00, 50.00),
(6, 'Select and Confirm Venue', '2025-01-21', '2025-01-31', 11, 'done',
 'Venue secured at Tsuen Wan Plaza Exhibition Hall', '2025-01-21', '2025-02-03', 500.00, 520.00),
(6, 'Generate Honorable Guest List', '2025-01-21', '2025-01-25', 5, 'done',
 'Initial list of potential guests created with 45 names', '2025-01-22', '2025-01-24', 75.00, 80.00),
(6, 'Invite Honorable Guests', '2025-01-26', '2025-02-04', 10, 'done',
 'Formal invitations sent to all potential guests', '2025-01-26', '2025-02-05', 120.00, 115.00),

-- In progress tasks
(6, 'Define Ceremony Theme', '2025-02-05', '2025-02-10', 6, 'in_progress',
 'Working on theme concepts: "Product Safety Carnival" is frontrunner', '2025-02-05', NULL, 250.00, 180.00),
(6, 'Select Stage Production Contractor', '2025-02-07', '2025-02-17', 11, 'in_progress',
 'Evaluating proposals from three vendors including JD Stage Production', '2025-02-08', NULL, 340.00, 120.00),
(6, 'Confirm Guest Attendance', '2025-02-06', '2025-02-15', 10, 'in_progress',
 '18 confirmations received so far, including Mr. TSE Chin-wan', '2025-02-07', NULL, 150.00, 90.00),
(6, 'Select Ceremony Emcee', '2025-02-10', '2025-02-14', 5, 'in_progress',
 'In negotiations with Agnes Leung as primary candidate', '2025-02-11', NULL, 120.00, 400.00),

-- On hold tasks
(6, 'Select Booth Contractor', '2025-02-12', '2025-02-28', 17, 'on_hold',
 'Top choice 美境展銷推廣有限公司 has staffing issue, awaiting resolution', '2025-02-13', NULL, 70.00, 15.00),
(6, 'Obtain Venue Floor Plan', '2025-02-10', '2025-02-15', 6, 'on_hold',
 'Venue management delayed providing updated floor plans', '2025-02-11', NULL, 12.00, 60.00),
(6, 'Select Ceremony Ambassador', '2025-02-15', '2025-02-19', 5, 'on_hold',
 'First-choice ambassador 譚輝智 has scheduling conflict, awaiting response', '2025-02-15', NULL, 25.00, 800.00),

-- To do tasks
(6, 'Create Updated Floor Plan', '2025-02-16', '2025-02-21', 6, 'to_do',
 'Need to create floor plan with modified exhibition layout', NULL, NULL, 25.00, 0.00),
(6, 'Submit Floor Plan to FEHD', '2025-02-22', '2025-02-26', 5, 'to_do',
 'Official submission of floor plan for safety inspection', NULL, NULL, 1000.00, 0.00),
(6, 'Prepare Booth Exhibitors List', '2025-03-01', '2025-03-10', 10, 'to_do',
 'Identify and invite potential exhibitors for 20 booths', NULL, NULL, 1800.00, 0.00),
(6, 'Finalize Exhibitor Numbers', '2025-03-11', '2025-03-20', 10, 'to_do',
 'Confirm final exhibitor count and booth assignments', NULL, NULL, 1500.00, 0.00),
(6, 'Prepare Opening Ceremony Production', '2025-03-15', '2025-03-30', 16, 'to_do',
 'Develop opening animation and ceremony sequence', NULL, NULL, 15000.00, 0.00),
(6, 'Prepare Opening Ceremony Sound Effects', '2025-04-01', '2025-04-10', 10, 'to_do',
 'Create custom sound effects package including balloon reveal', NULL, NULL, 3500.00, 0.00),
(6, 'Prepare Media Invitations', '2025-04-15', '2025-04-25', 11, 'to_do',
 'Draft and design media invitation packages', NULL, NULL, 2000.00, 0.00),
(6, 'Send Media Invitations', '2025-04-26', '2025-05-02', 7, 'to_do',
 'Distribute invitations to 30 media outlets', NULL, NULL, 1200.00, 0.00),
(6, 'Create Marketing Materials', '2025-05-05', '2025-05-20', 16, 'to_do',
 'Design and produce posters, flyers, backdrop, and digital assets', NULL, NULL, 18000.00, 0.00);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (7, 'Kick-off Meeting', '2024-05-10', '2024-05-10', 1, 'done',
     'Initial planning meeting for Marketing Campaign', '2024-05-10', '2024-05-10', 500.00, 450.00),
    (7, 'Market Research', '2024-05-11', '2024-05-20', 10, 'done',
     'Analyze target demographics and competitors', '2024-05-11', '2024-05-18', 3000.00, 2500.00),
    (7, 'Strategy Development', '2024-05-21', '2024-05-30', 10, 'done',
     'Develop comprehensive marketing strategy', '2024-05-19', '2024-05-30', 4500.00, 4000.00),
    (7, 'Content Creation', '2024-05-31', '2024-06-15', 16, 'done',
     'Create marketing content for all channels', '2024-05-31', '2024-06-14', 8000.00, 7200.00),
    (7, 'Website Updates', '2024-06-16', '2024-06-25', 10, 'in_progress',
     'Update company website with new content', '2024-06-16', NULL, 5000.00, 4200.00),
    (7, 'Social Media Campaign', '2024-06-20', '2024-07-05', 16, 'in_progress',
     'Execute social media marketing campaign', '2024-06-20', NULL, 6500.00, 5800.00),
    (7, 'Email Marketing Setup', '2024-06-25', '2024-07-05', 11, 'in_progress',
     'Prepare email templates and mailing lists', '2024-06-25', NULL, 3500.00, 3200.00),
    (7, 'PPC Campaign Configuration', '2024-07-01', '2024-07-10', 10, 'on_hold',
     'Setup and configure pay-per-click campaigns', '2024-07-01', NULL, 7000.00, 0.00),
    (7, 'SEO Optimization', '2024-07-06', '2024-07-20', 15, 'on_hold',
     'Optimize website for search engines', '2024-07-06', NULL, 4500.00, 0.00),
    (7, 'Campaign Analytics Setup', '2024-07-11', '2024-07-15', 5, 'to_do',
     'Configure analytics to track campaign performance', NULL, NULL, 2000.00, 0.00),
    (7, 'Mid-Campaign Review', '2024-07-20', '2024-07-22', 3, 'to_do',
     'Review initial campaign performance', NULL, NULL, 1500.00, 0.00),
    (7, 'Campaign Adjustments', '2024-07-23', '2024-07-30', 8, 'to_do',
     'Make adjustments based on initial performance', NULL, NULL, 3000.00, 0.00),
    (7, 'Final Performance Analysis', '2024-08-01', '2024-08-10', 10, 'to_do',
     'Analyze overall campaign performance', NULL, NULL, 2500.00, 0.00),
    (7, 'Client Presentation', '2024-08-11', '2024-08-15', 5, 'to_do',
     'Present campaign results to client', NULL, NULL, 1000.00, 0.00);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (8, 'Kick-off Meeting', '2024-04-01', '2024-04-01', 1, 'done',
     'Initial project planning meeting', '2024-04-01', '2024-04-01', 600.00, 600.00),
    (8, 'Requirements Gathering', '2024-04-02', '2024-04-08', 7, 'done',
     'Collect client requirements for new system', '2024-04-02', '2024-04-07', 2800.00, 2850.00),
    (8, 'System Architecture Design', '2024-04-09', '2024-04-15', 7, 'done',
     'Design technical architecture for new system', '2024-04-09', '2024-04-16', 5000.00, 4950.00),
    (8, 'Database Schema Design', '2024-04-16', '2024-04-22', 7, 'done',
     'Design database schema and relationships', '2024-04-17', '2024-04-23', 4200.00, 4200.00),
    (8, 'Frontend Mockups', '2024-04-23', '2024-04-30', 8, 'done',
     'Create UI mockups for client approval', '2024-04-24', '2024-04-30', 3500.00, 3500.00),
    (8, 'Backend Development', '2024-05-01', '2024-05-15', 15, 'in_progress',
     'Develop server-side functionality', '2024-05-01', NULL, 7500.00, 7500.00),
    (8, 'Frontend Development', '2024-05-08', '2024-05-22', 15, 'in_progress',
     'Implement user interface components', '2024-05-08', NULL, 6800.00, 6750.00),
    (8, 'API Integration', '2024-05-15', '2024-05-25', 11, 'in_progress',
     'Connect frontend with backend services', '2024-05-15', NULL, 4500.00, 4500.00),
    (8, 'Unit Testing', '2024-05-26', '2024-06-02', 8, 'on_hold',
     'Perform unit tests on individual components', '2024-05-26', NULL, 3200.00, 1500.00),
    (8, 'Integration Testing', '2024-06-03', '2024-06-10', 8, 'on_hold',
     'Test integrated system components', '2024-06-03', NULL, 3800.00, 0.00),
    (8, 'User Acceptance Testing', '2024-06-11', '2024-06-18', 8, 'to_do',
     'Client testing of system functionality', NULL, NULL, 2500.00, 0.00),
    (8, 'Bug Fixes', '2024-06-19', '2024-06-25', 7, 'to_do',
     'Address issues identified during testing', NULL, NULL, 4200.00, 0.00),
    (8, 'System Deployment', '2024-06-26', '2024-07-02', 7, 'to_do',
     'Deploy system to production environment', NULL, NULL, 3500.00, 0.00),
    (8, 'User Training', '2024-07-03', '2024-07-10', 8, 'to_do',
     'Train client staff on new system', NULL, NULL, 2800.00, 0.00),
    (8, 'Project Closure', '2024-07-11', '2024-07-12', 2, 'to_do',
     'Final documentation and project handover', NULL, NULL, 1200.00, 0.00);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (9, 'Site Survey', '2024-03-01', '2024-03-05', 5, 'done',
     'Assess renovation site and take measurements', '2024-03-01', '2024-03-07', 1500.00, 1900.00),
    (9, 'Initial Design Drafts', '2024-03-06', '2024-03-15', 10, 'done',
     'Create preliminary design concepts', '2024-03-08', '2024-03-18', 3500.00, 4200.00),
    (9, 'Client Design Approval', '2024-03-16', '2024-03-20', 5, 'done',
     'Present designs to client for feedback', '2024-03-19', '2024-03-25', 800.00, 1100.00),
    (9, 'Material Selection', '2024-03-21', '2024-03-30', 10, 'done',
     'Select and source renovation materials', '2024-03-26', '2024-04-05', 2500.00, 3800.00),
    (9, 'Contractor Bidding', '2024-03-31', '2024-04-08', 9, 'done',
     'Receive and evaluate contractor bids', '2024-04-06', '2024-04-12', 1200.00, 1500.00),
    (9, 'Demolition Work', '2024-04-09', '2024-04-15', 7, 'done',
     'Remove existing structures and fixtures', '2024-04-13', '2024-04-22', 4500.00, 5800.00),
    (9, 'Plumbing Installation', '2024-04-16', '2024-04-25', 10, 'in_progress',
     'Install new plumbing systems', '2024-04-23', NULL, 7800.00, 9200.00),
    (9, 'Electrical Work', '2024-04-20', '2024-04-30', 11, 'in_progress',
     'Update and install electrical systems', '2024-04-25', NULL, 6500.00, 7900.00),
    (9, 'Drywall Installation', '2024-05-01', '2024-05-10', 10, 'in_progress',
     'Install new walls and partitions', '2024-05-01', NULL, 5400.00, 6100.00),
    (9, 'Flooring Installation', '2024-05-11', '2024-05-18', 8, 'on_hold',
     'Install new flooring throughout', '2024-05-11', NULL, 8200.00, 4500.00),
    (9, 'Cabinet Installation', '2024-05-19', '2024-05-25', 7, 'to_do',
     'Install kitchen and bathroom cabinets', NULL, NULL, 7500.00, 0.00),
    (9, 'Countertop Installation', '2024-05-26', '2024-06-01', 7, 'to_do',
     'Install stone countertops', NULL, NULL, 6800.00, 0.00),
    (9, 'Painting', '2024-06-02', '2024-06-08', 7, 'to_do',
     'Paint all walls and trim', NULL, NULL, 4200.00, 0.00),
    (9, 'Fixture Installation', '2024-06-09', '2024-06-15', 7, 'to_do',
     'Install lighting and plumbing fixtures', NULL, NULL, 3900.00, 0.00),
    (9, 'Final Inspection', '2024-06-16', '2024-06-20', 5, 'to_do',
     'Perform quality inspection of all work', NULL, NULL, 1200.00, 0.00),
    (9, 'Client Walkthrough', '2024-06-21', '2024-06-22', 2, 'to_do',
     'Final client approval of renovations', NULL, NULL, 800.00, 0.00);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (10, 'Project Charter Creation', '2024-02-01', '2024-02-05', 5, 'done',
     'Draft project charter and objectives', '2024-02-01', '2024-02-08', 1500.00, 1650.00),
    (10, 'Stakeholder Analysis', '2024-02-06', '2024-02-10', 5, 'done',
     'Identify and analyze key stakeholders', '2024-02-09', '2024-02-15', 2000.00, 2100.00),
    (10, 'Requirements Gathering', '2024-02-11', '2024-02-20', 10, 'done',
     'Collect detailed project requirements', '2024-02-16', '2024-02-28', 3500.00, 3800.00),
    (10, 'Project Planning', '2024-02-21', '2024-03-01', 10, 'done',
     'Create comprehensive project plan', '2024-03-01', '2024-03-15', 4000.00, 4200.00),
    (10, 'Resource Allocation', '2024-03-02', '2024-03-08', 7, 'done',
     'Assign resources to project tasks', '2024-03-16', '2024-03-25', 2500.00, 2650.00),
    (10, 'Design Phase', '2024-03-09', '2024-03-23', 15, 'in_progress',
     'System design and architecture', '2024-03-26', NULL, 7500.00, 6800.00),
    (10, 'Development Kickoff', '2024-03-24', '2024-03-30', 7, 'in_progress',
     'Begin development activities', '2024-04-10', NULL, 3000.00, 2700.00),
    (10, 'Backend Development', '2024-03-31', '2024-04-14', 15, 'in_progress',
     'Develop system backend components', '2024-04-20', NULL, 8500.00, 4200.00),
    (10, 'Frontend Development', '2024-04-15', '2024-04-29', 15, 'on_hold',
     'Develop user interface components', '2024-05-05', NULL, 7800.00, 2500.00),
    (10, 'Integration', '2024-04-30', '2024-05-09', 10, 'to_do',
     'Integrate system components', NULL, NULL, 5500.00, 0.00),
    (10, 'Testing Setup', '2024-05-10', '2024-05-16', 7, 'to_do',
     'Prepare testing environment', NULL, NULL, 3200.00, 0.00),
    (10, 'QA Testing', '2024-05-17', '2024-05-31', 15, 'to_do',
     'Perform quality assurance testing', NULL, NULL, 6500.00, 0.00),
    (10, 'User Acceptance Testing', '2024-06-01', '2024-06-10', 10, 'to_do',
     'Conduct user acceptance testing', NULL, NULL, 4800.00, 0.00),
    (10, 'Documentation', '2024-06-11', '2024-06-20', 10, 'to_do',
     'Create system documentation', NULL, NULL, 3500.00, 0.00),
    (10, 'Training Materials', '2024-06-21', '2024-06-30', 10, 'to_do',
     'Develop user training materials', NULL, NULL, 2800.00, 0.00),
    (10, 'Deployment Planning', '2024-07-01', '2024-07-07', 7, 'to_do',
     'Prepare for system deployment', NULL, NULL, 2000.00, 0.00),
    (10, 'Go-Live', '2024-07-08', '2024-07-15', 8, 'to_do',
     'System deployment to production', NULL, NULL, 4500.00, 0.00);


INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (11, 'Event Concept Development', '2024-03-15', '2024-03-20', 6, 'done',
     'Develop initial concept for corporate event', '2024-03-15', '2024-03-20', 2500.00, 2450.00),
    (11, 'Budget Proposal', '2024-03-21', '2024-03-25', 5, 'done',
     'Create and submit budget proposal', '2024-03-21', '2024-03-25', 1500.00, 1500.00),
    (11, 'Venue Research', '2024-03-26', '2024-04-01', 7, 'done',
     'Research and recommend venue options', '2024-03-26', '2024-04-01', 2000.00, 2100.00),
    (11, 'Venue Selection', '2024-04-02', '2024-04-05', 4, 'done',
     'Select event venue and confirm availability', '2024-04-02', '2024-04-05', 1000.00, 1000.00),
    (11, 'Vendor Selection', '2024-04-06', '2024-04-15', 10, 'done',
     'Select catering, AV, and decoration vendors', '2024-04-06', '2024-04-15', 3500.00, 3600.00),
    (11, 'Contract Negotiations', '2024-04-16', '2024-04-25', 10, 'in_progress',
     'Negotiate and finalize vendor contracts', '2024-04-16', NULL, 2500.00, 2300.00),
    (11, 'Event Schedule Planning', '2024-04-26', '2024-05-02', 7, 'in_progress',
     'Develop detailed event schedule', '2024-04-26', NULL, 1800.00, 1750.00),
    (11, 'Speaker Coordination', '2024-05-03', '2024-05-12', 10, 'in_progress',
     'Confirm speakers and presentation details', '2024-05-03', NULL, 3000.00, 2800.00),
    (11, 'Marketing Materials Design', '2024-05-13', '2024-05-22', 10, 'on_hold',
     'Design invitations and event materials', '2024-05-13', NULL, 4200.00, 2000.00),
    (11, 'Invitation Distribution', '2024-05-23', '2024-05-30', 8, 'on_hold',
     'Send invitations to attendees', '2024-05-23', NULL, 1500.00, 0.00),
    (11, 'Attendee Tracking', '2024-05-31', '2024-06-15', 16, 'to_do',
     'Track RSVPs and attendee information', NULL, NULL, 1200.00, 0.00),
    (11, 'Menu Selection', '2024-06-01', '2024-06-05', 5, 'to_do',
     'Finalize catering menu options', NULL, NULL, 800.00, 0.00),
    (11, 'AV Requirements', '2024-06-06', '2024-06-10', 5, 'to_do',
     'Finalize audio-visual requirements', NULL, NULL, 2500.00, 0.00),
    (11, 'Event Rehearsal', '2024-06-25', '2024-06-25', 1, 'to_do',
     'Conduct rehearsal with speakers and staff', NULL, NULL, 1500.00, 0.00),
    (11, 'Event Execution', '2024-06-30', '2024-06-30', 1, 'to_do',
     'Execute the event', NULL, NULL, 15000.00, 0.00),
    (11, 'Post-Event Evaluation', '2024-07-01', '2024-07-05', 5, 'to_do',
     'Conduct post-event assessment', NULL, NULL, 1200.00, 0.00);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, description, actual_start_date, actual_completion_date,
 expected_cost, actual_cost)
VALUES
    (12, 'Product Concept Definition', '2024-04-01', '2024-04-07', 7, 'done',
     'Define key product features and requirements', '2024-04-01', '2024-04-05', 3000.00, 2800.00),
    (12, 'Market Research', '2024-04-08', '2024-04-18', 11, 'done',
     'Research market needs and competition', '2024-04-06', '2024-04-12', 5500.00, 5200.00),
    (12, 'Prototype Design', '2024-04-19', '2024-05-03', 15, 'done',
     'Design initial product prototype', '2024-04-13', '2024-04-25', 7500.00, 7000.00),
    (12, 'Materials Sourcing', '2024-05-04', '2024-05-13', 10, 'done',
     'Source materials for prototype production', '2024-04-26', '2024-05-02', 6000.00, 6200.00),
    (12, 'Prototype Construction', '2024-05-14', '2024-05-28', 15, 'done',
     'Build functional prototype', '2024-05-03', '2024-05-14', 8500.00, 8700.00),
    (12, 'Initial Testing', '2024-05-29', '2024-06-07', 10, 'in_progress',
     'Conduct first phase of prototype testing', '2024-05-15', NULL, 4200.00, 3900.00),
    (12, 'Design Refinement', '2024-06-08', '2024-06-17', 10, 'in_progress',
     'Refine design based on initial testing', '2024-05-25', NULL, 5500.00, 3000.00),
    (12, 'Second Prototype', '2024-06-18', '2024-07-01', 14, 'in_progress',
     'Construct refined prototype', '2024-06-05', NULL, 7800.00, 4000.00),
    (12, 'Comprehensive Testing', '2024-07-02', '2024-07-16', 15, 'on_hold',
     'Perform thorough testing of all features', '2024-06-25', NULL, 6500.00, 1500.00),
    (12, 'User Feedback Collection', '2024-07-17', '2024-07-26', 10, 'on_hold',
     'Gather feedback from test users', '2024-07-01', NULL, 3500.00, 0.00),
    (12, 'Final Design Modifications', '2024-07-27', '2024-08-10', 15, 'to_do',
     'Make final design changes', NULL, NULL, 4800.00, 0.00),
    (12, 'Production Planning', '2024-08-11', '2024-08-20', 10, 'to_do',
     'Develop production strategy and timeline', NULL, NULL, 3200.00, 0.00),
    (12, 'Material Procurement for Production', '2024-08-21', '2024-09-04', 15, 'to_do',
     'Order materials for initial production run', NULL, NULL, 12000.00, 0.00),
    (12, 'Manufacturing Setup', '2024-09-05', '2024-09-19', 15, 'to_do',
     'Configure manufacturing facilities', NULL, NULL, 8500.00, 0.00),
    (12, 'Quality Control Process', '2024-09-20', '2024-09-30', 11, 'to_do',
     'Establish quality control procedures', NULL, NULL, 4200.00, 0.00),
    (12, 'Initial Production Run', '2024-10-01', '2024-10-15', 15, 'to_do',
     'Execute first production batch', NULL, NULL, 15000.00, 0.00);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES
-- High-cost tasks significantly behind schedule (major negative SV%)
(13, 'Create supply list', '2025-03-04', '2025-03-05', 2, 'done', '2025-07-14', '2025-07-15', 3000.00, 3000.00, 1),
(13, 'Buy supplies', '2025-03-02', '2025-03-03', 2, 'done', '2025-07-17', '2025-07-18', 5000.00, 5000.00, 2),
(13, 'Set up venue', '2025-03-16', '2025-03-18', 3, 'done', '2025-07-27', '2025-07-29', 10000.00, 1000.00, 3),
-- Low-cost tasks slightly ahead of schedule (minor positive SV%)
(13, 'Book venue', '2025-03-14', '2025-03-16', 3, 'done', '2025-03-14', '2025-03-15', 120.00, 120.00, 4),
(13, 'Create guest list', '2025-03-12', '2025-03-14', 3, 'done', '2025-03-12', '2025-03-13', 20.00, 20.00, NULL),
(13, 'Send invitations', '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 10.00, 10.00, NULL);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES
-- Tasks with major time delays but modest costs
(14, 'Create supply list', '2025-03-01', '2025-03-03', 2, 'done', '2025-07-14', '2025-07-16', 10.00, 5.00, 1),
(14, 'Buy supplies', '2025-03-04', '2025-03-06', 2, 'done', '2025-07-20', '2025-07-22', 150.00, 0.00, 2),
(14, 'Set up venue', '2025-03-06', '2025-03-09', 3, 'done', '2025-07-26', '2025-07-27', 300.00, 0.00, 3),
-- High-cost task with minimal time delay
(14, 'Book venue', '2025-03-13', '2025-03-16', 3, 'done', '2025-03-14', '2025-03-16', 12000.00, 12000.00, 4),
(14, 'Create guest list', '2025-03-12', '2025-03-14', 3, 'done', '2025-03-12', '2025-03-14', 200.00, 200.00, NULL),
(14, 'Send invitations', '2025-03-14', '2025-03-14', 1, 'done', '2025-03-14', '2025-03-14', 8000.00, 8000.00, NULL);

INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES
    (15, 'Market Research', '2025-02-01', '2025-02-28', 28, 'done', '2025-02-01', '2025-02-12', 5000.00, 5000.00, 1),
    (15, 'Product Design', '2025-03-01', '2025-03-15', 15, 'done', '2025-02-14', '2025-02-25', 8000.00, 8000.00, 2),
    (15, 'Prototype Development', '2025-03-16', '2025-04-05', 21, 'done', '2025-02-26', '2025-03-10', 12000.00, 12000.00, 3);

-- INSERT INTO Task
-- (project_id, name, target_start_date, target_completion_date,
--  target_days_to_complete, status, actual_start_date, actual_completion_date,
--  expected_cost, actual_cost, person_in_charge_id)
-- VALUES
--     (16, 'Software Development', '2025-01-15', '2025-02-15', 31, 'done', '2026-01-20', '2026-02-02', 15000.00, 15000.00, 1),
--     (16, 'Quality Testing', '2025-02-16', '2025-02-28', 13, 'done', '2026-02-16', '2026-02-22', 8000.00, 8000.00, 2),
--     (16, 'User Training', '2025-03-01', '2025-03-10', 10, 'done', '2026-03-01', '2026-03-05', 5000.00, 5000.00, 3);

-- INSERT INTO Task
-- (project_id, name, target_start_date, target_completion_date,
--  target_days_to_complete, status, actual_start_date, actual_completion_date,
--  expected_cost, actual_cost, person_in_charge_id)
-- VALUES
--     (16, 'High-Cost Task', '2025-01-26', '2025-02-05', 11, 'done', '2025-01-31', '2025-02-25', 5000.00, 5000.00, 1),
--     (16, 'Low-Cost Task', '2025-01-31', '2025-02-10', 11, 'done', '2025-01-28', '2025-02-02', 1000.00, 1000.00, 2),
--     (16, 'Medium-Cost Task', '2025-02-10', '2025-02-20', 11, 'done', '2025-02-10', '2025-02-20', 3000.00, 3000.00, 3);


INSERT INTO Task
(project_id, name, target_start_date, target_completion_date,
 target_days_to_complete, status, actual_start_date, actual_completion_date,
 expected_cost, actual_cost, person_in_charge_id)
VALUES
    (16, 'Task 1', '2025-01-01', '2025-01-15', 15, 'done', '2025-01-05', '2025-01-12', 3000.00, 3000.00, 1),
    (16, 'Task 2', '2025-01-16', '2025-01-31', 16, 'done', '2025-01-20', '2025-01-28', 3000.00, 3000.00, 2),
    (16, 'Task 3', '2025-02-01', '2025-02-20', 20, 'done', '2025-02-01', '2025-03-10', 4000.00, 4000.00, 3);


----------------------------------------------------------------
-- Insert Dependency Information (unchanged)
----------------------------------------------------------------

INSERT INTO Task_Depends_On (task_id, project_id, depends_task_id, depends_project_id)
VALUES
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
INSERT INTO Task_Depends_On (task_id, project_id, depends_task_id, depends_project_id)
VALUES
    -- Venue and Contractor Selection Dependencies
    (5, 6, 4, 6),   -- Stage Production Contractor depends on Venue Selection
    (6, 6, 4, 6),   -- Booth Contractor depends on Venue Selection

    -- Exhibitor and Floor Plan Dependencies
    (7, 6, 5, 6),   -- Prepare Booth Exhibitors depends on Booth Contractor selection
    (8, 6, 7, 6),   -- Finalize Exhibitor Numbers depends on preparing Exhibitors List
    (9, 6, 4, 6),   -- Obtain Venue Floor Plan depends on Venue Selection
    (10, 6, 9, 6),  -- Create Updated Floor Plan depends on Obtaining Floor Plan
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
