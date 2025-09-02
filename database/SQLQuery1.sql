INSERT INTO Devices (UserId, Type, Name, Status)
VALUES (1, 'light', 'Living Room Light', 'off');

select * from Sensors

INSERT INTO Users (Username, PasswordHash)
VALUES 
    ('alice', '$2a$11$abcdefghijklmnopqrstuv'), -- Fake hash for "password123"
    ('bob', '$2a$11$xyzabcdefghijklmnopqrs'); -- Fake hash for "secret456"

    -- 'nithin' , '123456'


INSERT INTO Devices (UserId, Type, Name, Status)
VALUES 
    (1, 'light', 'Living Room Light', 'off'), -- DeviceId 1 for Alice
    (1, 'thermostat', 'Bedroom Thermostat', '22'), -- DeviceId 2 for Alice
    (1, 'door', 'Front Door', 'locked'), -- DeviceId 3 for Alice
    (2, 'light', 'Kitchen Light', 'on'), -- DeviceId 4 for Bob
    (2, 'camera', 'Backyard Camera', 'active'); -- DeviceId 5 for Bob

INSERT INTO Sensors (DeviceId, Type, Value, Timestamp)
VALUES 
    (1, 'temperature', 20.5, '2025-08-28 12:00:00'), -- Living Room Light temp
    (1, 'temperature', 21.0, '2025-08-28 12:01:00'),
    (2, 'temperature', 22.5, '2025-08-28 12:00:00'), -- Bedroom Thermostat temp
    (3, 'security', 1, '2025-08-28 12:02:00'), -- Front Door (1 = motion detected)
    (5, 'security', 0, '2025-08-28 12:03:00'); -- Backyard Camera (0 = no motion)