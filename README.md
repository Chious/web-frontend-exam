# Yile 前端工程師徵才專案

這是一份 Yile 前端工程師的徵才專案，需根據規則及設計檔完成頁面需求。

## 技術棧

- **框架**: React 18
- **建置工具**: Vite 7
- **圖片處理**: vite-imagetools（Vite 的圖片處理插件）
- **UI 元件庫**: MUI (Material-UI) 5
- **樣式**: Sass / SCSS
- **Mock API**: MirageJS
- **容器化**: Docker

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

## 可用指令

| 指令              | 說明             |
| ----------------- | ---------------- |
| `npm run dev`     | 啟動開發伺服器   |
| `npm run build`   | 建置生產版本     |
| `npm run preview` | 預覽生產版本     |
| `npm run lint`    | 執行 ESLint 檢查 |

## API 端點

專案使用 MirageJS 模擬後端 API，以下為可用端點：

| 端點                         | 方法 | 說明                           |
| ---------------------------- | ---- | ------------------------------ |
| `/api/v1/jobs`               | GET  | 取得職缺列表（支援分頁與篩選） |
| `/api/v1/jobs/:id`           | GET  | 取得單一職缺詳情               |
| `/api/v1/educationLevelList` | GET  | 取得學歷選項                   |
| `/api/v1/salaryLevelList`    | GET  | 取得薪資選項                   |

### 查詢參數 (`/api/v1/jobs`)

| 參數              | 說明         |
| ----------------- | ------------ |
| `page`            | 頁碼         |
| `pre_page`        | 每頁筆數     |
| `company_name`    | 公司名稱篩選 |
| `education_level` | 學歷篩選     |
| `salary_level`    | 薪資篩選     |

## 專案結構

```
├── src/
│   ├── main.jsx          # 應用程式進入點
│   ├── App.jsx           # 根元件
│   ├── constants/        # 常數資料
│   │   ├── jobList.js
│   │   ├── educationList.js
│   │   └── salaryList.js
│   ├── mocks/            # Mock API 設定
│   │   └── server.js
│   └── styles/           # 樣式檔案
│       ├── main.scss
│       ├── _variables.scss
│       └── _mixins.scss
├── public/               # 靜態資源
├── index.html            # HTML 模板
├── vite.config.js        # Vite 設定
├── Dockerfile            # Docker 設定
├── docker-compose.yml    # Docker Compose 設定
└── package.json
```

## 樣式指南

專案使用 SCSS 搭配 MUI，已預設以下資源：

- `_variables.scss` - 顏色、字型、間距、斷點等變數
- `_mixins.scss` - 響應式、Flexbox、文字截斷等 mixin

### 路徑別名

使用 `@` 作為 `src/` 目錄的別名：

```javascript
import { setupMockServer } from "@/mocks/server";
import "@/styles/main.scss";
```

### 圖片優化 Image Tools

專案使用 vite-imagetools 處理圖片，使用方式如下：

```javascript
import Image from "example.jpg?w=400&h=300&format=webp";
```

更多使用方式請參考[vite-imagetools 文件](https://github.com/JonasKruckenberg/imagetools/blob/main/docs/_media/directives.md)。
