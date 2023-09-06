# gymmy-website 健身房預定課程網站

## 網站功能
### 前台： (支援RWD)
1. 查看健身房課程
2. 付款(訂閱制)成為會員
3. 預定課程
4. 會員中心查看預定課程/取消預定課程
5. 查看歷史課程
### 後台：
1. 預定課程管理系統

## 使用技術
- 使用Trello做專案進度管理 （Link : https://reurl.cc/VEZjzy)
- 爬蟲使用python爬取WorldGym健身房的課程
- 雲服務使用AWS的RDS、S3、Cloudfront
- 前端除了 HTML, CSS, JS 之外另搭配Bootstrap
- 後端node.js express框架
- Tappay訂閱制付款(Cron自動排程實作每月付款機制)、Paypal金流串接訂閱制付款 (Cron實作： https://github.com/chiderlin/cron-for-payment)
- google第三方登入api串接
- ORM 資料庫串接
- 部署nginx反向代理、Docker
- SSL憑證實踐HTTPS
- RESTful API 設計架構
- MVC 設計模式

## web scraping:
<img src="./github-png/class_webScrapingProcess.png" align="left" height="250" />



## 實體關係圖(ER Model)
![model](./github-png/ER_model.png)

## Demo
### 已停止維護
web: https://gymmy.club

測試帳號： 123@123.com (或自行註冊)

密碼： 123

#### Tappay 付款卡號

Credit Card: 4242 4242 4242 4242

Date: 01/23

CCV: 123

#### Paypal 付款帳號

帳號1：sb-tqykd6657530@personal.example.com

帳號2：sb-tfbtd6657481@personal.example.com

帳號3：sb-eu43ya6701843@personal.example.com

密碼：?

## 頁面操作瀏覽
### 1.首頁
![index](./github-png/1-1index.jpeg)

<!-- #### 首頁RWD:
![index](./github-png/1-2index.jpeg) -->

### 2.方案頁面
![product](./github-png/1-3product.jpeg)

<!-- #### 方案頁面RWD:
![product](./github-png/1-4product.jpeg) -->

### 3.登入頁面
![login](./github-png/2-1login.png)

### 4.註冊頁面
![register](./github-png/3-1register.jpeg)

<!-- #### 註冊頁面RWD:
![register](./github-png/3-2register.jpeg) -->

### 5.付款頁面-Tappay
![payment](./github-png/4-1payment.jpeg)

### 5.付款頁面-Paypal
![payment](./github-png/4-3payment.jpeg)

<!-- #### 付款頁面RWD:
![payment](./github-png/4-2payment.jpeg) -->

### 6.付款完成頁面
![thankyou](./github-png/5-1thankyou.png)

### 7.會員頁面
![member](./github-png/6-1member.jpeg)

### 8.所有課程頁面
![classes](./github-png/7-1classes.jpeg)

<!-- #### 所有課程頁面RWD:
![classes](./github-png/7-2classes.png) -->

### 9.個別課程介紹
![class](./github-png/8-1class.jpeg)

<!-- #### 個別課程頁面RWD:
![class](./github-png/8-2class.jpeg) -->

### 10.預定課程成功訊息頁面
![booking](./github-png/9-1booking.png)

### 11.預定完成後=> 會員中心頁面顯示預定的課程
![member](./github-png/10-1update-mem.jpeg)

<!-- ### 會員中心頁面RWD:
![member](./github-png/10-2update-mem.jpeg) -->

### 12.後台登入頁面
![backside](./github-png/11-1backside-login.jpeg)

### 13.後台管理頁面
![backside](./github-png/12-1backside.jpeg)
