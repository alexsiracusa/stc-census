
INSERT INTO Project (id, parent, name) VALUES
(1, NULL, 'Awards Ceremony'),
(2, NULL, 'Create Flyer'),
(3, 1, 'Create Poster');
ALTER SEQUENCE project_id_seq RESTART WITH 4;
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
(3, 'Print poster', '2025-03-14', '2025-03-17', 2);


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
(2, 3, 1, 3);