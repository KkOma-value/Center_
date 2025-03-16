# Center_
my_first_center_code
kkoma的第一个前后端分离项目（有些难看），很多功能不是很完善（并没有选择上线，因为自己太笨了），希望见谅。

项目介绍：基于 Spring Boot 后端 + React 前端的 全栈项目 ，实现了用户注册、登录、查询等基础功能。

技术选型：

前端：主要运用阿里 Ant Design 生态：HTML + CSS + JavaScript 三件套，React 开发框架，Ant Design Pro项目模板，Ant Design 端组件库，Umi 开发框架，Umi Request 请求库

后端：
Java 编程语言，
Spring + SpringMVC + SpringBoot 框架，
MyBatis + MyBatis Plus 数据访问框架，
MySQL 数据库，jUnit 单元测试库

下面为具体展示：

1.登录及注册页面![image](https://github.com/user-attachments/assets/6ef0a9f5-4f75-403c-9915-c5240f225fc0) ![image](https://github.com/user-attachments/assets/a7cefe17-bde1-449a-ae9b-afa2a91e40de)



2.中心页面展示(以管理员为例)（管理员可编辑所有用户的信息，通过API接口直接修改数据库中的对应内容，（以下展示增删改查功能）我们还可以选择导出用户文件）
![image](https://github.com/user-attachments/assets/7667f784-8580-42ec-91f1-980d083fca70)

改：

![image](https://github.com/user-attachments/assets/ac90448d-315a-4b77-ae29-115f656f90a8)
![image](https://github.com/user-attachments/assets/4a7ead6c-1305-4fd7-86c9-6f973b8d0b6e)

查找：

![image](https://github.com/user-attachments/assets/b8ae8a92-ad36-4c48-9b6e-42d4e5f145f3)


删除和批量删除（这里使用了逻辑删除，减少对数据库的操作）：

![image](https://github.com/user-attachments/assets/66b4aef5-02c7-4cef-a30b-8a60465722fc)
![image](https://github.com/user-attachments/assets/7f85fbf2-d230-4006-b444-20ca5af952ad)
![image](https://github.com/user-attachments/assets/a6446397-dc52-42c9-8c6f-0c6ebaac5c5f)
![image](https://github.com/user-attachments/assets/55184981-a6e8-4eda-a4aa-4301efd9a858)

数据库中对应的逻辑删除已被修改：

![image](https://github.com/user-attachments/assets/6faaa7b0-92d3-4be0-a419-fe6b70094eba)

增添用户（注册）：

![image](https://github.com/user-attachments/assets/a2766132-4ec3-4a26-8d44-5616cb8635df)
![image](https://github.com/user-attachments/assets/7d932b5d-e857-4723-9cc3-d8244cd92bcf)


而普通用户是没办法编辑其他用户信息的，但是能见到信息：

![image](https://github.com/user-attachments/assets/15935abc-5e36-40fb-a629-cf75ffca7367)


导出文件：

![image](https://github.com/user-attachments/assets/5f5fe4aa-3a2d-4304-bb32-7be9ad42a923)


以上便是自己的全部内容，虽然很垃圾，但是自己也写了一个多月，若能给到各位参考，我将非常高兴！！！

代码全在master分支下，如有需要请自取。

