/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50150
Source Host           : localhost:3306
Source Database       : linkus

Target Server Type    : MYSQL
Target Server Version : 50150
File Encoding         : 65001

Date: 2012-03-01 17:49:04
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `province`
-- ----------------------------
DROP TABLE IF EXISTS province;
CREATE TABLE province (
  _id             BIGSERIAL,
  name           TEXT,
  province_id      TEXT,
  PRIMARY KEY (_id)
);

-- ----------------------------
-- Records of province
-- ----------------------------
INSERT INTO province VALUES ('1', '北京市\r', '110000');
INSERT INTO province VALUES ('2', '天津市\r', '120000');
INSERT INTO province VALUES ('3', '河北省\r', '130000');
INSERT INTO province VALUES ('4', '山西省\r', '140000');
INSERT INTO province VALUES ('5', '内蒙古自治区\r', '150000');
INSERT INTO province VALUES ('6', '辽宁省\r', '210000');
INSERT INTO province VALUES ('7', '吉林省\r', '220000');
INSERT INTO province VALUES ('8', '黑龙江省\r', '230000');
INSERT INTO province VALUES ('9', '上海市\r', '310000');
INSERT INTO province VALUES ('10', '江苏省\r', '320000');
INSERT INTO province VALUES ('11', '浙江省\r', '330000');
INSERT INTO province VALUES ('12', '安徽省\r', '340000');
INSERT INTO province VALUES ('13', '福建省\r', '350000');
INSERT INTO province VALUES ('14', '江西省\r', '360000');
INSERT INTO province VALUES ('15', '山东省\r', '370000');
INSERT INTO province VALUES ('16', '河南省\r', '410000');
INSERT INTO province VALUES ('17', '湖北省\r', '420000');
INSERT INTO province VALUES ('18', '湖南省\r', '430000');
INSERT INTO province VALUES ('19', '广东省\r', '440000');
INSERT INTO province VALUES ('20', '广西壮族自治区\r', '450000');
INSERT INTO province VALUES ('21', '海南省\r', '460000');
INSERT INTO province VALUES ('22', '重庆市\r', '500000');
INSERT INTO province VALUES ('23', '四川省\r', '510000');
INSERT INTO province VALUES ('24', '贵州省\r', '520000');
INSERT INTO province VALUES ('25', '云南省\r', '530000');
INSERT INTO province VALUES ('26', '西藏自治区\r', '540000');
INSERT INTO province VALUES ('27', '陕西省\r', '610000');
INSERT INTO province VALUES ('28', '甘肃省\r', '620000');
INSERT INTO province VALUES ('29', '青海省\r', '630000');
INSERT INTO province VALUES ('30', '宁夏回族自治区\r', '640000');
INSERT INTO province VALUES ('31', '新疆维吾尔自治区\r', '650000');
INSERT INTO province VALUES ('32', '台湾省\r', '710000');
INSERT INTO province VALUES ('33', '香港特别行政区\r', '810000');
INSERT INTO province VALUES ('34', '澳门特别行政区\r', '820000');
