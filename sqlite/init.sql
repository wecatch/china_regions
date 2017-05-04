CREATE TABLE area
(
    id INTEGER PRIMARY KEY,
    name NVARCHAR(32),
    area_id INTEGER,
    city_id INTEGER,
    longitude FLOAT,
    latitude FLOAT
);
CREATE TABLE city
(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city_id INTEGER,
    name NVARCHAR(16),
    province_id INTEGER,
    longitude FLOAT,
    latitude FLOAT
);
CREATE TABLE province
(
    id INTEGER PRIMARY KEY,
    name NVARCHAR(16),
    province_id INTEGER,
    longitude FLOAT,
    latitude FLOAT
);
