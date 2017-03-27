SET FOREIGN_KEY_CHECKS=0;


DROP TABLE IF EXISTS province;
CREATE TABLE province (
  _id            int,
  name           varchar(16),
  province_id      varchar(8),
  PRIMARY KEY (_id)
);


DROP TABLE IF EXISTS city;
CREATE TABLE city (
  _id           int,
  city_id       varchar(8),
  name          varchar(32),
  province_id   varchar(8),
  PRIMARY KEY (_id)
);


DROP TABLE IF EXISTS area;
CREATE TABLE area (
  _id  int,
  name varchar(32),
  area_id varchar(8),
  city_id varchar(8),
  PRIMARY KEY (_id)
);

