-- Insert sample users (passwords are hashed versions of 'password')
INSERT INTO users (id, name, email, password_hash) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john@example.com', '$2b$10$rOzJqQnQjQjQjQjQjQjQjOzJqQnQjQjQjQjQjQjQjOzJqQnQjQjQjQ'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane@example.com', '$2b$10$rOzJqQnQjQjQjQjQjQjQjOzJqQnQjQjQjQjQjQjQjOzJqQnQjQjQjQ')
ON CONFLICT (email) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, deadline, user_id) VALUES
  ('Complete project proposal', 'Write and submit the Q4 project proposal for the new client', 'in-progress', 'high', '2024-01-15', '550e8400-e29b-41d4-a716-446655440001'),
  ('Review code changes', 'Review pull requests from the development team', 'todo', 'medium', '2024-01-12', '550e8400-e29b-41d4-a716-446655440001'),
  ('Update documentation', 'Update API documentation with latest changes', 'completed', 'low', '2024-01-10', '550e8400-e29b-41d4-a716-446655440001'),
  ('Client meeting preparation', 'Prepare slides and agenda for tomorrow''s client meeting', 'todo', 'high', '2024-01-11', '550e8400-e29b-41d4-a716-446655440001'),
  ('Design system updates', 'Update the design system components for the new brand guidelines', 'in-progress', 'medium', '2024-01-20', '550e8400-e29b-41d4-a716-446655440002'),
  ('User testing session', 'Conduct user testing for the new dashboard interface', 'todo', 'high', '2024-01-18', '550e8400-e29b-41d4-a716-446655440002');
