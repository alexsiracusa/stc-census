
INSERT INTO Project (id, parent, name) VALUES
(-1, NULL, 'Awards Ceremony'),
(-2, NULL, 'Create Flyer'),
(-3, -1, 'Create Poster');


INSERT INTO Task (id, parent, name) VALUES
(-1, -1, 'Create supply list'),
(-2, -1, 'Buy supplies'),
(-3, -1, 'Set up venue'),
(-4, -1, 'Book venue'),
(-5, -1, 'Create guest list'),
(-6, -1, 'Send invitations'),
(-7, -2, 'Design flyer'),
(-8, -2, 'Get design approved'),
(-9, -2, 'Print flyers'),
(-10, -3, 'Design poster'),
(-11, -3, 'Get design approved'),
(-12, -3, 'Print poster');


INSERT INTO Task_Depends_On (task_id, depends_id) VALUES
(-3, -4),
(-3, -2),
(-2, -1),
(-6, -5),
(-9, -8),
(-8, -7),
(-12, -11),
(-11, -10);