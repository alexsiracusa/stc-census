
INSERT INTO Project (id, parent, name) VALUES
(-1, NULL, 'Awards Ceremony'),
(-2, NULL, 'Create Flyer'),
(-3, -1, 'Create Poster');


INSERT INTO Task (id, parent, name, target_start_date, target_completion_date) VALUES
(-1, -1, 'Create supply list', '2025-03-14', '2025-03-15'),
(-2, -1, 'Buy supplies', '2025-03-15', '2025-03-16'),
(-3, -1, 'Set up venue', '2025-03-16', '2025-03-18'),
(-4, -1, 'Book venue', '2025-03-14', '2025-03-16'),
(-5, -1, 'Create guest list', '2025-03-12', '2025-03-14'),
(-6, -1, 'Send invitations', '2025-03-14', '2025-03-14'),
(-7, -2, 'Design flyer', '2025-03-8', '2025-03-10'),
(-8, -2, 'Get design approved', '2025-03-10', '2025-03-14'),
(-9, -2, 'Print flyers', '2025-03-14', '2025-03-15'),
(-10, -3, 'Design poster', '2025-03-9', '2025-03-10'),
(-11, -3, 'Get design approved', '2025-03-10', '2025-03-14'),
(-12, -3, 'Print poster', '2025-03-14', '2025-03-17');


INSERT INTO Task_Depends_On (task_id, depends_id) VALUES
(-3, -4),
(-3, -2),
(-2, -1),
(-6, -5),
(-9, -8),
(-8, -7),
(-12, -11),
(-11, -10);