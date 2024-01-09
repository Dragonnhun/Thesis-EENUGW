-- Inserting Admin User
insert into users (version, id, username, email, enabled, profile_id, password) values (1, '1', 'admin', 'admin@eenugw.com', TRUE, 1, '$2a$10$jpLNVNeA7Ar/ZQ2DKbKCm.MuT2ESe.Qop96jipKMq7RaUgCoQedV.')
insert into user_roles (user_id, roles) values ('1', 'USER')
insert into user_roles (user_id, roles) values ('1', 'ADMIN')

-- Inserting Simple User
insert into users (version, id, username, email, enabled, profile_id, password) values (1, '2', 'user', 'user@eenugw.com', TRUE, 2, '$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe')
insert into user_roles (user_id, roles) values ('2', 'USER')
