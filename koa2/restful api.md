# restful api 设计

## 获取用户的全部笔记

get

http://localhost:3000/user/${uid}/notes/all

## 获取用户的某个标签的笔记（未使用）

get

http://localhost:3000/user/${uid}/notes?tag=${tagname}

## 新增笔记

post

http://localhost:3000/user/${uid}/notes

## 删除笔记

delete

http://localhost:3000/user/${uid}/notes/${noteid}

## 修改笔记

patch（patch 是局部更新，只需要传递修改的字段。put 是全部更新，需要传递整个资源）

http://localhost:3000/user/${uid}/notes/${noteid}/${field}

## 获取用户的配置信息

http://localhost:3000/user/${uid}/profile/all
