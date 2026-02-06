CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       full_name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       role VARCHAR(20) NOT NULL,
                       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                       updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE caregiver_profiles (
                                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                    user_id UUID NOT NULL UNIQUE,
                                    bio TEXT,
                                    years_of_experience INTEGER,
                                    hourly_rate NUMERIC(10,2),
                                    available_from TIME,
                                    available_to TIME,
                                    city VARCHAR(100) NOT NULL,
                                    state CHAR(2) NOT NULL,
                                    skills TEXT,
                                    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                    CONSTRAINT fk_caregiver_user
                                        FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE elder_profiles (
                                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                user_id UUID NOT NULL UNIQUE,
                                bio TEXT,
                                care_needs TEXT,
                                medical_conditions TEXT,
                                mobility_level VARCHAR(100),
                                city VARCHAR(100) NOT NULL,
                                state CHAR(2) NOT NULL,
                                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                CONSTRAINT fk_elder_user
                                    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE care_requests (
                               id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               elder_profile_id UUID NOT NULL,
                               description TEXT NOT NULL,
                               care_date DATE NOT NULL,
                               start_time TIME NOT NULL,
                               end_time TIME NOT NULL,
                               city VARCHAR(100) NOT NULL,
                               state CHAR(2) NOT NULL,
                               status VARCHAR(20) NOT NULL,
                               assigned_caregiver_profile_id UUID,
                               created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                               CONSTRAINT fk_care_request_elder
                                   FOREIGN KEY (elder_profile_id) REFERENCES elder_profiles(id),
                               CONSTRAINT fk_assigned_caregiver
                                   FOREIGN KEY (assigned_caregiver_profile_id)
                                       REFERENCES caregiver_profiles(id)
);

CREATE TABLE care_request_applications (
                                           id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                           care_request_id UUID NOT NULL,
                                           caregiver_profile_id UUID NOT NULL,
                                           created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                           CONSTRAINT fk_application_request
                                               FOREIGN KEY (care_request_id) REFERENCES care_requests(id),
                                           CONSTRAINT fk_application_caregiver
                                               FOREIGN KEY (caregiver_profile_id) REFERENCES caregiver_profiles(id),
                                           CONSTRAINT uk_request_caregiver
                                               UNIQUE (care_request_id, caregiver_profile_id)
);
