create database note;
use note;
create table users(id int not null AUTO_INCREMENT, primary key(id), uname varchar(30) not null, pwd varchar(100) not null, avatar varchar(100) not null default 'default');
create table notes(id int not null AUTO_INCREMENT, primary key(id), userid int not null, content text not null, tag varchar(200), `time` varchar(14) not null);
-- insert test data
insert into users (uname, pwd) values ('saber','123');
insert into notes (userid, content, time) values (1, 'saber', '1563088824315');