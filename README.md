# Artheid Store

Simple Android app store page by Artheid Studio (BESD, PhotoLock).

## GitHub Pages a publish korar niyom
1. GitHub a new **public** repository banao.
2. Ei folder er shob file (index.html, apps.js, app.js, style.css, *.apk, *.jpg, *.png) upload koro.
   (Browser upload a ek bare 100 file er beshi na; APK boro hole GitHub Desktop / git use koro.)
3. Repo > Settings > Pages > Source: `Deploy from a branch` > Branch: `main` / `(root)` > Save.
4. 1-2 minute por link pabe: `https://USERNAME.github.io/REPO-NAME/`

## Notun app add korte
`apps.js` a notun entry add koro, `apk: "yourapp.apk"` dao, APK file same folder a rakho.
Notun app er jonno `photolock.html` copy kore nam `yourapp.html` koro ar `data-app="yourapp"` koro.
