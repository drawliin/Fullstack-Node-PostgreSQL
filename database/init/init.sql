CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    completed BOOLEAN DEFAULT FALSE
);

INSERT INTO tasks (title, description, due_date) VALUES
('Complete project', 'Finishing the deployment app', '2025-02-28'),
('Buy groceries', 'Milk, bread, eggs', '2024-11-15'),
('Call mom', 'Discuss weekend plans', '2023-11-20');