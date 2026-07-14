# 📚 پلتفرم آزمون آنلاین (Exam Platform)

پروژه‌ی درس طراحی صفحات وب پیشرفته - دانشکده مهاجر اصفهان

[![Laravel](https://img.shields.io/badge/Laravel-10.x-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org)
[![PHP](https://img.shields.io/badge/PHP-8.2+-purple.svg)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://mysql.com)

---

## 📖 معرفی پروژه

پلتفرم آزمون آنلاین یک سیستم جامع برای برگزاری، مدیریت و ارزیابی آزمون‌های آنلاین است که با هدف تسهیل فرآیند آموزش و ارزشیابی در محیط‌های آموزشی طراحی و پیاده‌سازی شده است. این پروژه به عنوان پروژه‌ی درس «طراحی صفحات وب پیشرفته» در دانشکده مهاجر اصفهان تهیه شده است.

سیستم از دو نقش اصلی **`استاد`** و **`دانشجو`** پشتیبانی می‌کند و امکانات کامل مدیریت آزمون، سوالات، نتایج و گزارش‌گیری را در اختیار کاربران قرار می‌دهد.

---

## ✨ قابلیت‌های اصلی

### 👨‍🏫 قابلیت‌های استاد
- **`مدیریت آزمون‌ها`**: ایجاد، ویرایش، حذف و برگزاری آزمون‌ها
- **`مدیریت سوالات`**: ایجاد سوالات چندگزینه‌ای، صحیح/غلط و تشریحی با تعیین نمره و پاسخ صحیح
- **`مدیریت شرکت‌کنندگان`**: انتخاب دانشجویان واجد شرایط برای هر آزمون
- **`مدیریت سوالات آزمون`**: انتخاب سوالات مورد نظر از بانک سوالات شخصی
- **`برگزاری آزمون`**: امکان برگزاری آزمون در زمان تعیین‌شده و تغییر وضعیت به «درحال برگزاری»
- **`مشاهده نتایج`**: نمایش پاسخ‌ها و نمرات دانشجویان به تفکیک هر آزمون
- **`گزارش‌گیری`**: مشاهده آمار و تحلیل عملکرد دانشجویان

### 👨‍🎓 قابلیت‌های دانشجو
- **`مشاهده آزمون‌ها`**: مشاهده لیست آزمون‌های فعال و درحال برگزاری
- **`شرکت در آزمون`**: ورود به آزمون و پاسخ‌دهی به سوالات با تایمر هوشمند
- **`ارسال پاسخ‌ها`**: ثبت خودکار پاسخ‌ها در پایان زمان یا به‌صورت دستی
- **`مشاهده نتایج`**: مشاهده نمره، پاسخ‌ها و بازخورد سوالات پس از اتمام آزمون

---

## 🛠️ تکنولوژی‌های استفاده‌شده

### ⚙️ بک‌اند (Backend)

| فناوری | توضیح |
|--------|-------|
| `Laravel 10` | فریمورک اصلی برای توسعه بک‌اند |
| `PHP 8.2+` | زبان برنامه‌نویسی اصلی |
| `MySQL 8.0` | پایگاه داده رابطه‌ای |
| `Eloquent ORM` | لایه‌ی اتصال به دیتابیس با قابلیت مدل‌سازی پیشرفته |
| `Laravel Sanctum` | احراز هویت مبتنی بر توکن (API Authentication) |
| `Laravel Breeze` | سیستم احراز هویت و ثبت‌نام (Authentication Scaffold) |

### 🎨 فرانت‌اند (Frontend - SPA)

| فناوری | توضیح |
|--------|-------|
| `React 18` | کتابخانه‌ی اصلی برای ساخت رابط کاربری (Single Page Application) |
| `Material-UI (MUI) v5` | کتابخانه‌ی کامپوننت‌های واکنش‌گرا و زیبا |
| `Axios` | ارسال درخواست‌های HTTP به سرور |
| `Formik` | مدیریت فرم‌ها و اعتبارسنجی |
| `Yup` | اعتبارسنجی داده‌های فرم |
| `React Toastify` | نمایش پیام‌های اعلان (Notification) |
| `Observable Plot` | رسم نمودارهای آماری (برای نمایش نتایج) |

### 🧩 ابزارهای توسعه

| فناوری | توضیح |
|--------|-------|
| `Vite` | ابزار بیلد و توسعه‌ی سریع |
| `ESLint` | بررسی کیفیت کد جاوااسکریپت |
| `Git` | کنترل نسخه |

---

## 🗄️ ساختار دیتابیس

### 📋 نمودار Entity-Relationship (ER)

<div dir="ltr">

```
┌─────────────────────────────────────────────────────────────────────┐
│                         users                                      │
├──────────────┬──────────────┬─────────────────────────────────────┤
│ id (PK)      │ name         │ email                              │
│ role         │ password     │ university_id                      │
└──────┬───────┴──────┬───────┴─────────────────────────────────────┘
       │              │
       │              │
       ▼              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         exams                                      │
├──────────────┬──────────────┬─────────────────────────────────────┤
│ id (PK)      │ title        │ slug                               │
│ description  │ exam_date    │ start_time                         │
│ duration_min │ question_count│ total_score                        │
│ category     │ status       │ question_selection_type            │
│ allow_download│ detailed_feedback│ created_by (FK → users.id)   │
└──────┬───────┴──────┬───────┴─────────────────────────────────────┘
       │              │
       │              │
       ▼              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    exam_questions                                  │
├──────────────┬──────────────┬─────────────────────────────────────┤
│ exam_id (FK) │ question_id (FK) │ order                          │
└──────┬───────┴──────┬───────┴─────────────────────────────────────┘
       │              │
       │              ▼
       │      ┌─────────────────────────────────────────────────────┐
       │      │                    questions                        │
       │      ├──────────────┬──────────────┬─────────────────────┤
       │      │ id (PK)      │ text          │ type               │
       │      │ options      │ correct_answer │ score              │
       │      │ explanation  │ created_by (FK → users.id)         │
       │      └──────────────┴──────────────┴─────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     exam_users                                      │
├──────────────┬──────────────┬─────────────────────────────────────┤
│ exam_id (FK) │ user_id (FK) │ status                             │
│ score        │ started_at   │ finished_at                        │
└──────┬───────┴──────┬───────┴─────────────────────────────────────┘
       │              │
       │              ▼
       │      ┌─────────────────────────────────────────────────────┐
       │      │                    answers                          │
       │      ├──────────────┬──────────────┬─────────────────────┤
       │      │ id (PK)      │ exam_id (FK) │ user_id (FK)        │
       │      │ question_id (FK) │ selected_answer                  │
       │      │ is_correct   │ time_spent_seconds                   │
       │      └──────────────┴──────────────┴─────────────────────┘
       │
       └──────────────────────────────────────────────────────────────┘
```

</div>

### 📊 توضیحات جداول

| نام جدول | توضیح |
|----------|-------|
| `users` | اطلاعات کاربران (استاد و دانشجو) شامل `role` برای تشخیص نقش |
| `exams` | اطلاعات آزمون‌ها شامل عنوان، تاریخ، زمان، مدت، تعداد سوالات، نمره کل، وضعیت و ... |
| `questions` | سوالات ایجادشده توسط اساتید با نوع (چندگزینه‌ای، صحیح/غلط، تشریحی) و پاسخ صحیح |
| `exam_questions` | رابطه‌ی چندبه‌چند بین آزمون‌ها و سوالات با ترتیب قرارگیری سوالات |
| `exam_users` | رابطه‌ی چندبه‌چند بین آزمون‌ها و کاربران (دانشجویان) با وضعیت شرکت و نمره |
| `answers` | پاسخ‌های ثبت‌شده توسط دانشجویان برای هر سوال در هر آزمون |

---

## 🧩 مدل‌های اصلی (Models)

### `User`

مدل کاربر با قابلیت تشخیص نقش (استاد/دانشجو) و روابط با آزمون‌ها و پاسخ‌ها.

<div dir="ltr">

```php
// متدهای کلیدی
public function isTeacher()
public function isStudent()
public function examsAsStudent()
public function examsAsTeacher()
```

</div>

### `Exam`

مدل آزمون با روابط چندبه‌چند با کاربران و سوالات و متدهای کمکی برای مدیریت وضعیت و محاسبه نمره.

<div dir="ltr">

```php
// متدهای کلیدی
public function students()          // دانشجویان شرکت‌کننده
public function questions()          // سوالات مرتبط
public function scopeActive()        // فیلتر آزمون‌های فعال
public function calculateStudentScore($userId)  // محاسبه نمره دانشجو
```

</div>

### `Question`

مدل سوال با پشتیبانی از انواع مختلف (گزینه‌ای، صحیح/غلط، تشریحی).

<div dir="ltr">

```php
// متدهای کلیدی
public function isAnswerCorrect($userAnswer)   // بررسی صحت پاسخ
public function scopeMultipleChoice()           // فیلتر سوالات گزینه‌ای
```

</div>

### `Answer`

مدل پاسخ ثبت‌شده توسط دانشجو برای هر سوال.

### `ExamUser`

مدل واسط (Pivot) برای ثبت وضعیت و نمره دانشجو در هر آزمون.

### `ExamQuestion`

مدل واسط (Pivot) برای ثبت ترتیب سوالات در هر آزمون.

---

## 🎮 کنترلرهای اصلی (Controllers)

### `ExamController`

کنترلر اصلی مدیریت آزمون‌ها با متدهای زیر:

| متد | مسیر | توضیح |
|-----|------|-------|
| `index` | `GET /exams` | نمایش لیست آزمون‌ها (بر اساس نقش کاربر) |
| `create` | `GET /exams/create` | نمایش فرم ایجاد آزمون (فقط استاد) |
| `store` | `POST /exams` | ذخیره‌ی آزمون جدید |
| `show` | `GET /exams/{slug}` | نمایش جزئیات یک آزمون |
| `edit` | `GET /exams/{slug}/edit` | نمایش فرم ویرایش آزمون (فقط استاد) |
| `update` | `PUT /exams/{slug}` | به‌روزرسانی آزمون |
| `destroy` | `DELETE /exams/{slug}` | حذف آزمون |
| `manageExam` | `GET /exams/{slug}/manage-exam` | صفحه مدیریت آزمون (انتخاب دانشجو و سوال) |
| `updateExamManagement` | `POST /exams/{slug}/manage-exam` | ذخیره تغییرات مدیریت آزمون و فعال‌سازی |
| `conductExam` | `POST /exams/{slug}/conduct` | برگزاری آزمون (تغییر وضعیت به «درحال برگزاری») |
| `start` | `GET /exams/{slug}/start` | شروع آزمون توسط دانشجو |
| `submit` | `POST /exams/{slug}/submit` | ثبت پاسخ‌های دانشجو |
| `endExam` | `POST /exams/{slug}/end` | پایان آزمون (توسط تایمر یا دانشجو) |
| `showResult` | `GET /exams/{slug}/result` | نمایش نتیجه‌ی یک آزمون |
| `myResults` | `GET /my-results` | نمایش نتایج آزمون‌های دانشجو |
| `allResults` | `GET /results` | نمایش همه نتایج (فقط استاد) |

### `QuestionController`

کنترلر مدیریت سوالات با متدهای CRUD کامل برای ایجاد، ویرایش، نمایش و حذف سوالات.

### `DashboardController`

کنترلر داشبورد با نمایش آمار و ارقام بر اساس نقش کاربر.

### `ReportController`

کنترلر گزارش‌گیری با نمایش تحلیل عملکرد و آمار آزمون‌ها.

---

## 🔐 اسکافولد امنیتی (Security Scaffolding)

### میدل‌ورهای (Middleware) استفاده‌شده

| میدل‌ور | کاربرد |
|---------|--------|
| `auth` | احراز هویت کاربران برای دسترسی به صفحات محافظت‌شده |
| `web` | میدل‌ور پیش‌فرض برای روت‌های وب با مدیریت سشن |
| `auth:sanctum` | احراز هویت مبتنی بر توکن برای درخواست‌های API |

### احراز هویت (Authentication)

- **سیستم احراز هویت**: `Laravel Sanctum` برای مدیریت توکن‌های API و احراز هویت مبتنی بر سشن
- **اسکافولد**: `Laravel Breeze` برای صفحات ورود، ثبت‌نام و بازیابی رمز عبور
- **گیت‌ها (Gates) و پالیسی‌ها (Policies)**:
  - بررسی دسترسی‌های مبتنی بر نقش (`isTeacher`, `isStudent`)
  - بررسی مالکیت منابع (`authorizeOwner`)

### محافظت‌های امنیتی

| ویژگی | توضیح |
|-------|-------|
| **CSRF Protection** | محافظت در برابر حملات CSRF با استفاده از توکن‌های اختصاصی |
| **XSS Prevention** | جلوگیری از حملات تزریق کد با استفاده از `@json` با پرچم‌های `JSON_HEX_*` |
| **SQL Injection Prevention** | استفاده از Eloquent ORM و Parameter Binding برای جلوگیری از تزریق SQL |
| **Route Model Binding** | استفاده از `{exam:slug}` برای جلوگیری از دسترسی به رکوردهای غیرمجاز |

---

## 🎨 معماری فرانت‌اند (Frontend Architecture)

### ساختار SPA (Single Page Application)

پروژه از معماری **SPA** با استفاده از **React** و **Vite** بهره می‌برد. تمام صفحات به‌صورت کامپوننت‌های React پیاده‌سازی شده‌اند و ارتباط با سرور از طریق **Axios** انجام می‌شود.

### ساختار پوشه‌های React

<div dir="ltr">

```
resources/js/
├── Components/          # کامپوننت‌های قابل استفاده مجدد
│   ├── ExamForm.jsx     # فرم ایجاد/ویرایش آزمون
│   ├── QuestionForm.jsx # فرم ایجاد/ویرایش سوال
│   └── Timer.jsx        # کامپوننت تایمر
├── Layouts/             # لایه‌های اصلی
│   └── AuthenticatedLayout.jsx # لایه‌ی احراز هویت‌شده با منوی کناری
├── Pages/               # صفحات اصلی
│   ├── Exams/           # صفحات مربوط به آزمون‌ها
│   │   ├── ExamsIndex.jsx
│   │   ├── CreateExam.jsx
│   │   ├── EditExam.jsx
│   │   ├── ShowExam.jsx
│   │   ├── TakeExam.jsx
│   │   ├── ManageExam.jsx
│   │   ├── ExamResult.jsx
│   │   └── MyResults.jsx
│   ├── Questions/       # صفحات مربوط به سوالات
│   │   ├── QuestionsIndex.jsx
│   │   ├── CreateQuestion.jsx
│   │   ├── EditQuestion.jsx
│   │   └── ShowQuestion.jsx
│   ├── Dashboard.jsx    # داشبورد کاربر
│   ├── HomePage.jsx     # صفحه اصلی
│   ├── Login.jsx        # صفحه ورود
│   └── Register.jsx     # صفحه ثبت‌نام
└── app.jsx              # نقطه‌ی ورود React
```

</div>

### کامپوننت‌های کلیدی

| کامپوننت | توضیح |
|----------|-------|
| `AuthenticatedLayout` | لایه‌ی اصلی با منوی کناری (Drawer) و هدر برای کاربران احراز هویت‌شده |
| `ExamForm` | فرم جامع ایجاد/ویرایش آزمون با استفاده از Formik و Yup |
| `QuestionForm` | فرم ایجاد/ویرایش سوال با پشتیبانی از انواع مختلف |
| `Timer` | تایمر شمارش معکوس برای آزمون‌ها با هشدار زمان |
| `ManageExam` | صفحه‌ی مدیریت آزمون برای انتخاب دانشجوها و سوالات |

### کتابخانه‌های خاص (Special Libraries)

| کتابخانه | کاربرد |
|----------|--------|
| `@mui/material` | کامپوننت‌های آماده و زیبا با پشتیبانی از RTL |
| `@observablehq/plot` | رسم نمودارهای دایره‌ای برای نمایش نتایج آزمون |
| `react-toastify` | نمایش پیام‌های اعلان (Success, Error, Warning) |
| `formik` | مدیریت فرم‌ها با اعتبارسنجی پیشرفته |
| `yup` | اعتبارسنجی داده‌های فرم با استفاده از Schema |

---

## 🚀 نصب و راه‌اندازی (Installation & Setup)

### پیش‌نیازها (Prerequisites)

- PHP 8.2 یا بالاتر
- Composer
- Node.js 18 یا بالاتر
- MySQL 8.0 یا بالاتر

### مراحل نصب (Installation Steps)

<div dir="ltr">

```bash
# 1. کلون کردن پروژه
git clone https://github.com/Moein-03/exam-platform.git
cd exam-platform

# 2. نصب وابستگی‌های PHP
composer install

# 3. کپی فایل محیطی
cp .env.example .env

# 4. تولید کلید اپلیکیشن
php artisan key:generate

# 5. تنظیمات دیتابیس در فایل .env

# 6. اجرای مایگریشن‌ها
php artisan migrate

# 7. نصب وابستگی‌های Node.js
npm install

# 8. بیلد کردن فرانت‌اند
npm run build

# 9. اجرای سرور توسعه
php artisan serve
npm run dev  # در ترمینال جداگانه
```

</div>

### مسیرهای اصلی (Main Routes)

| مسیر | توضیح |
|------|-------|
| `/` | صفحه اصلی (Home) |
| `/login` | صفحه ورود |
| `/register` | صفحه ثبت‌نام |
| `/dashboard` | داشبورد کاربر |
| `/exams` | لیست آزمون‌ها |
| `/exams/create` | ایجاد آزمون جدید |
| `/exams/{slug}` | نمایش آزمون |
| `/exams/{slug}/edit` | ویرایش آزمون |
| `/exams/{slug}/manage-exam` | مدیریت آزمون |
| `/exams/{slug}/start` | شروع آزمون |
| `/exams/{slug}/result` | مشاهده نتیجه |
| `/questions` | لیست سوالات |
| `/questions/create` | ایجاد سوال جدید |
| `/my-results` | نتایج آزمون‌های دانشجو |
| `/results` | همه نتایج (فقط استاد) |

---

## 📌 نکات اضافی (Additional Notes)

### وضعیت‌های آزمون (Exam Status)

| وضعیت | توضیح |
|-------|-------|
| **پیش‌نویس** | آزمون در حال ویرایش و هنوز منتشر نشده است |
| **فعال** | آزمون آماده‌ی برگزاری است (استاد می‌تواند برگزار کند) |
| **درحال برگزاری** | آزمون در حال برگزاری است و دانشجویان می‌توانند شرکت کنند |
| **اتمام آزمون** | آزمون به پایان رسیده و دیگر قابل شرکت نیست |

### وضعیت‌های شرکت دانشجو (Student Participation Status)

| وضعیت | توضیح |
|-------|-------|
| **in_progress** | دانشجو در حال پاسخ‌دهی به آزمون است |
| **finished** | دانشجو آزمون را به پایان رسانده است |

### نوع سوالات (Question Types)

| نوع | توضیح |
|-----|-------|
| **multiple_choice** | سوال چهارگزینه‌ای با انتخاب یک گزینه |
| **true_false** | سوال صحیح/غلط |
| **essay** | سوال تشریحی با پاسخ متنی |

### منطقه زمانی (Timezone)

پروژه از منطقه زمانی **`Asia/Tehran`** برای تطابق با ساعت ایران استفاده می‌کند.

---

## 🤝 مشارکت (Contributing)

برای مشارکت در توسعه‌ی این پروژه، لطفاً مراحل زیر را دنبال کنید:

1. Fork کردن مخزن
2. ایجاد یک شاخه‌ی جدید (`git checkout -b feature/your-feature`)
3. اعمال تغییرات و commit کردن (`git commit -m 'Add some feature'`)
4. Push کردن به شاخه (`git push origin feature/your-feature`)
5. ایجاد Pull Request

---

## 📄 مجوز (License)

این پروژه تحت مجوز **MIT** منتشر شده است.

---

## 📞 ارتباط با توسعه‌دهنده

- **نام**: معین خسروی
- **ایمیل**: [moeinkhosravi4680@gmail.com](mailto:moeinkhosravi4680@gmail.com)
- **گیت‌هاب**: [github.com/Moein-03](https://github.com/Moein-03)

---

# 📚 Online Exam Platform

Advanced Web Page Design Course Project - Isfahan Mohajer University

[![Laravel](https://img.shields.io/badge/Laravel-10.x-red.svg)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org)
[![PHP](https://img.shields.io/badge/PHP-8.2+-purple.svg)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://mysql.com)

---

## 📖 Project Introduction

The Online Exam Platform is a comprehensive system for conducting, managing, and evaluating online exams, designed to facilitate the teaching and assessment process in educational environments. This project has been developed as the final project for the "Advanced Web Page Design" course at Isfahan Mohajer University.

The system supports two main roles: **Teacher** and **Student**, providing complete features for managing exams, questions, results, and reporting.

---

## ✨ Key Features

### 👨‍🏫 Teacher Features
- **Exam Management**: Create, edit, delete, and conduct exams
- **Question Management**: Create multiple-choice, true/false, and essay questions with score and correct answer assignment
- **Participant Management**: Select eligible students for each exam
- **Exam Question Management**: Select questions from the personal question bank
- **Exam Conducting**: Ability to conduct exams at the scheduled time and change status to "Ongoing"
- **Result Viewing**: Display student answers and scores for each exam
- **Reporting**: View statistics and student performance analysis

### 👨‍🎓 Student Features
- **View Exams**: View list of active and ongoing exams
- **Take Exams**: Enter exams and answer questions with a smart timer
- **Submit Answers**: Auto-submit answers when time expires or manually
- **View Results**: View scores, answers, and question feedback after exam completion

---

## 🛠️ Technologies Used

### ⚙️ Backend

| Technology | Description |
|------------|-------------|
| **Laravel 10** | Main framework for backend development |
| **PHP 8.2+** | Primary programming language |
| **MySQL 8.0** | Relational database |
| **Eloquent ORM** | Database connection layer with advanced modeling |
| **Laravel Sanctum** | Token-based authentication (API Authentication) |
| **Laravel Breeze** | Authentication and registration system (Authentication Scaffold) |

### 🎨 Frontend (SPA)

| Technology | Description |
|------------|-------------|
| **React 18** | Main library for building user interface (Single Page Application) |
| **Material-UI (MUI) v5** | Library of responsive and beautiful components |
| **Axios** | Sending HTTP requests to the server |
| **Formik** | Form management and validation |
| **Yup** | Form data validation |
| **React Toastify** | Notification message display |
| **Observable Plot** | Statistical chart drawing (for results display) |

### 🧩 Development Tools

| Technology | Description |
|------------|-------------|
| **Vite** | Fast build and development tool |
| **ESLint** | JavaScript code quality checker |
| **Git** | Version control |

---

## 🗄️ Database Structure

### 📋 Entity-Relationship Diagram (ER)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         users                                      │
├──────────────┬──────────────┬─────────────────────────────────────┤
│ id (PK)      │ name         │ email                              │
│ role         │ password     │ university_id                      │
└──────┬───────┴──────┬───────┴─────────────────────────────────────┘
       │              │
       │              │
       ▼              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         exams                                      │
├──────────────┬──────────────┬─────────────────────────────────────┤
│ id (PK)      │ title        │ slug                               │
│ description  │ exam_date    │ start_time                         │
│ duration_min │ question_count│ total_score                        │
│ category     │ status       │ question_selection_type            │
│ allow_download│ detailed_feedback│ created_by (FK → users.id)   │
└──────┬───────┴──────┬───────┴─────────────────────────────────────┘
       │              │
       │              │
       ▼              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    exam_questions                                  │
├──────────────┬──────────────┬─────────────────────────────────────┤
│ exam_id (FK) │ question_id (FK) │ order                          │
└──────┬───────┴──────┬───────┴─────────────────────────────────────┘
       │              │
       │              ▼
       │      ┌─────────────────────────────────────────────────────┐
       │      │                    questions                        │
       │      ├──────────────┬──────────────┬─────────────────────┤
       │      │ id (PK)      │ text          │ type               │
       │      │ options      │ correct_answer │ score              │
       │      │ explanation  │ created_by (FK → users.id)         │
       │      └──────────────┴──────────────┴─────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     exam_users                                      │
├──────────────┬──────────────┬─────────────────────────────────────┤
│ exam_id (FK) │ user_id (FK) │ status                             │
│ score        │ started_at   │ finished_at                        │
└──────┬───────┴──────┬───────┴─────────────────────────────────────┘
       │              │
       │              ▼
       │      ┌─────────────────────────────────────────────────────┐
       │      │                    answers                          │
       │      ├──────────────┬──────────────┬─────────────────────┤
       │      │ id (PK)      │ exam_id (FK) │ user_id (FK)        │
       │      │ question_id (FK) │ selected_answer                  │
       │      │ is_correct   │ time_spent_seconds                   │
       │      └──────────────┴──────────────┴─────────────────────┘
       │
       └──────────────────────────────────────────────────────────────┘
```

### 📊 Table Descriptions

| Table Name | Description |
|------------|-------------|
| **users** | User information (teachers and students) including `role` field for role detection |
| **exams** | Exam information including title, date, time, duration, question count, total score, status, etc. |
| **questions** | Questions created by teachers with type (multiple-choice, true/false, essay) and correct answer |
| **exam_questions** | Many-to-many relationship between exams and questions with question ordering |
| **exam_users** | Many-to-many relationship between exams and users (students) with participation status and score |
| **answers** | Student answers recorded for each question in each exam |

---

## 🧩 Main Models

### `User`

User model with role detection capability (Teacher/Student) and relationships with exams and answers.

```php
// Key methods
public function isTeacher()
public function isStudent()
public function examsAsStudent()
public function examsAsTeacher()
```

### `Exam`

Exam model with many-to-many relationships with users and questions, and helper methods for status management and score calculation.

```php
// Key methods
public function students()          // Participating students
public function questions()          // Related questions
public function scopeActive()        // Filter active exams
public function calculateStudentScore($userId)  // Calculate student score
```

### `Question`

Question model supporting various types (multiple-choice, true/false, essay).

```php
// Key methods
public function isAnswerCorrect($userAnswer)   // Check answer correctness
public function scopeMultipleChoice()           // Filter multiple-choice questions
```

### `Answer`

Model for student answers recorded for each question.

### `ExamUser`

Pivot model for recording student status and score in each exam.

### `ExamQuestion`

Pivot model for recording question order in each exam.

---

## 🎮 Main Controllers

### `ExamController`

Main exam management controller with the following methods:

| Method | Route | Description |
|--------|-------|-------------|
| `index` | `GET /exams` | Display exam list (based on user role) |
| `create` | `GET /exams/create` | Show exam creation form (teacher only) |
| `store` | `POST /exams` | Save new exam |
| `show` | `GET /exams/{slug}` | Show exam details |
| `edit` | `GET /exams/{slug}/edit` | Show exam edit form (teacher only) |
| `update` | `PUT /exams/{slug}` | Update exam |
| `destroy` | `DELETE /exams/{slug}` | Delete exam |
| `manageExam` | `GET /exams/{slug}/manage-exam` | Exam management page (select students and questions) |
| `updateExamManagement` | `POST /exams/{slug}/manage-exam` | Save management changes and activate exam |
| `conductExam` | `POST /exams/{slug}/conduct` | Conduct exam (change status to "Ongoing") |
| `start` | `GET /exams/{slug}/start` | Start exam by student |
| `submit` | `POST /exams/{slug}/submit` | Submit student answers |
| `endExam` | `POST /exams/{slug}/end` | End exam (by timer or student) |
| `showResult` | `GET /exams/{slug}/result` | Show exam result |
| `myResults` | `GET /my-results` | Show student's exam results |
| `allResults` | `GET /results` | Show all results (teacher only) |

### `QuestionController`

Question management controller with full CRUD methods for creating, editing, viewing, and deleting questions.

### `DashboardController`

Dashboard controller displaying statistics and metrics based on user role.

### `ReportController`

Reporting controller displaying performance analysis and exam statistics.

---

## 🔐 Security Scaffolding

### Middleware Used

| Middleware | Purpose |
|------------|---------|
| **`auth`** | User authentication for accessing protected pages |
| **`web`** | Default middleware for web routes with session management |
| **`auth:sanctum`** | Token-based authentication for API requests |

### Authentication

- **Authentication System**: **Laravel Sanctum** for API token management and session-based authentication
- **Scaffold**: **Laravel Breeze** for login, registration, and password reset pages
- **Gates and Policies**:
  - Role-based access control (`isTeacher`, `isStudent`)
  - Resource ownership verification (`authorizeOwner`)

### Security Protections

| Feature | Description |
|---------|-------------|
| **CSRF Protection** | Protection against CSRF attacks using dedicated tokens |
| **XSS Prevention** | Protection against code injection attacks using `@json` with `JSON_HEX_*` flags |
| **SQL Injection Prevention** | Using Eloquent ORM and Parameter Binding to prevent SQL injection |
| **Route Model Binding** | Using `{exam:slug}` to prevent unauthorized access to records |

---

## 🎨 Frontend Architecture

### SPA (Single Page Application) Architecture

The project uses **SPA** architecture with **React** and **Vite**. All pages are implemented as React components, and communication with the server is done through **Axios**.

### React Folder Structure

```
resources/js/
├── Components/          # Reusable components
│   ├── ExamForm.jsx     # Exam create/edit form
│   ├── QuestionForm.jsx # Question create/edit form
│   └── Timer.jsx        # Timer component
├── Layouts/             # Main layouts
│   └── AuthenticatedLayout.jsx # Authenticated layout with sidebar
├── Pages/               # Main pages
│   ├── Exams/           # Exam-related pages
│   │   ├── ExamsIndex.jsx
│   │   ├── CreateExam.jsx
│   │   ├── EditExam.jsx
│   │   ├── ShowExam.jsx
│   │   ├── TakeExam.jsx
│   │   ├── ManageExam.jsx
│   │   ├── ExamResult.jsx
│   │   └── MyResults.jsx
│   ├── Questions/       # Question-related pages
│   │   ├── QuestionsIndex.jsx
│   │   ├── CreateQuestion.jsx
│   │   ├── EditQuestion.jsx
│   │   └── ShowQuestion.jsx
│   ├── Dashboard.jsx    # User dashboard
│   ├── HomePage.jsx     # Home page
│   ├── Login.jsx        # Login page
│   └── Register.jsx     # Registration page
└── app.jsx              # React entry point
```

### Key Components

| Component | Description |
|-----------|-------------|
| **`AuthenticatedLayout`** | Main layout with sidebar (Drawer) and header for authenticated users |
| **`ExamForm`** | Comprehensive exam create/edit form using Formik and Yup |
| **`QuestionForm`** | Question create/edit form supporting various types |
| **`Timer`** | Countdown timer for exams with time warnings |
| **`ManageExam`** | Exam management page for selecting students and questions |

### Special Libraries

| Library | Purpose |
|---------|---------|
| **`@mui/material`** | Ready-to-use beautiful components with RTL support |
| **`@observablehq/plot`** | Drawing pie charts for exam results display |
| **`react-toastify`** | Display notification messages (Success, Error, Warning) |
| **`formik`** | Form management with advanced validation |
| **`yup`** | Form data validation using Schema |

---

## 🚀 Installation & Setup

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- MySQL 8.0 or higher

### Installation Steps

```bash
# 1. Clone the project
git clone https://github.com/Moein-03/exam-platform.git
cd exam-platform

# 2. Install PHP dependencies
composer install

# 3. Copy environment file
cp .env.example .env

# 4. Generate application key
php artisan key:generate

# 5. Configure database in .env file

# 6. Run migrations
php artisan migrate

# 7. Install Node.js dependencies
npm install

# 8. Build frontend
npm run build

# 9. Run development server
php artisan serve
npm run dev  # in a separate terminal
```

### Main Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/login` | Login page |
| `/register` | Registration page |
| `/dashboard` | User dashboard |
| `/exams` | Exam list |
| `/exams/create` | Create new exam |
| `/exams/{slug}` | View exam |
| `/exams/{slug}/edit` | Edit exam |
| `/exams/{slug}/manage-exam` | Manage exam |
| `/exams/{slug}/start` | Start exam |
| `/exams/{slug}/result` | View result |
| `/questions` | Question list |
| `/questions/create` | Create new question |
| `/my-results` | Student exam results |
| `/results` | All results (teacher only) |

---

## 📌 Additional Notes

### Exam Statuses

| Status | Description |
|--------|-------------|
| **پیش‌نویس (Draft)** | Exam is being edited and not yet published |
| **فعال (Active)** | Exam is ready to be conducted (teacher can conduct) |
| **درحال برگزاری (Ongoing)** | Exam is currently being conducted; students can participate |
| **اتمام آزمون (Finished)** | Exam has ended and is no longer available |

### Student Participation Statuses

| Status | Description |
|--------|-------------|
| **in_progress** | Student is currently answering the exam |
| **finished** | Student has completed the exam |

### Question Types

| Type | Description |
|------|-------------|
| **multiple_choice** | Multiple-choice question with one correct option |
| **true_false** | True/False question |
| **essay** | Essay question with text answer |

### Timezone

The project uses **`Asia/Tehran`** timezone to match Iran's local time.

---

## 🤝 Contributing

To contribute to this project's development, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make changes and commit (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request

---

## 📄 License

This project is released under the **MIT** license.

---

## 📞 Contact the Developer

- **Name**: Moein Khosravi
- **Email**: [moeinkhosravi4680@gmail.com](mailto:moeinkhosravi4680@gmail.com)
- **GitHub**: [github.com/Moein-03](https://github.com/Moein-03)