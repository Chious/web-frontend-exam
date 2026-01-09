# Yile 前端工程師徵才專案

這是一份 Yile 前端工程師的徵才專案，需根據規則及設計檔完成頁面需求。

Live Page: https://chious.github.io/web-frontend-exam/

## 目錄

- [Yile 前端工程師徵才專案](#yile-前端工程師徵才專案)
  - [目錄](#目錄)
  - [技術棧](#技術棧)
  - [系統需求](#系統需求)
  - [快速開始](#快速開始)
    - [本地開發](#本地開發)
    - [Docker 開發](#docker-開發)
  - [可用指令](#可用指令)
  - [樣式指南](#樣式指南)
    - [路徑別名](#路徑別名)
    - [圖片優化 Image Tools](#圖片優化-image-tools)
  - [文件](#文件)

## 技術棧

- **框架**: React 18
- **建置工具**: Vite 7
- **圖片處理**: vite-imagetools（Vite 的圖片處理插件）
- **UI 元件庫**: MUI (Material-UI) 5
- **樣式**: Sass / SCSS
- **Mock API**: MirageJS
- **容器化**: Docker
- **Dompurify**: 防止 XSS 攻擊
- **部署**: 使用 GitHub Action + GitHub Page

## 系統需求

- Node.js >= 20
- npm >= 10
- Docker (選用)

## 快速開始

### 本地開發

```bash
# 安裝依賴套件
npm install

# 啟動開發伺服器
npm run dev
```

開發伺服器將在 http://localhost:3000/web-frontend-exam/ 啟動

### Docker 開發

請先到[Docker 官網](https://www.docker.com) 安裝 Linux、或是 Docker Desktop，並在本地端安裝 Docker Compose。唯注意的是商業環境建議使用 Linux 版本，不會有版權問題。

```bash
# 啟動開發容器
docker compose up -d dev

# 查看日誌
docker compose logs -f dev

# 停止容器
docker compose down
```

同時可以整合進 CI/CD 流程中，例如：[.gitlab-ci.yml](https://github.com/Chious/nextjs-fullstack-setup/blob/main/.gitlab-ci.yml)

## 可用指令

| 指令              | 說明             |
| ----------------- | ---------------- |
| `npm run dev`     | 啟動開發伺服器   |
| `npm run build`   | 建置生產版本     |
| `npm run preview` | 預覽生產版本     |
| `npm run lint`    | 執行 ESLint 檢查 |

## 樣式指南

初步樣式為透過 Design Tokens 生成，專案使用 SCSS 搭配 MUI，已預設以下資源：

- `_variables.scss` - 顏色、字型、間距、斷點等變數
- `_mixins.scss` - 響應式、Flexbox、文字截斷等 mixin

### 路徑別名

使用 `@` 作為 `src/` 目錄的別名：

```javascript
import { setupMockServer } from "@/mocks/server";
import "@/styles/main.scss";
```

### 圖片優化 Image Tools

專案使用 vite-imagetools 處理圖片，使用方式為帶入 Query String 設定圖片寬度、高度、格式等：

```javascript
import Image from "example.jpg?w=400&h=300&format=webp";
```

會自動在打包流程處理，例如：

```shell
> yile-frontend-exam@0.1.0 build
> vite build

vite v7.3.0 building client environment for production...
✓ 1352 modules transformed.
dist/index.html                              1.40 kB │ gzip:   0.57 kB
dist/assets/LeftEye-01-Bjt7i_rf.svg          7.89 kB │ gzip:   5.96 kB
dist/assets/Character-01-DiGjESu3.webp      17.29 kB
dist/assets/Background-01-C9BduzNw.webp     30.41 kB
dist/assets/Logo-01-Cds6A4iq.svg         1,321.87 kB │ gzip: 999.81 kB
dist/assets/Modal-Cz9ca5lP.css               4.96 kB │ gzip:   1.37 kB
dist/assets/index-BjiU4k_g.css              11.35 kB │ gzip:   2.76 kB
dist/assets/Modal-br_QAn_-.js               27.76 kB │ gzip:  10.55 kB
dist/assets/query-Ud4x-_E6.js               33.15 kB │ gzip:   9.97 kB
dist/assets/react-BLoQ7s3f.js              141.05 kB │ gzip:  45.35 kB
dist/assets/mui-B1ndXEjB.js                149.86 kB │ gzip:  49.03 kB
dist/assets/index-Dj5xsTmx.js              291.71 kB │ gzip:  66.63 kB
```

更多使用方式請參考[vite-imagetools 文件](https://github.com/JonasKruckenberg/imagetools/blob/main/docs/_media/directives.md)。

## 過程 & QA

1. 樣式初始化 & 專案設定：

- 專案設定: 一開始發現這個專案的 package 偏舊，因此更新了既有套件版本，同時使用 Vite 作為打包工具、Docker 、Prettier、ESlint，以及基礎的 GitHub CI/CD 流程。
- 樣式：透過 Design Token 匯出樣式，並且設定全域樣式。

2. 首頁切版 (2h)：由於 MUI 的封裝比較難找到樣式，除了設計稿要求，基本上樣式偏好依賴原生的 html 及自定義的樣式。

3. 串接資料(1h)：使用 `react-query` 快取 API 資料，同時監控視窗大小決定每一頁抓取資料的數量。

4. 眼睛、動態效果(1h)：

- logo：使用最基本的 `@keyframe` 動畫進行放大縮小。
- eye-tracker：監聽頁面的滑鼠移動，眼球的圖片會在眼白的範圍內，自中心點像外圍偏移，不過有些視窗的眼球處理不太完美。

5. Protected Route(1h)：

- 在 `App()`新增 `AuthProvider` 針對登入內容進行保護，會檢查 localStorage 是否有登入資訊，如果沒有則會出現登入提示。
- Server 端：新增 `/login` 端點

6. 打包優化(30min)：第一次打包的時候發現 `index.js` 過於肥大，因次將 `mui`、`react-query` 等套件分割出去，同時將 `Modal` 等初始不需要顯示的 UI 使用 dynamic import 以減少初始載入大小。

### QA

1. 由於 GitHub Page 的路徑關係，將基本路徑設定為 `${BASE_URL}/web-frontend-exam`

## 文件

1. 需求文件：[REQUIREMENT.md](./docs/REQUIREMENT.md)
