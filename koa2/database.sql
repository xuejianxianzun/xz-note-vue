create database if not exists `note` default character set utf8mb4;
use `note`;
create table `users`(`id` int not null AUTO_INCREMENT, primary key(`id`), `uname` varchar(30) not null, `pwd` varchar(100) not null, `email` varchar(100) not null, `avatar` varchar(100) not null default "", `verify` char(6)) default charset = utf8mb4;
create table `notes`(`id` int not null AUTO_INCREMENT, primary key(`id`), `userid` int not null, `content` text not null, `tag` varchar(200), `time` varchar(14) not null) default charset = utf8mb4;