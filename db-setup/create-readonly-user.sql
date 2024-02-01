CREATE ROLE readonly_user WITH LOGIN PASSWORD 'readonly_user_password';

GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
