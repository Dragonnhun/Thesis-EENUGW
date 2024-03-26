-- Inserting admin user and its associated user profile.
INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 'a366c022-1f68-42c9-9730-2f959e7e67dd', 'admin', 'admin@eenugw.com', TRUE, '$2a$10$jpLNVNeA7Ar/ZQ2DKbKCm.MuT2ESe.Qop96jipKMq7RaUgCoQedV.');
INSERT INTO user_roles (user_id, roles) VALUES ('a366c022-1f68-42c9-9730-2f959e7e67dd', 'USER');
INSERT INTO user_roles (user_id, roles) VALUES ('a366c022-1f68-42c9-9730-2f959e7e67dd', 'ADMIN');
INSERT INTO user_profiles (version, id, profile_display_id, first_name, full_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, '2bb10c7f-33e1-4a32-971a-aa80cfb72059', UUID(), 'Intertwine', 'Intertwine Admin', 'Admin', 'a366c022-1f68-42c9-9730-2f959e7e67dd', '', '');

-- Inserting simple user and its associated user profile.
INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, 'f73f256d-2c90-4eec-b049-7282c0a5e11b', 'user', 'user@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe');
INSERT INTO user_roles (user_id, roles) VALUES ('f73f256d-2c90-4eec-b049-7282c0a5e11b', 'USER');
INSERT INTO user_profiles (version, id, profile_display_id, first_name, full_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, '7470937e-c439-4f4d-ade7-2c6b3c71b870', UUID(), 'Intertwine', 'Intertwine User', 'User', 'f73f256d-2c90-4eec-b049-7282c0a5e11b', '', '');

-- Inserting example users, their associated user profiles and their posts.
INSERT INTO users (version, id, username, email, enabled, password) VALUES 
(1, '931a201f-c368-4b27-ba93-8edb489892b6', 'janell', 'janell@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, '2f13786e-db29-4d06-b9ea-b0af3f784686', 'alex', 'alex@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, '6b4d53a5-18e8-48bf-8915-eebbc337e8f3', 'dora', 'dora@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, '5311e1f7-ff22-4d1c-846c-ae74bcb6324a', 'thomas', 'thomas@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, 'fd3a759d-34bd-4d84-a182-0cd060141678', 'shirley', 'shirley@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, 'c99cc54d-8e0d-4573-a408-125eebe29c67', 'travis', 'travis@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, 'd513503f-ce00-4c8f-b1c9-5168a9658a8e', 'kristen', 'kristen@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, '6d19f9e9-a7b2-440b-9a4a-77f9d911aca7', 'gary', 'gary@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, '87da0537-3383-46c3-a001-c7105d6a4385', 'susan', 'susan@eenugw.com', TRUE, '$2a$10$jpLNVNeA7Ar/ZQ2DKbKCm.MuT2ESe.Qop96jipKMq7RaUgCoQedV.');

-- Inserting example users' roles.
INSERT INTO user_roles (user_id, roles) VALUES 
('931a201f-c368-4b27-ba93-8edb489892b6', 'USER'),
('2f13786e-db29-4d06-b9ea-b0af3f784686', 'USER'),
('6b4d53a5-18e8-48bf-8915-eebbc337e8f3', 'USER'),
('5311e1f7-ff22-4d1c-846c-ae74bcb6324a', 'USER'),
('fd3a759d-34bd-4d84-a182-0cd060141678', 'USER'),
('c99cc54d-8e0d-4573-a408-125eebe29c67', 'USER'),
('d513503f-ce00-4c8f-b1c9-5168a9658a8e', 'USER'),
('6d19f9e9-a7b2-440b-9a4a-77f9d911aca7', 'USER'),
('87da0537-3383-46c3-a001-c7105d6a4385', 'USER');

-- Inserting example users' user profiles.
INSERT INTO user_profiles (version, id, profile_display_id, first_name, full_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES 
(1, '7c1f40bf-660e-4359-b413-a18c8e4f76fe', UUID(), 'Janell', 'Janell Shrum', 'Shrum', '931a201f-c368-4b27-ba93-8edb489892b6', 'images/profile-pictures/1.jpg', 'images/cover-pictures/1.jpg'),
(1, 'ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', UUID(), 'Alex', 'Alex Durden', 'Durden', '2f13786e-db29-4d06-b9ea-b0af3f784686', 'images/profile-pictures/2.jpg', 'images/cover-pictures/2.jpg'),
(1, '4cfc19e7-f633-44f9-9373-2d6a06b5e03b', UUID(), 'Dora', 'Dora Hawks', 'Hawks', '6b4d53a5-18e8-48bf-8915-eebbc337e8f3', 'images/profile-pictures/3.jpg', 'images/cover-pictures/3.jpg'),
(1, 'd5a05f8c-199d-4588-a2d3-9a248b5c0928', UUID(), 'Thomas', 'Thomas Holden', 'Holden', '5311e1f7-ff22-4d1c-846c-ae74bcb6324a', 'images/profile-pictures/4.jpg', 'images/cover-pictures/4.jpg'),
(1, 'dceecce0-f6d2-4c8c-8c84-3408bbb46224', UUID(), 'Shirley', 'Shirley Beauchamp', 'Beauchamp', 'fd3a759d-34bd-4d84-a182-0cd060141678', 'images/profile-pictures/5.jpg', 'images/cover-pictures/5.jpg'),
(1, 'ebe6c797-ba0c-433c-af18-fb7dbdc10884', UUID(), 'Travis', 'Travis Bennett', 'Bennett', 'c99cc54d-8e0d-4573-a408-125eebe29c67', 'images/profile-pictures/6.jpg', 'images/cover-pictures/6.jpg'),
(1, 'd92c4174-2f41-4e06-859c-dbe5d91d337a', UUID(), 'Kristen', 'Kristen Thomas', 'Thomas', 'd513503f-ce00-4c8f-b1c9-5168a9658a8e', 'images/profile-pictures/7.jpg', 'images/cover-pictures/7.jpg'),
(1, '99eb7897-6da4-4607-bc5c-5a65b783690b', UUID(), 'Gary', 'Gary Duty', 'Duty', '6d19f9e9-a7b2-440b-9a4a-77f9d911aca7', 'images/profile-pictures/8.jpg', 'images/cover-pictures/8.jpg'),
(1, 'e70e1427-9d44-4d6c-9941-3dd6710e51bd', UUID(), 'Susan', 'Susan Simmons', 'Simmons', '87da0537-3383-46c3-a001-c7105d6a4385', 'images/profile-pictures/9.jpg', 'images/cover-pictures/9.jpg');

-- Inserting example users' posts.
INSERT INTO user_profile_posts (version, id, description, photo_path, creation_date_utc, user_profile_id, post_type) VALUES
(1, '25a29b97-83b4-4efa-bdb7-78997fc94a48', 'Example post text.', 'images/post-pictures/1.jpg', UTC_TIMESTAMP(), '2bb10c7f-33e1-4a32-971a-aa80cfb72059', 0),
(1, 'a607600a-a798-4798-8ccf-7441eff40358', 'Example post text 2.', 'images/post-pictures/2.jpg', UTC_TIMESTAMP(), '7470937e-c439-4f4d-ade7-2c6b3c71b870', 0),
(1, 'def28656-ea84-4ba9-86df-ab6165cf895c', 'Example post text 3.', 'images/post-pictures/3.jpg', UTC_TIMESTAMP(), '7c1f40bf-660e-4359-b413-a18c8e4f76fe', 0),
(1, 'a690627b-1ba9-4388-af83-7a2dadf6777e', '', 'images/post-pictures/4.jpg', UTC_TIMESTAMP(), 'ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', 0),
(1, '2e8d1977-5460-4755-9cd4-4a40f9fcf941', '', 'images/post-pictures/5.jpg', UTC_TIMESTAMP(), '4cfc19e7-f633-44f9-9373-2d6a06b5e03b', 0),
(1, '21e36f9c-6c9a-45df-97fb-b3015b4150dd', 'Example post text 4.', 'images/post-pictures/6.jpg', UTC_TIMESTAMP(), 'd5a05f8c-199d-4588-a2d3-9a248b5c0928', 0),
(1, '6d48edcf-4288-4bc5-8808-69af63b88eba', '', 'images/post-pictures/7.jpg', UTC_TIMESTAMP(), 'dceecce0-f6d2-4c8c-8c84-3408bbb46224', 0),
(1, 'e6f201ce-b2b8-499e-9856-b5d8627e55d4', 'Example post text 5.', 'images/post-pictures/8.jpg', UTC_TIMESTAMP(), 'ebe6c797-ba0c-433c-af18-fb7dbdc10884', 0),
(1, 'f528e6f9-409a-4661-a7cd-f2c5d07b7ded', '', 'images/post-pictures/9.jpg', UTC_TIMESTAMP(), 'd92c4174-2f41-4e06-859c-dbe5d91d337a', 0),
(1, '342b1214-13b8-41b3-8b29-46a4ee58ce4b', '', 'images/post-pictures/10.jpg', UTC_TIMESTAMP(), '99eb7897-6da4-4607-bc5c-5a65b783690b', 0),
(1, '5871f22c-990e-4528-9689-7c08e5447305', 'Example post text 6.', 'images/post-pictures/11.jpg', UTC_TIMESTAMP(), 'e70e1427-9d44-4d6c-9941-3dd6710e51bd', 0);

-- Inserting example users' user profile followings.
INSERT INTO user_profile_followings VALUES
-- Alex Durden
('ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', '4cfc19e7-f633-44f9-9373-2d6a06b5e03b'),
('ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', 'd5a05f8c-199d-4588-a2d3-9a248b5c0928'),
('ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', 'd92c4174-2f41-4e06-859c-dbe5d91d337a'),
('ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', 'dceecce0-f6d2-4c8c-8c84-3408bbb46224'),
('ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', 'e70e1427-9d44-4d6c-9941-3dd6710e51bd'),
('ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', 'ebe6c797-ba0c-433c-af18-fb7dbdc10884'),
-- Dora Hawks
('4cfc19e7-f633-44f9-9373-2d6a06b5e03b', 'ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8'),
('4cfc19e7-f633-44f9-9373-2d6a06b5e03b', 'd5a05f8c-199d-4588-a2d3-9a248b5c0928'),
('4cfc19e7-f633-44f9-9373-2d6a06b5e03b', 'd92c4174-2f41-4e06-859c-dbe5d91d337a'),
('4cfc19e7-f633-44f9-9373-2d6a06b5e03b', 'dceecce0-f6d2-4c8c-8c84-3408bbb46224'),
('4cfc19e7-f633-44f9-9373-2d6a06b5e03b', 'e70e1427-9d44-4d6c-9941-3dd6710e51bd'),
('4cfc19e7-f633-44f9-9373-2d6a06b5e03b', 'ebe6c797-ba0c-433c-af18-fb7dbdc10884'),
-- Thomas Holden
('d5a05f8c-199d-4588-a2d3-9a248b5c0928', 'ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8'),
('d5a05f8c-199d-4588-a2d3-9a248b5c0928', '4cfc19e7-f633-44f9-9373-2d6a06b5e03b'),
('d5a05f8c-199d-4588-a2d3-9a248b5c0928', 'd92c4174-2f41-4e06-859c-dbe5d91d337a'),
('d5a05f8c-199d-4588-a2d3-9a248b5c0928', 'dceecce0-f6d2-4c8c-8c84-3408bbb46224'),
('d5a05f8c-199d-4588-a2d3-9a248b5c0928', 'e70e1427-9d44-4d6c-9941-3dd6710e51bd'),
('d5a05f8c-199d-4588-a2d3-9a248b5c0928', 'ebe6c797-ba0c-433c-af18-fb7dbdc10884'),
-- Kristen Thomas
('d92c4174-2f41-4e06-859c-dbe5d91d337a', 'ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8'),
('d92c4174-2f41-4e06-859c-dbe5d91d337a', '4cfc19e7-f633-44f9-9373-2d6a06b5e03b'),
('d92c4174-2f41-4e06-859c-dbe5d91d337a', 'd5a05f8c-199d-4588-a2d3-9a248b5c0928'),
('d92c4174-2f41-4e06-859c-dbe5d91d337a', 'dceecce0-f6d2-4c8c-8c84-3408bbb46224'),
('d92c4174-2f41-4e06-859c-dbe5d91d337a', 'e70e1427-9d44-4d6c-9941-3dd6710e51bd'),
('d92c4174-2f41-4e06-859c-dbe5d91d337a', 'ebe6c797-ba0c-433c-af18-fb7dbdc10884'),
-- Janell Shrum
('7c1f40bf-660e-4359-b413-a18c8e4f76fe', 'd92c4174-2f41-4e06-859c-dbe5d91d337a'),
('7c1f40bf-660e-4359-b413-a18c8e4f76fe', '4cfc19e7-f633-44f9-9373-2d6a06b5e03b'),
('7c1f40bf-660e-4359-b413-a18c8e4f76fe', 'e70e1427-9d44-4d6c-9941-3dd6710e51bd'),
-- Susan Simmons
('e70e1427-9d44-4d6c-9941-3dd6710e51bd', 'dceecce0-f6d2-4c8c-8c84-3408bbb46224'),
('e70e1427-9d44-4d6c-9941-3dd6710e51bd', '4cfc19e7-f633-44f9-9373-2d6a06b5e03b'),
('e70e1427-9d44-4d6c-9941-3dd6710e51bd', 'd92c4174-2f41-4e06-859c-dbe5d91d337a'),
('e70e1427-9d44-4d6c-9941-3dd6710e51bd', '7c1f40bf-660e-4359-b413-a18c8e4f76fe'),
-- Gary Duty
('99eb7897-6da4-4607-bc5c-5a65b783690b', 'e70e1427-9d44-4d6c-9941-3dd6710e51bd'),
('99eb7897-6da4-4607-bc5c-5a65b783690b', 'dceecce0-f6d2-4c8c-8c84-3408bbb46224'),
('99eb7897-6da4-4607-bc5c-5a65b783690b', '4cfc19e7-f633-44f9-9373-2d6a06b5e03b'),
('99eb7897-6da4-4607-bc5c-5a65b783690b', 'd92c4174-2f41-4e06-859c-dbe5d91d337a'),
-- Shirley Beauchamp
('dceecce0-f6d2-4c8c-8c84-3408bbb46224', 'e70e1427-9d44-4d6c-9941-3dd6710e51bd'),
('dceecce0-f6d2-4c8c-8c84-3408bbb46224', '4cfc19e7-f633-44f9-9373-2d6a06b5e03b'),
('dceecce0-f6d2-4c8c-8c84-3408bbb46224', 'd92c4174-2f41-4e06-859c-dbe5d91d337a'),
('dceecce0-f6d2-4c8c-8c84-3408bbb46224', '7c1f40bf-660e-4359-b413-a18c8e4f76fe'),
-- Travis Bennett
('ebe6c797-ba0c-433c-af18-fb7dbdc10884', 'dceecce0-f6d2-4c8c-8c84-3408bbb46224'),
('ebe6c797-ba0c-433c-af18-fb7dbdc10884', '4cfc19e7-f633-44f9-9373-2d6a06b5e03b'),
('ebe6c797-ba0c-433c-af18-fb7dbdc10884', 'd92c4174-2f41-4e06-859c-dbe5d91d337a'),
('ebe6c797-ba0c-433c-af18-fb7dbdc10884', '7c1f40bf-660e-4359-b413-a18c8e4f76fe');
