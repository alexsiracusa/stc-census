
INSERT INTO Project (id, name) VALUES
(-1, 'Awards Ceremony'),
(-2, 'Create Flyer');


INSERT INTO Task (id, parent, name) VALUES
(-1, -1, 'Create supply list'),
(-2, -1, 'Buy supplies'),
(-3, -1, 'Set up venue'),
(-4, -1, 'Book venue'),
(-5, -1, 'Create guest list'),
(-6, -1, 'Send invitations'),
(-7, -2, 'Design flyer'),
(-8, -2, 'Get design approved'),
(-9, -2, 'Print flyers');


INSERT INTO Task_Depends_On (task_id, depends_id) VALUES
(-3, -4),
(-3, -2),
(-2, -1),
(-6, -5);