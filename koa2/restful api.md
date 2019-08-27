## 获取用户的全部笔记

get

http://localhost:3000/api/v2/notes/all

## 获取用户的某个 tag 的笔记

get

http://localhost:3000/api/v2/notes/tag/${tagname}

这个 api 没有实现，因为前台在登陆后会获取全部笔记，所以这个操作是在前台完成的。

## 新增笔记

post

http://localhost:3000/api/v2/notes

## 删除笔记

delete

http://localhost:3000/api/v2/notes/${noteid}

## 修改笔记

patch

http://localhost:3000/api/v2/notes/${noteid}/${field}

patch 是局部更新，只需要传递修改的字段。put 是全部更新，需要传递整个资源。

## 搜索笔记

get

http://localhost:3000/api/v2/notes/search/${word}

这个 api 没有实现，原因同上。

## 导出笔记

http://localhost:3000/api/v2/notes/export

这个 api 没有实现，原因同上。

## 获取用户的配置信息

get

http://localhost:3000/api/v2/user/profile/all

## 修改用户的某项配置

patch

http://localhost:3000/api/v2/user/profile/${field}

## 发送验证码

get

http://localhost:3000/api/v2/user/profile/verification

## 核对验证码

post

http://localhost:3000/api/v2/user/profile/verification

## 找回密码

http://localhost:3000/api/v2/user/profile/found/${user}

## 重置密码