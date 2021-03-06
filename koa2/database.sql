create database if not exists `note` default character set utf8mb4 COLLATE = utf8mb4_unicode_ci;
use `note`;
create table `users`(`id` int not null AUTO_INCREMENT, primary key(`id`), `name` varchar(30) not null, `pwd` varchar(100) not null, `email` varchar(100) not null, `avatar` varchar(100) not null default "", `verify` varchar(32), `verifytime` varchar(14)) default charset = utf8mb4 COLLATE utf8mb4_general_ci;
create table `notes`(`id` int not null AUTO_INCREMENT, primary key(`id`), `userid` int not null, `content` text not null, `tag` varchar(200), `time` varchar(14) not null) default charset = utf8mb4 COLLATE utf8mb4_general_ci;
create table `regist`(`id` int not null AUTO_INCREMENT, primary key(`id`), `name` varchar(30) not null, `pwd` varchar(100) not null, `email` varchar(100) not null, `verify` varchar(32), `verifytime` varchar(14)) default charset = utf8mb4 COLLATE utf8mb4_general_ci;
