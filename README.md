# 俄羅斯方塊 (Tetris)

經典俄羅斯方塊遊戲，使用 Vanilla JavaScript 開發。

## 🎮 線上遊玩

遊戲已部署到 GitHub Pages，可直接在瀏覽器中遊玩：

**[立即開始遊戲 →](https://hua1100.github.io/Tetris/)**

## Project Status

**Current Phase**: Phase 3 (US1) Complete ✅
**Constitution Version**: 1.1.0
**Development Branch**: `claude/init-github-spec-011CUKyFp6sMQKe77cfXtCwM`
**Tests**: 369/369 passing ✅

## ✨ 遊戲特色

- ✅ 七種經典方塊類型（I, O, T, S, Z, J, L）
- ✅ 幽靈方塊預覽落點
- ✅ 下一個方塊顯示
- ✅ 實時分數、等級、消除行數統計
- ✅ 等級自動提升（每 10 行）
- ✅ 速度隨等級增加
- ✅ 經典像素風格界面
- ✅ 完整的遊戲循環與碰撞檢測
- ✅ 結構化日誌系統

## 🎯 操作方式

| 按鍵 | 功能 |
|------|------|
| ← → | 左右移動方塊 |
| ↑ / W | 旋轉方塊 |
| ↓ / S | 加速下落 |
| 空白鍵 | 硬降（瞬間落底）/ 開始遊戲 |
| P | 暫停/繼續 |
| A / D | 左右移動（WASD 替代方案）|

## Development Approach

This project follows **Spec-Driven Development (SDD)** using the GitHub Spec Kit methodology. All features are developed through a structured process:

1. **Specification** - Define what to build and why
2. **Planning** - Research and design the implementation
3. **Task Breakdown** - Create actionable, testable tasks
4. **Implementation** - Build features incrementally with tests
5. **Validation** - Verify against acceptance criteria

## Project Structure

```
Tetris/
├── .specify/                    # Spec-driven development configuration
│   ├── memory/
│   │   └── constitution.md      # Project principles and governance
│   └── templates/
│       ├── plan-template.md     # Implementation plan template
│       ├── spec-template.md     # Feature specification template
│       └── tasks-template.md    # Task breakdown template
├── specs/                       # Feature specifications (created per feature)
├── src/                         # Source code (to be created)
├── tests/                       # Test suites (to be created)
└── docs/                        # Additional documentation
```

## Core Principles

This project follows 5 core principles defined in `.specify/memory/constitution.md`:

1. **Simplicity First** - Prioritize simple solutions over complex ones
2. **Test-Driven Development** - Write tests before implementation
3. **User Experience Focus** - Responsive controls and smooth gameplay
4. **Performance by Design** - 60 FPS target, <16ms input latency
5. **Maintainable Code** - Clear, documented, and consistent code style

## 🛠️ 本地開發

### 環境需求

- Node.js: v18.0+ （推薦 LTS 版本）
- npm: v9.0+
- Git: v2.0+

### 安裝與運行

```bash
# 克隆倉庫
git clone https://github.com/hua1100/Tetris.git
cd Tetris

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build

# 運行測試
npm test

# 代碼檢查
npm run lint
```

開發服務器默認運行在 http://localhost:3000/

### Development Workflow

1. **Create a Feature Specification**
   - Use `.specify/templates/spec-template.md` as a template
   - Define user stories with acceptance criteria
   - Specify functional requirements and success metrics

2. **Create an Implementation Plan**
   - Use `.specify/templates/plan-template.md` as a template
   - Research technical approach
   - Perform constitution check
   - Design data models and contracts

3. **Break Down into Tasks**
   - Use `.specify/templates/tasks-template.md` as a template
   - Organize tasks by user story
   - Identify parallel opportunities
   - Define clear dependencies

4. **Implement Incrementally**
   - Write tests first (TDD)
   - Implement one user story at a time
   - Validate independently before moving on
   - Commit frequently with clear messages

## Constitution

All development decisions must align with the project constitution. Key governance rules:

- Complex solutions require explicit justification
- Critical game mechanics must have tests written first
- Performance budgets (60 FPS, 16ms latency) are non-negotiable
- Code must prioritize clarity over brevity

See `.specify/memory/constitution.md` for full details.

## Contributing

Contributions must follow the spec-driven development process:

1. Propose changes via feature specification
2. Discuss and refine requirements
3. Create implementation plan with constitution check
4. Implement with tests following the tasks breakdown
5. Submit pull request with specification reference

## License

To be determined

## 🧪 測試

項目使用 Jest 進行測試，目前有 **369 個單元測試**，全部通過 ✅

```bash
npm test                 # 運行所有測試
npm test -- --watch      # 監視模式
npm test -- --coverage   # 生成覆蓋率報告
```

測試覆蓋：
- ✅ Logger（20 個測試）
- ✅ Position（79 個測試）
- ✅ Grid（75 個測試）
- ✅ Tetromino（145 個測試）
- ✅ GameState（100 個測試）
- ✅ Game（50 個測試）

## 🎨 技術棧

- **語言**: Vanilla JavaScript (ES6+)
- **渲染**: HTML5 Canvas 2D API
- **構建工具**: Vite
- **測試框架**: Jest
- **代碼檢查**: ESLint + Prettier
- **版本控制**: Git + GitHub
- **部署**: GitHub Pages + GitHub Actions

## 📊 計分規則

| 消除行數 | 基礎分數 | 實際分數 |
|---------|---------|---------|
| 1 行 (Single) | 100 | 100 × 等級 |
| 2 行 (Double) | 300 | 300 × 等級 |
| 3 行 (Triple) | 500 | 500 × 等級 |
| 4 行 (Tetris) | 800 | 800 × 等級 |

**等級提升**：每消除 10 行提升 1 級
**速度調整**：每級速度加快 10%（最快 50ms）

## 🚀 部署

項目使用 GitHub Actions 自動部署到 GitHub Pages：

1. 推送代碼到 `main` 或 `master` 分支
2. GitHub Actions 自動構建並部署
3. 訪問 https://hua1100.github.io/Tetris/ 查看最新版本

## 📝 版本歷史

- **v1.0.0** (2025-10-22) - Phase 3 (US1) 完成
  - ✅ 核心遊戲邏輯
  - ✅ 渲染系統
  - ✅ 輸入處理
  - ✅ 369 個單元測試

---

**享受遊戲！** 🎮✨
