CREATE DATABASE kickBeginer;
USE kickBeginer;

CREATE TABLE Users
(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    location VARCHAR(30),
    email VARCHAR(60),
    password VARCHAR(60) NOT NULL,
    login INT
);

CREATE TABLE Projects
(
    projectId INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(50),
    subtitle VARCHAR(50),
    description LONGTEXT,
    imageUri LONGTEXT,
    target INT NOT NULL,
    creatorId INT NOT NULL,
    creatorName VARCHAR(30) NOT NULL,
    rewardId INT,
    rewardAmount INT,
    rewardDescription VARCHAR(150),
    creationDate DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    open BOOLEAN NOT NULL
);

CREATE TABLE Pledge
(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    amount INT,
    anonymous BOOLEAN,
    authToken LONGTEXT 
);
