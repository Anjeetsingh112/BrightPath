# 📚 BrightPath

[🌐 **Live Demo**](https://brightpath-bil5.onrender.com)

BrightPath is a modern, full-stack **Learning Management System (LMS)**. It provides secure authentication, smooth course management, online payments, and an intuitive UI built with **Shadcn UI** components.

---

## 🚀 Features

- 🔐 **Authentication** — Secure login with JWT.
- 🔒 **Password Hashing** — User passwords protected with `bcryptjs`.
- ☁️ **File Uploads** — Upload and manage media files via `multer` and **Cloudinary**.
- 🧾 **Payments** — Integrated online payments with **Razorpay**.
- 🍪 **Cookie Management** — `cookie-parser` for handling user sessions.
- 🔄 **CORS** — Cross-origin resource sharing for safe API calls.
- ⚙️ **Auto-Restart Dev Server** — Powered by `nodemon`.
- 🎨 **Modern UI** — Built using **Shadcn UI** for beautiful, accessible design.
- 📈 **Dashboard & Analytics** — Instructors see revenue and student progress with graphs and filters.
- 🔍 **Filter & Search** — Robust search and filtering for courses and lectures.
- 🧑‍🎓 **Student Experience** — Students can purchase courses and track their learning progress.
- 👨‍🏫 **Instructor Experience** — Instructors can create, update, and manage courses and lectures.

---

## 🧑‍💻 User Roles

✅ **Student**  
- Browse and buy courses securely.  
- Access purchased courses and lectures.  
- Track learning progress via the progress page.

✅ **Instructor**  
- Create new courses and lectures.  
- Edit or update existing courses.  
- Monitor revenue, student enrollments, and view analytics graphs.
- Use filters and search to manage courses efficiently.

---

## 🛠️ Tech Stack

- **Frontend:** Shadcn UI, React/Vite/Next.js (as applicable)
- **Backend:** Node.js, Express
- **Database:** Mongoose (MongoDB)
- **Authentication:** JWT
- **Payments:** Razorpay
- **File Uploads:** Multer + Cloudinary
- **Dev Tools:** Nodemon

---

## 📦 Install & Run

### 1️⃣ Clone the repository
\`\`\`bash
git clone <repo-url>
cd BrightPath
\`\`\`

### 2️⃣ Install dependencies
\`\`\`bash
npm install
npm install --prefix client
\`\`\`

### 3️⃣ Run in development mode
\`\`\`bash
npm run dev
\`\`\`

### 4️⃣ Build frontend
\`\`\`bash
npm run build
\`\`\`

### 5️⃣ Start the server
\`\`\`bash
npm start
\`\`\`

---

## ⚙️ Environment Variables

Create a \`.env\` file in the \`server\` folder:

- PORT=5000
- MONGO_URI=<your_mongodb_uri>
- JWT_SECRET=<your_jwt_secret>
- CLOUDINARY_CLOUD_NAME=<your_cloud_name>
- CLOUDINARY_API_KEY=<your_api_key>
- CLOUDINARY_API_SECRET=<your_api_secret>
- RAZORPAY_KEY_ID=<your_razorpay_key_id>
- RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>

---

---

## 🌐 Explore

Visit 👉 [https://brightpath-bil5.onrender.com](https://brightpath-bil5.onrender.com)

---

## 🧑‍💻 Author

**Anjeet Singh**
