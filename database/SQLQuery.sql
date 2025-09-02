

USE SmartHomeDB;

CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY,
    Username NVARCHAR(50) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL
);

CREATE TABLE Devices (
    Id INT PRIMARY KEY IDENTITY,
    UserId INT FOREIGN KEY REFERENCES Users(Id),
    Type NVARCHAR(50) NOT NULL,  -- e.g., 'light', 'thermostat', 'door'
    Name NVARCHAR(100),
    Status NVARCHAR(50)  -- e.g., 'on', 'off', 'locked'
);

CREATE TABLE Sensors (
    Id INT PRIMARY KEY IDENTITY,
    DeviceId INT FOREIGN KEY REFERENCES Devices(Id),
    Type NVARCHAR(50),  -- e.g., 'temperature', 'humidity'
    Value FLOAT,
    Timestamp DATETIME DEFAULT GETDATE()
);