# Keerthana J — Software Development Engineer (AI/ML) Portfolio & CMS

An ultra-modern, lively, white-and-purple themed portfolio web application built for **Keerthana J**, featuring a full dynamic **Admin CMS Portal** with **Firebase Firestore / Auth** integration.

---

## 🌟 Key Highlights

- **Visual Design**: Clean white and purple palette with royal amethyst gradients, glassmorphism, floating ambient glow orbs, micro-animations, and responsive cards.
- **Resume Seed Data**: Pre-loaded with:
  - **Work Experience**: Anugraha Exceed Pvt. Ltd. (SDE AI/ML, Oct 2024 – Present) with all metrics, accomplishments, and tech stack.
  - **Flagship Projects**: **Observe AI** (LLM Observability & Evaluation Platform with Gemini AI Judge) and **RecruSkill** (AI Interview Simulator with Wav2Vec2 & OpenCV CNN vision).
  - **Skills Matrix**: Categorized across Backend Development, AI & Machine Learning, Databases & Messaging, Tools & Cloud, and Core Computer Science with live interactive category filters.
  - **Education**: Alliance University (B.Tech CS, 83.5%) & Asian Christian High School (94.2%).
  - **Achievements & Certifications**: AWS Certified Cloud Practitioner, Google Developer Students Club (GDSC) Lead (2023–24), IEEE Xplore Publication.
  - **Future Scalability**: Ready-made modules for Blog Posts / Articles and Testimonials / Endorsements.
  - **Interactive Contact Form & Inquiries Inbox**: Visitors can message you directly; inquiries are saved in real-time.

---

## 🚀 Getting Started

### 1. Run Locally
Simply open `index.html` in any modern web browser or start a lightweight static server:

```powershell
# Python
python -m http.server 8080

# Or Node (npx)
npx serve .
```

Visit:
- **Live Portfolio**: `http://localhost:8080/index.html`
- **CMS Admin Portal**: `http://localhost:8080/admin.html` (or click the floating gear icon in bottom-right)

---

## 🔑 Admin CMS Portal

### How to Log In:
1. Open `admin.html` or click **CMS Portal** in the navigation bar.
2. Use the Master Admin credentials:
   - **Email**: `jkeerthana2004@gmail.com`
   - **Passcode**: `keerthana2026` (or `admin123`)

### What You Can Do in the CMS:
1. **Hero & Profile Tab**: Update your name, title, bio, location, phone, email, resume link, avatar, or LinkedIn/GitHub links.
2. **Work Experience Tab**: Add, edit, or delete work experience entries, including bullet points and technologies.
3. **Projects Showcase Tab**: Add new projects, customize images, taglines, impact metrics, GitHub repository links, and live demo URLs.
4. **Skills Matrix Tab**: Add new tech stacks or modify skills within any category.
5. **Education & Achievements Tab**: Manage degrees, honors, AWS certifications, and publications.
6. **Scalable Modules Tab**: Publish technical articles, blog posts, or client/mentor recommendations.
7. **Inquiries Tab**: Read incoming messages submitted by recruiters or clients via the contact form.
8. **Firebase & Backup Tab**:
   - Connect your own Firebase project for cloud synchronization.
   - Download a complete JSON backup of your portfolio data.
   - Import JSON backup anytime.
   - Revert back to original resume defaults with a single click.

---

## 🔥 Connecting Your Firebase Account (Optional for Cloud Sync)

The portfolio works out-of-the-box using browser storage (`localStorage`). To enable two-way cloud sync so edits from anywhere update all visitors:

1. Create a free project at [Firebase Console](https://console.firebase.google.com/).
2. Create a **Cloud Firestore** database (in test or production mode).
3. Under Project Settings -> **General** -> **Your Apps**, click the Web (`</>`) icon and copy the configuration object:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
4. Open your Admin Portal -> **Firebase & Backup** tab -> Paste your keys and check **Enable Firebase Cloud Firestore Real-time Sync** -> Click **Save & Connect Firebase**.
5. Your portfolio is now backed by Google Cloud Firestore in real time!

---

## 🌐 Free 1-Click Hosting Options

You can host this portfolio for free in under 2 minutes:
- **GitHub Pages**: Push this repository to GitHub, go to **Settings > Pages**, and set the source branch to `main`.
- **Firebase Hosting**: Run `firebase init hosting` followed by `firebase deploy`.
- **Vercel / Netlify**: Drag-and-drop the portfolio folder directly into the web dashboard.
