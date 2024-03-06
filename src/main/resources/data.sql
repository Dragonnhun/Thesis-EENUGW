-- Inserting Admin User and User Profile
INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, "a366c022-1f68-42c9-9730-2f959e7e67dd", 'admin', 'admin@eenugw.com', TRUE, '$2a$10$jpLNVNeA7Ar/ZQ2DKbKCm.MuT2ESe.Qop96jipKMq7RaUgCoQedV.');
INSERT INTO user_roles (user_id, roles) VALUES ("a366c022-1f68-42c9-9730-2f959e7e67dd", 'USER');
INSERT INTO user_roles (user_id, roles) VALUES ("a366c022-1f68-42c9-9730-2f959e7e67dd", 'ADMIN');
INSERT INTO user_profiles (version, id, profile_display_id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, "2bb10c7f-33e1-4a32-971a-aa80cfb72059", UUID(), 'Admin', 'Admin', "a366c022-1f68-42c9-9730-2f959e7e67dd", 'images/profile-pictures/1.jpg', 'images/cover-pictures/1.jpg');

-- Inserting Simple User and User Profile
INSERT INTO users (version, id, username, email, enabled, password) VALUES (1, "f73f256d-2c90-4eec-b049-7282c0a5e11b", 'user', 'user@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe');
INSERT INTO user_roles (user_id, roles) VALUES ("f73f256d-2c90-4eec-b049-7282c0a5e11b", 'USER');
INSERT INTO user_profiles (version, id, profile_display_id, first_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES (1, "7470937e-c439-4f4d-ade7-2c6b3c71b870", UUID(), 'User', 'User', "f73f256d-2c90-4eec-b049-7282c0a5e11b", 'images/profile-pictures/2.jpg', 'images/cover-pictures/2.jpg');

-- Inserting Dummy Users, User Profiles and Posts
INSERT INTO users (version, id, username, email, enabled, password) VALUES 
(1, "a74580d7-0378-440a-a563-0ae65ca42be3", 'safak', 'safak@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, "931a201f-c368-4b27-ba93-8edb489892b6", 'janell', 'janell@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, "2f13786e-db29-4d06-b9ea-b0af3f784686", 'alex', 'alex@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, "6b4d53a5-18e8-48bf-8915-eebbc337e8f3", 'dora', 'dora@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, "5311e1f7-ff22-4d1c-846c-ae74bcb6324a", 'thomas', 'thomas@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, "fd3a759d-34bd-4d84-a182-0cd060141678", 'shirley', 'shirley@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, "c99cc54d-8e0d-4573-a408-125eebe29c67", 'travis', 'travis@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, "d513503f-ce00-4c8f-b1c9-5168a9658a8e", 'kristen', 'kristen@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, "6d19f9e9-a7b2-440b-9a4a-77f9d911aca7", 'gary', 'gary@eenugw.com', TRUE, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe'),
(1, "87da0537-3383-46c3-a001-c7105d6a4385", 'susan', 'susan@eenugw.com', TRUE, '$2a$10$jpLNVNeA7Ar/ZQ2DKbKCm.MuT2ESe.Qop96jipKMq7RaUgCoQedV.');

INSERT INTO user_roles (user_id, roles) VALUES 
("a74580d7-0378-440a-a563-0ae65ca42be3", 'USER'),
("931a201f-c368-4b27-ba93-8edb489892b6", 'USER'),
("2f13786e-db29-4d06-b9ea-b0af3f784686", 'USER'),
("6b4d53a5-18e8-48bf-8915-eebbc337e8f3", 'USER'),
("5311e1f7-ff22-4d1c-846c-ae74bcb6324a", 'USER'),
("fd3a759d-34bd-4d84-a182-0cd060141678", 'USER'),
("c99cc54d-8e0d-4573-a408-125eebe29c67", 'USER'),
("d513503f-ce00-4c8f-b1c9-5168a9658a8e", 'USER'),
("6d19f9e9-a7b2-440b-9a4a-77f9d911aca7", 'USER'),
("87da0537-3383-46c3-a001-c7105d6a4385", 'USER');


INSERT INTO user_profiles (version, id, profile_display_id, first_name, full_name, last_name, user_id, profile_picture_path, cover_picture_path) VALUES 
(1, "6069af20-0bab-442a-a76f-072e15020853", UUID(), 'Safak', 'Safak Kocaoglu', 'Kocaoglu', "a74580d7-0378-440a-a563-0ae65ca42be3", 'images/profile-pictures/3.jpg', 'images/cover-pictures/3.jpg'),
(1, "7c1f40bf-660e-4359-b413-a18c8e4f76fe", UUID(), 'Janell', 'Janell Shrum', 'Shrum', "931a201f-c368-4b27-ba93-8edb489892b6", 'images/profile-pictures/4.jpg', 'images/cover-pictures/4.jpg'),
(1, "ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8", UUID(), 'Alex', 'Alex Durden', 'Durden', "2f13786e-db29-4d06-b9ea-b0af3f784686", 'images/profile-pictures/5.jpg', 'images/cover-pictures/5.jpg'),
(1, "4cfc19e7-f633-44f9-9373-2d6a06b5e03b", UUID(), 'Dora', 'Dora Hawks', 'Hawks', "6b4d53a5-18e8-48bf-8915-eebbc337e8f3", 'images/profile-pictures/6.jpg', 'images/cover-pictures/6.jpg'),
(1, "d5a05f8c-199d-4588-a2d3-9a248b5c0928", UUID(), 'Thomas', 'Thomas Holden', 'Holden', "5311e1f7-ff22-4d1c-846c-ae74bcb6324a", 'images/profile-pictures/7.jpg', 'images/cover-pictures/7.jpg'),
(1, "dceecce0-f6d2-4c8c-8c84-3408bbb46224", UUID(), 'Shirley', 'Shirley Beauchamp', 'Beauchamp', "fd3a759d-34bd-4d84-a182-0cd060141678", 'images/profile-pictures/8.jpg', 'images/cover-pictures/8.jpg'),
(1, "ebe6c797-ba0c-433c-af18-fb7dbdc10884", UUID(), 'Travis', 'Travis Bennett', 'Bennett', "c99cc54d-8e0d-4573-a408-125eebe29c67", 'images/profile-pictures/9.jpg', 'images/cover-pictures/9.jpg'),
(1, "d92c4174-2f41-4e06-859c-dbe5d91d337a", UUID(), 'Kristen', 'Kristen Thomas', 'Thomas', "d513503f-ce00-4c8f-b1c9-5168a9658a8e", 'images/profile-pictures/10.jpg', 'images/cover-pictures/10.jpg'),
(1, "99eb7897-6da4-4607-bc5c-5a65b783690b", UUID(), 'Gary', 'Gary Duty', 'Duty', "6d19f9e9-a7b2-440b-9a4a-77f9d911aca7", 'images/profile-pictures/11.jpg', 'images/cover-pictures/11.jpg'),
(1, "e70e1427-9d44-4d6c-9941-3dd6710e51bd", UUID(), 'Susan', 'Susan Simmons', 'Simmons', "87da0537-3383-46c3-a001-c7105d6a4385", 'images/profile-pictures/12.jpg', 'images/cover-pictures/12.jpg');

-- Inserting Dummy User Profile Posts
INSERT INTO user_profile_posts (version, id, description, photo_path, creation_date_utc, user_profile_id) VALUES
(1, "25a29b97-83b4-4efa-bdb7-78997fc94a48", 'Love For All, Hatred For None.', 'images/post-pictures/1.jpg', UTC_TIMESTAMP(), "2bb10c7f-33e1-4a32-971a-aa80cfb72059"),
(1, "a607600a-a798-4798-8ccf-7441eff40358", '', 'images/post-pictures/2.jpg', UTC_TIMESTAMP(), "7470937e-c439-4f4d-ade7-2c6b3c71b870"),
(1, "332caabd-c477-4565-be83-775cb7e34c57", 'Every moment is a fresh beginning.', 'images/post-pictures/3.jpg', UTC_TIMESTAMP(), "6069af20-0bab-442a-a76f-072e15020853"),
(1, "def28656-ea84-4ba9-86df-ab6165cf895c", '', 'images/post-pictures/4.jpg', UTC_TIMESTAMP(), "7c1f40bf-660e-4359-b413-a18c8e4f76fe"),
(1, "a690627b-1ba9-4388-af83-7a2dadf6777e", '', 'images/post-pictures/5.jpg', UTC_TIMESTAMP(), "ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8"),
(1, "2e8d1977-5460-4755-9cd4-4a40f9fcf941", '', 'images/post-pictures/6.jpg', UTC_TIMESTAMP(), "4cfc19e7-f633-44f9-9373-2d6a06b5e03b"),
(1, "21e36f9c-6c9a-45df-97fb-b3015b4150dd", 'Never regret anything that made you smile.', 'images/post-pictures/7.jpg', UTC_TIMESTAMP(), "d5a05f8c-199d-4588-a2d3-9a248b5c0928"),
(1, "6d48edcf-4288-4bc5-8808-69af63b88eba", '', 'images/post-pictures/8.jpg', UTC_TIMESTAMP(), "dceecce0-f6d2-4c8c-8c84-3408bbb46224"),
(1, "e6f201ce-b2b8-499e-9856-b5d8627e55d4", 'Change the world by being yourself.', 'images/post-pictures/9.jpg', UTC_TIMESTAMP(), "ebe6c797-ba0c-433c-af18-fb7dbdc10884"),
(1, "f528e6f9-409a-4661-a7cd-f2c5d07b7ded", '', 'images/post-pictures/10.jpg', UTC_TIMESTAMP(), "d92c4174-2f41-4e06-859c-dbe5d91d337a"),
(1, "342b1214-13b8-41b3-8b29-46a4ee58ce4b", '', 'images/post-pictures/11.jpg', UTC_TIMESTAMP(), "99eb7897-6da4-4607-bc5c-5a65b783690b"),
(1, "5871f22c-990e-4528-9689-7c08e5447305", '', 'images/post-pictures/12.jpg', UTC_TIMESTAMP(), "e70e1427-9d44-4d6c-9941-3dd6710e51bd");

INSERT INTO user_profile_followings VALUES
('ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', '4cfc19e7-f633-44f9-9373-2d6a06b5e03b'),
('ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', 'd5a05f8c-199d-4588-a2d3-9a248b5c0928'),
('ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', 'd92c4174-2f41-4e06-859c-dbe5d91d337a'),
('ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', 'dceecce0-f6d2-4c8c-8c84-3408bbb46224'),
('ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', 'e70e1427-9d44-4d6c-9941-3dd6710e51bd'),
('ca3aadaf-f9fb-41a8-ab4c-4dc981d615f8', 'ebe6c797-ba0c-433c-af18-fb7dbdc10884');
