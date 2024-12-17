# gymmy-website
It is a Gym class website, users can join us by subscribing and paying monthly, and they can book whatever exercise classes they want.


## tech stack
- Using Trello to manage this project  (Link: https://reurl.cc/VEZjzy)
- Python crawler WorldGym classes
- AWS-S3、Cloudfront upload image
- AWS-RDS: MySQL
  - Optimize MySQL tables by index, Foreign Key
  - Implement a Connection Pool for better performance
- Frontend: HTML, CSS, JS, and Bootstrap with RWD
- Backend: node.js express
- Tappay subscription payment ( monthly payment using cron ) 、Paypal subscription payment
- Google API login 
- Using ORM to prevent SQL- Injection 

## web scraping:
<img src="./github-png/class_webScrapingProcess.png" height="250" />

## ER Model
![model](./github-png/ER_model.png)

## Demo
### (NOT maintained)
web: https://gymmy.club

test account： 123@123.com

password： 123

#### Tappay test credit card

Credit Card: 4242 4242 4242 4242

Date: 01/23

CCV: 123

#### Paypal payment account

account 1：sb-tqykd6657530@personal.example.com

account 2：sb-tfbtd6657481@personal.example.com

account 3：sb-eu43ya6701843@personal.example.com


## Page
### 1.Home
![index](./github-png/1-1index.jpeg)

<!-- #### Home RWD:
![index](./github-png/1-2index.jpeg) -->

### 2.Project
![product](./github-png/1-3product.jpeg)

<!-- #### ProjectRWD:
![product](./github-png/1-4product.jpeg) -->

### 3.login
![login](./github-png/2-1login.png)

### 4.signup
![register](./github-png/3-1register.jpeg)

<!-- #### signupRWD:
![register](./github-png/3-2register.jpeg) -->

### 5.pay-Tappay
![payment](./github-png/4-1payment.jpeg)

### 5.pay-Paypal
![payment](./github-png/4-3payment.jpeg)

<!-- #### 付款頁面RWD:
![payment](./github-png/4-2payment.jpeg) -->

### 6.payment finish
![thankyou](./github-png/5-1thankyou.png)

### 7.membership profile
![member](./github-png/6-1member.jpeg)

### 8.classes
![classes](./github-png/7-1classes.jpeg)

<!-- #### classesRWD:
![classes](./github-png/7-2classes.png) -->

### 9.class detail
![class](./github-png/8-1class.jpeg)

<!-- ####class detailRWD:
![class](./github-png/8-2class.jpeg) -->

### 10.bookingclass
![booking](./github-png/9-1booking.png)

### 11.after booking=> profile shows booking info
![member](./github-png/10-1update-mem.jpeg)

<!-- ### profileRWD:
![member](./github-png/10-2update-mem.jpeg) -->

### 12.backend system login
![backside](./github-png/11-1backside-login.jpeg)

### 13.backend system
![backside](./github-png/12-1backside.jpeg)
