# gymmy-website 健身房預定課程網站

## 網站功能
### 前台：
1. 查看健身房課程
2. 付款(訂閱制)成為會員
3. 預定課程
4. 會員中心查看預定課程/取消預定課程
5. 查看歷史課程
#### 後台：
1. 預定課程管理系統

## 使用技術
- 使用Trello做專案進度管理 （Link : https://reurl.cc/VEZjzy)
- 雲服務多使用AWS的RDS、S3、Cloudfront
- 前端除了 HTML, CSS, JS 之外另搭配Bootstrap
- 後端改用node.js express後端框架
- Tappay訂閱制付款(Cron自動排程實作每月付款機制)、額外增加Paypal金流串接訂閱制付款
- google第三方登入api串接
- jwt 會員系統
- ORM 資料庫串接

## Demo
web: https://gymmy.club

測試帳號： 123@123.com (或自行註冊)

密碼： 123

Credit Card: 4242 4242 4242 4242

Date: 01/23

CCV: 123

## 頁面操作瀏覽
### 1.首頁
![index](./github-png/1-1index.jpeg)

#### 首頁RWD:
![index](./github-png/1-2index.jpeg)

### 2.方案頁面
![product](./github-png/1-3product.jpeg)

#### 方案頁面RWD:
![product](./github-png/1-4product.jpeg)

### 3.登入頁面
![login](./github-png/2-1login.png)

### 4.註冊頁面
![register](./github-png/3-1register.jpeg)

#### 註冊頁面RWD:
![register](./github-png/3-2register.jpeg)

### 5.付款頁面-Tappay
![payment](./github-png/4-1payment.jpeg)

### 5.付款頁面-Paypal
![payment](./github-png/4-3payment.jpeg)

#### 付款頁面RWD:
![payment](./github-png/4-2payment.jpeg)

### 6.付款完成頁面
![thankyou](./github-png/5-1thankyou.png)

### 7.會員頁面
![member](./github-png/6-1member.jpeg)

### 8.所有課程頁面
![classes](./github-png/7-1classes.jpeg)

#### 所有課程頁面RWD:
![classes](./github-png/7-2classes.jpeg)

### 9.個別課程介紹
![class](./github-png/8-1classes.jpeg)

#### 個別課程頁面RWD:
![class](./github-png/8-2classes.jpeg)

### 10.預定課程成功訊息頁面
![booking](./github-png/9-2classes.png)

### 11.預定完成後=> 會員中心頁面顯示預定的課程
![member](./github-png/10-1update-mem.jpeg)

### 會員中心頁面RWD:
![member](./github-png/10-2update-mem.jpeg)

### 12.後台登入頁面
![backside](./github-png/11-1backside-login.jpeg)

### 13.後台管理頁面
![backside](./github-png/12-1backside.jpeg)