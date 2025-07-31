-- Initialize GymFinder Database
-- This file is automatically executed when PostgreSQL container starts

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE gymfinder_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gymfinder_db');

-- Connect to the database
\c gymfinder_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
-- These will be created after Prisma migration

-- Set timezone
SET timezone = 'UTC';

-- Log successful initialization
SELECT 'GymFinder database initialized successfully' AS status;