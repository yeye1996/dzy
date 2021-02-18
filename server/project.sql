CREATE DATABASE IF NOT EXISTS `dzy` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `dzy`;

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `aid` int(11) NOT NULL,
  `aname` varchar(32) NOT NULL,
  `apwd` varchar(55) NOT NULL
);

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `uid` int(11) NOT NULL,
  `uname` varchar(55) NOT NULL,
  `upwd` varchar(55) NOT NULL,
  `dept` varchar(32) NOT NULL,
  `post` varchar(32) NOT NULL
);

DROP TABLE IF EXISTS `project`;
CREATE TABLE IF NOT EXISTS `project` (
  `pid` int(11) NOT NULL,
  `pname` varchar(55) NOT NULL,
  `pstart` datetime,
  `pend` datetime,
  `ptype` varchar(32) NOT NULL,
  `ppeople` varchar(32) NOT NULL
);

DROP TABLE IF EXISTS `task`;
CREATE TABLE IF NOT EXISTS `task` (
  `tid` int(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `tname` varchar(55) NOT NULL,
  `tstart` datetime,
  `tend` datetime,
  `workload` varchar(200) NOT NULL,
  `demand` varchar(400) NOT NULL,
  `ttype` varchar(32) NOT NULL
);




alter table `user` modify `uid` int(11) primary key  auto_increment;
alter table `admin` modify `aid` int(11) primary key  auto_increment;
alter table `project` modify `pid` int(11) primary key  auto_increment;
alter table `task` modify `tid` int(11) primary key  auto_increment;

COMMIT;