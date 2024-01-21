-- Inserting Admin User and User Profile
INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 1, 'admin', 'admin@eenugw.com', TRUE, '$2a$10$jpLNVNeA7Ar/ZQ2DKbKCm.MuT2ESe.Qop96jipKMq7RaUgCoQedV.');
INSERT INTO user_roles (user_id, roles) VALUES (1, 'USER');
INSERT INTO user_roles (user_id, roles) VALUES (1, 'ADMIN');
INSERT INTO userprofiles (version, id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, 1, 'Admin', 'Admin', 1, 'images/profile-pictures/1.jpg', 'images/cover-pictures/1.jpg');

-- Inserting Simple User and User Profile
INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 2, 'user', 'user@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe');
INSERT INTO user_roles (user_id, roles) VALUES (2, 'USER');
INSERT INTO userprofiles (version, id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, 2, 'User', 'User', 2, 'images/profile-pictures/2.jpg', 'images/cover-pictures/2.jpg');

-- Inserting Dummy Users, User Profiles and Posts
INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 3, 'safak', 'safak@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe');
INSERT INTO user_roles (user_id, roles) VALUES (3, 'USER');
INSERT INTO userprofiles (version, id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, 3, 'Safak', 'Kocaoglu', 3, 'images/profile-pictures/3.jpg', 'images/cover-pictures/3.jpg');

INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 4, 'janell', 'janell@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe');
INSERT INTO user_roles (user_id, roles) VALUES (4, 'USER');
INSERT INTO userprofiles (version, id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, 4, 'Janell', 'Shrum', 4, 'images/profile-pictures/4.jpg', 'images/cover-pictures/4.jpg');

INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 5, 'alex', 'alex@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe');
INSERT INTO user_roles (user_id, roles) VALUES (5, 'USER');
INSERT INTO userprofiles (version, id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, 5, 'Alex', 'Durden', 5, 'images/profile-pictures/5.jpg', 'images/cover-pictures/5.jpg');

INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 6, 'dora', 'dora@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe');
INSERT INTO user_roles (user_id, roles) VALUES (6, 'USER');
INSERT INTO userprofiles (version, id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, 6, 'Dora', 'Hawks', 6, 'images/profile-pictures/6.jpg', 'images/cover-pictures/6.jpg');

INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 7, 'thomas', 'thomas@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe');
INSERT INTO user_roles (user_id, roles) VALUES (7, 'USER');
INSERT INTO userprofiles (version, id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, 7, 'Thomas', 'Holden', 7, 'images/profile-pictures/7.jpg', 'images/cover-pictures/7.jpg');

INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 8, 'shirley', 'shirley@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe');
INSERT INTO user_roles (user_id, roles) VALUES (8, 'USER');
INSERT INTO userprofiles (version, id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, 8, 'Shirley', 'Beauchamp', 8, 'images/profile-pictures/8.jpg', 'images/cover-pictures/8.jpg');

INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 9, 'travis', 'travis@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe');
INSERT INTO user_roles (user_id, roles) VALUES (9, 'USER');
INSERT INTO userprofiles (version, id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, 9, 'Travis', 'Bennett', 9, 'images/profile-pictures/9.jpg', 'images/cover-pictures/9.jpg');

INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 10, 'kristen', 'kristen@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe');
INSERT INTO user_roles (user_id, roles) VALUES (10, 'USER');
INSERT INTO userprofiles (version, id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, 10, 'Kristen', 'Thomas', 10, 'images/profile-pictures/10.jpg', 'images/cover-pictures/10.jpg');

INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 11, 'gary', 'gary@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe');
INSERT INTO user_roles (user_id, roles) VALUES (11, 'USER');
INSERT INTO userprofiles (version, id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, 11, 'Gary', 'Duty', 11, 'images/profile-pictures/11.jpg', 'images/cover-pictures/11.jpg');

INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 12, 'susan', 'susan@eenugw.com', TRUE, '$2a$10$jpLNVNeA7Ar/ZQ2DKbKCm.MuT2ESe.Qop96jipKMq7RaUgCoQedV.');
INSERT INTO user_roles (user_id, roles) VALUES (12, 'USER');
INSERT INTO userprofiles (version, id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, 12, 'Susan', 'Simmons', 12, 'images/profile-pictures/12.jpg', 'images/cover-pictures/12.jpg');

-- Inserting Dummy User Profile Posts
INSERT INTO userprofileposts (version, id, description, photo_path, creation_date_utc, like_count, heart_count, user_profile_id) VALUES
(1, 1, 'Love For All, Hatred For None.', 'images/post-pictures/1.jpg', CURRENT_TIMESTAMP, 32, 0, 1),
(1, 2, '', 'images/post-pictures/2.jpg', CURRENT_TIMESTAMP, 1, 0, 2),
(1, 3, 'Every moment is a fresh beginning.', 'images/post-pictures/3.jpg', CURRENT_TIMESTAMP, 61, 0, 3),
(1, 4, '', 'images/post-pictures/4.jpg', CURRENT_TIMESTAMP, 0, 0, 4),
(1, 5, '', 'images/post-pictures/5.jpg', CURRENT_TIMESTAMP, 23, 0, 5),
(1, 6, '', 'images/post-pictures/6.jpg', CURRENT_TIMESTAMP, 44, 0, 6),
(1, 7, 'Never regret anything that made you smile.', 'images/post-pictures/7.jpg', CURRENT_TIMESTAMP, 52, 0, 7),
(1, 8, '', 'images/post-pictures/8.jpg', CURRENT_TIMESTAMP, 15, 0, 8),
(1, 9, 'Change the world by being yourself.', 'images/post-pictures/9.jpg', CURRENT_TIMESTAMP, 11, 0, 9),
(1, 10, '', 'images/post-pictures/10.jpg', CURRENT_TIMESTAMP, 104, 0, 10),
(1, 11, '', 'images/post-pictures/11.jpg', CURRENT_TIMESTAMP, 104, 0, 11),
(1, 12, '', 'images/post-pictures/12.jpg', CURRENT_TIMESTAMP, 104, 0, 12);
