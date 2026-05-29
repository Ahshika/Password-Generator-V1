# رفع المشروع على GitHub

## مسار المستودع المحلي (Git)

```
C:\Users\ahmed\Desktop\Project\Git Hub\Password Generator V1
```

الكود داخل المجلد: `Password Generator V1\`

**رابط GitHub المضبوط:**

https://github.com/Ahshika/Password-Generator-V1

---

## الطريقة 1: نقرة واحدة (موصى بها)

1. افتح المجلد أعلاه في Explorer.
2. شغّل **`push-to-github.bat`** (دبل كليك).
3. انتظر حتى يظهر `Done` — سيتم مزامنة الملفات من نسخة Antigravity ثم `commit` ثم `push`.

---

## الطريقة 2: GitHub Desktop

1. افتح **GitHub Desktop**.
2. **File → Add local repository** واختر:
   `C:\Users\ahmed\Desktop\Project\Git Hub\Password Generator V1`
3. إذا ظهرت تغييرات في القائمة، اكتب رسالة commit مثل:
   `Add NightGold Password Manager source and documentation`
4. اضغط **Commit to main** ثم **Push origin**.

إذا لم يكن المستودع منشورًا على GitHub بعد: **Publish repository** واختر الاسم `Password-Generator-V1`.

---

## ما يُرفع وما لا يُرفع

| يُرفع | لا يُرفع (`.gitignore`) |
|--------|-------------------------|
| `src/`, `electron/`, `public/` | `node_modules/` |
| `package.json`, `vite.config.js`, … | `temp-asar/` |
| `README.md`, `docs/` | `dist-electron/`, `release/` |

---

## ملاحظة أمنية

الكود يحتوي على **سر TOTP ثابت** في `electron/main.js`. بعد الرفع العام على GitHub، اعتبر هذا السر مكشوفًا وغيّره قبل أي استخدام حقيقي.

---

## مسار Antigravity (المصدر)

```
C:\Users\ahmed\Desktop\Project\Antigravity\Password Generator\Password Generator V1
```

السكربت `push-to-github.ps1` ينسخ من هذا المسار تلقائيًا قبل الرفع.
