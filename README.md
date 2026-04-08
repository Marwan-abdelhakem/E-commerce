# E-Commerce API

## Setup للمطورين الجدد

### 1. Clone المشروع
```bash
git clone <repo-url>
cd E-commerce
npm install
```

### 2. تشغيل MongoDB محلياً
- نصّب MongoDB من [mongodb.com](https://www.mongodb.com/try/download/community)
- أو استخدم Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### 3. تشغيل المشروع
```bash
npm run dev
```

ملف `.env.development` موجود بالفعل مع إعدادات localhost.

### 4. الوصول للـ API Documentation
افتح المتصفح على: `http://localhost:3000/api-docs`

---

## Deployment على Render

### الخطوات المطلوبة:

#### 1. إنشاء MongoDB Atlas Database
1. اذهب إلى [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. أنشئ حساب مجاني
3. أنشئ Cluster جديد
4. في Database Access: أنشئ مستخدم جديد مع username و password
5. في Network Access: أضف `0.0.0.0/0` للسماح بالوصول من أي مكان
6. اضغط على "Connect" واختر "Connect your application"
7. انسخ الـ connection string

#### 2. رفع المشروع على Render
1. ارفع الكود على GitHub
2. اذهب إلى [Render](https://render.com)
3. أنشئ حساب وسجل دخول
4. اضغط "New +" واختر "Web Service"
5. اربط حساب GitHub واختر المشروع
6. املأ البيانات:
   - **Name**: اسم المشروع
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### 3. إضافة Environment Variables في Render
في صفحة الـ Web Service، اذهب لـ "Environment" وأضف:

```
NODE_ENV=production
PORT=3000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/E-commerce
JWT_SECRET=your_strong_secret_key_here
SALT=12
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**مهم:** لازم تضيف `NODE_ENV=production` عشان Render يستخدم Environment Variables بدل الملف المحلي.

#### 4. Deploy
اضغط "Create Web Service" وانتظر حتى يكتمل الـ deployment

---

## ملاحظات

- `.env.development` مرفوع على Git وفيه إعدادات localhost فقط
- Production يستخدم Environment Variables من Render Dashboard (أكثر أماناً)
