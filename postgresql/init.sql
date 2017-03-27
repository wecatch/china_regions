SET FOREIGN_KEY_CHECKS=0;


DROP TABLE IF EXISTS province;
CREATE TABLE province (
  _id             BIGSERIAL,
  name           TEXT,
  province_id      TEXT,
  PRIMARY KEY (_id)
);

DROP TABLE IF EXISTS city;
CREATE TABLE city (
  _id           BIGSERIAL,
  city_id       TEXT,
  name          TEXT,
  province_id   TEXT,
  PRIMARY KEY (_id)
);


DROP TABLE IF EXISTS area;
CREATE TABLE area (
  _id   BIGSERIAL,
  name TEXT,
  area_id TEXT,
  city_id TEXT,
  PRIMARY KEY (_id)
);