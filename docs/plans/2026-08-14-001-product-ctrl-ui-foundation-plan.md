---
artifact_contract: ce-unified-plan/v1
artifact_readiness: requirements-only
product_contract_source: ce-brainstorm
title: Ctrl UI Foundation - Plan
date: 2026-08-14
status: requirements-only
---

# Ctrl UI Foundation - Plan

## Goal Capsule

**Objective.** Зафиксировать продуктовую рамку и инфраструктурный контракт Ctrl UI: публичный React + TypeScript UI kit, который растёт по Atomic Design от токенов до сложных композиций, доступен из коробки и даёт потребителям предсказуемую кастомизацию без размывания системы.

**Product authority.** Этот документ — источник требований до `ce-plan`. Репозиторий `dedOfficial/ctrl-ui` сейчас пустой (MIT, Compound Engineering config example). Код, схемы пакетов и точные конфиги сюда не входят.

**Open blockers.** Нет блокирующих неизвестных для планирования инфраструктуры и token/atom слоя. Визуальный бренд и первое consuming-приложение не заданы — они не блокируют фундамент, но ограничивают конкретную палитру до выбора нейтральной стартовой темы.

## How This Work Fits Together

Одна единица работы: **фундамент Ctrl UI**. Инфраструктура и дизайн-система не разделяются в отдельные контракты — пакет без слойной модели бессмыслен, а слои без toolchain нельзя честно проверять (a11y, lint, versioning).

Порядок поставки внутри этой единицы:

1. Toolchain и git-дисциплина (чтобы каждый следующий слой сразу жил в правильных воротах).
2. Sub-atoms: токены и CSS-variable контракт.
3. Atoms с a11y-контрактом.
4. Molecules.
5. Organisms (modal, table и аналоги).
6. Templates / layout shells.

Пункты 4–6 — продолжение того же продукта, не отдельные продукты. Планирование реализации может нарезать их на implementation units, но не менять правила слоёв, a11y и кастомизации.

## Product Contract

### Primary actors

- **Kit author** — развивает Ctrl UI в этом репозитории.
- **Feature consumer** — команда продукта, которая ставит пакет и собирает экраны. Не должна сама собирать клавиатурную навигацию, фокус-ловушки и ARIA для поставленных компонентов.

### Positioning

Ctrl UI — **мнениятый (opinionated) дизайн-системный kit**, не headless-набор и не copy-paste каталог вроде shadcn. Потребитель получает готовый визуальный язык и доступное поведение. Кастомизация идёт через токены, закрытый набор вариантов и композицию, а не через бесконечные style-пропсы.

Соседние модели, которые сознательно не выбираем как продукт:

- Headless-only (Radix/React Aria «как есть») — максимум свободы, но нет системы.
- Utility-first kit на Tailwind как публичный API — потребители начинают обходить токены.
- Source-copy kit — ломает Conventional Commits / semver как контракт поставки.

### Core outcome

Потребитель может собрать доступный экран из Ctrl UI, сменить тему через семантические токены и не сломать a11y или визуальную иерархию «случайным» пропом.

### In scope

- Инфраструктурный контракт: package manager, library build, docs/catalog, lint/format, git hooks, conventional commits, versioning.
- Atomic Design со строгой зависимостью **вниз**: tokens → atoms → molecules → organisms → templates.
- Трёхуровневые токены: primitive → semantic → component.
- WCAG 2.2 AA как пол для каждого публичного компонента.
- Контракт кастомизации (см. ниже).
- Каталог компонентов (Storybook или эквивалент) как обязательная поверхность разработки, не как маркетинговый сайт.
- Автопроверки: типы, lint, format, unit/a11y тесты на критичное поведение.

### Out of scope (this foundation)

- Нативный iOS/Android kit.
- Figma-library как обязательный артефакт первой поставки.
- Маркетинговый сайт, changelog-портал, платный продукт.
- Копирование чужого визуального языка (MUI, Chakra, shadcn).
- App-router / Next-specific framework kit как отдельный пакет — kit должен работать в обычном React. Совместимость с RSC (`"use client"` там, где нужно) — требование потребителей, не отдельный продукт.
- Organisms/templates в первой поставке кода — они в продуктовой траектории, но не в первом implementation slice.

### Customization vs strictness

Кастомизация разрешена только по четырём каналам, в этом приоритете:

1. **Семантические токены / тема** — основной канал (цвет роли, плотность, радиус, типографика, светлая/тёмная схема).
2. **Закрытые variant-пропсы** (`intent`, `size`, `appearance`) — конечные enum, не свободные строки со стилями.
3. **Композиция** — compound components и слоты для структуры, не для подмены семантики.
4. **Escape hatch** — `className` / slot class на документированных узлах, last resort.

Запрещено как публичный API:

- Пропсы вида `backgroundColor`, `sx`, произвольный CSS-in-JS theme object как главный путь.
- Отключение семантики и клавиатуры «чтобы проще стилизовать».
- Прямое использование primitive-токенов в компонентах и у потребителей (только semantic / component).

Строгость со стороны kit author:

- Компонент не содержит литеральных цветов, отступов и шрифтов вне token pipeline.
- Новый визуальный одноразовый проп не добавляется; сначала токен или variant.
- Слои Atomic Design не импортируют «вверх».

### Accessibility floor

Каждый публичный компонент:

- Соответствует WCAG 2.2 AA, включая Target Size 2.5.8 (минимум 24×24 CSS px) и Focus Not Obscured 2.4.12.
- Клавиатура: Tab/Arrow/Enter/Space/Escape по APG для данного паттерна.
- Есть видимый `:focus-visible`.
- Icon-only controls имеют accessible name.
- Ошибки форм объявляются через `role="alert"` / `aria-live`, не только цветом.
- Модалки: focus trap, возврат фокуса, `Escape`.
- Автопроверки a11y в каталоге и в тестах обязательны; ручной клавиатурный проход — часть Definition of Done для overlay и composite widgets.

Потребитель может **добавить** ARIA, но не может снять контракт, который держит kit.

### Quality toolchain (product constraints)

Эти решения — часть продукта, потому что brainstorm явно про stack. Детали конфигов — в `ce-plan`.

| Concern | Decision | Why |
| --- | --- | --- |
| Language | React + TypeScript, `strict` | session-settled |
| Package manager | **pnpm** + Corepack | стандарт для kit/workspaces, предсказуемые lockfile-инварианты |
| Repo shape | **pnpm workspace с двумя поверхностями**: публичный kit-пакет и внутренний catalog/docs app | catalog не должен попадать в npm-артефакт; полноценный turborepo с первого дня — лишняя церемония |
| Library bundler | **tsdown** (Rolldown, ESM-first, dts) | преемник tsup; Vite остаётся для catalog, не для publish |
| Catalog | **Storybook на Vite** | изолированные состояния, a11y addon, визуальный контракт |
| Tests | **Vitest + Testing Library + axe** | oxlint имеет vitest-правила; Jest не нужен |
| Lint | **oxlint only** для JS/TS/TSX | session-settled; ESLint не вводится |
| Format | **oxfmt**, не Prettier и не oxlint | oxlint не форматтер; oxfmt — Prettier-совместимая замена из той же линейки Oxc |
| CSS lint | **не Stylelint на старте** | oxlint CSS не линтит; Stylelint оставляем YAGNI, сжав CSS-поверхность (см. исследование ниже) |
| Git hooks | **Lefthook** | один раннер: staged oxlint/oxfmt + commit-msg |
| Commits | **Conventional Commits** через commitlint | session-settled |
| Versioning | **Changesets** + semver | для библиотеки changelog важнее авто-bump из commit type; conventional commits остаются дисциплиной истории |
| Node | **Node 22** (Active/LTS на момент плана) | |
| Package module | **ESM-only** | CJS dual-publish — только если появится реальный consumer-блокер |
| Styles | Токены → CSS custom properties; стили компонентов живут в TypeScript, не в большой SCSS-кодовой базе | чтобы oxlint покрывал стиль-код, а oxfmt форматтировал редкий CSS dump |

### Oxlint / Prettier / Stylelint investigation

Факты на август 2026 (Oxc docs + compatibility matrix):

- **Oxlint** — линтер JS/TS/JSX/TSX (и script-блоков Vue/Svelte/Astro). Это замена ESLint. CSS/SCSS/HTML/Markdown **не в scope линтинга**.
- **Oxfmt** — отдельный форматтер той же линейки. Форматирует JS/TS и также CSS, SCSS, Less, JSON, YAML, Markdown, HTML и др. Это замена Prettier, не часть oxlint.
- **Stylelint** не заменяется oxlint. Oxfmt закрывает *форматирование* CSS, но не *правила качества* CSS (неизвестные свойства, specificity-дисциплина, запрет литералов).

Следствие для Ctrl UI:

1. Prettier не ставим — **oxfmt**.
2. ESLint не ставим — **oxlint** (включая jsx-a11y / React правила, которые oxlint уже несёт).
3. Stylelint не ставим, пока нет рукописной CSS-кодовой базы. Токены компилируются в CSS variables; компоненты стилизуются так, чтобы основной стиль-код был TypeScript. Если позже появится существенный hand-written CSS — тогда узкий Stylelint, не «на всякий случай».

### Requirements

- **R1.** Kit author может клонировать репозиторий, включить Corepack и получить хуки, lint, format, typecheck, test и catalog одной установкой зависимостей.
- **R2.** Commit с неконвенциональным сообщением отвергается локально (commit-msg hook) и в CI.
- **R3.** Staged JS/TS проходит oxlint и oxfmt до попадания в git; CI повторяет полную проверку.
- **R4.** Публичный пакет не содержит catalog, тесты и toolchain-конфиги как runtime-зависимости.
- **R5.** Токены — единственный источник визуальных решений. Primitive не протекают в компонент-API.
- **R6.** Слои Atomic Design зависят только вниз. Нарушение слоя — дефект, не стиль.
- **R7.** Каждый публичный компонент имеет: TypeScript-контракт пропсов, catalog story для ключевых состояний (default, hover/focus, disabled, error, RTL если релевантно), a11y-проверку.
- **R8.** Тема переключается без форка компонентов (семантический слой / CSS variables).
- **R9.** Feature consumer кастомизирует внешний вид только каналами 1–4 выше. Попытка сломать семантику через публичный API невозможна или явно отвергается типами.
- **R10.** Overlay и composite widgets (когда появятся) поставляют focus management и клавиатуру сами.
- **R11.** Версия пакета и changelog ведутся через Changesets; breaking change публичного API — major.
- **R12.** Документация компонента описывает: для чего, какие variants, какие токены, что нельзя переопределять.

### Primary flows

1. **Bootstrap.** Author ставит зависимости → хуки активны → `lint` / `fmt:check` / `typecheck` / `test` / `catalog` работают на пустом каркасе.
2. **Add a token.** Author добавляет primitive и semantic mapping → CSS variables обновляются → ни один компонент не правится вручную для смены роли цвета.
3. **Add an atom.** Author создаёт компонент на токенах → story + a11y test → changeset → conventional commit. Consumer видит закрытые variants и тему, не внутренние primitive.
4. **Theme a product.** Consumer подключает пакет, задаёт семантические токены (или выбирает shipped theme), собирает экран. Focus/keyboard работают без дополнительного кода.
5. **Release.** Changeset на PR → CI зелёный → version bump + changelog → publish ESM-пакета.

### Acceptance examples

- Потребитель меняет `--color-action-primary` (или эквивалент semantic token) — все primary-кнопки, ссылки действия и соответствующие состояния следуют за ним. Компонентный код не трогается.
- `Button` без accessible name в icon-only конфигурации не проходит a11y-тест / type-level запрет.
- `className` на корне меняет внешнюю обёртку, но не снимает `role`, focus ring контракта и keyboard handler.
- Commit `fixed button` отклоняется; `fix(button): restore focus ring on dark theme` принимается.
- В опубликованном tarball нет `apps/catalog` и `node_modules` toolchain.

### Non-goals

- Универсальный CSS-фреймворк.
- Поддержка Vue/Svelte/React Native в этом продукте.
- Pixel-perfect копия существующей библиотеки.
- «Любая кастомизация любой ценой».

### Key decisions

- **D1.** React + TypeScript. `session-settled: user-stated`
- **D2.** Atomic Design с sub-atoms = tokens. `session-settled: user-stated`
- **D3.** Conventional Commits + git hooks. `session-settled: user-stated`
- **D4.** ESLint не используется; JS/TS lint = oxlint. `session-settled: user-stated`
- **D5.** Prettier не используется; format = oxfmt (не oxlint). `session-settled: investigated-from-user-intent`
- **D6.** Stylelint не вводится на фундаменте; CSS-поверхность сознательно сжата. Revisit, если появится hand-written CSS. `session-settled: investigated-from-user-intent`
- **D7.** Продукт — opinionated kit, не headless и не copy-paste. `recommended default`
- **D8.** Кастомизация: tokens → variants → composition → className last resort. `recommended default`
- **D9.** pnpm + tsdown + Storybook/Vite + Vitest + Lefthook + commitlint + Changesets. `recommended default`
- **D10.** ESM-only, Node 22, React как peer. `recommended default`
- **D11.** WCAG 2.2 AA — пол, не цель «когда-нибудь». `session-settled: user-stated` (уточнение уровня — recommended AA)
- **D12.** Сложное поведение overlay/composite не пишется с нуля, если существует проверенный a11y-примитив; визуальный слой всё равно принадлежит Ctrl UI. Выбор библиотеки примитива — `ce-plan`. `recommended default`

### Assumptions

- **A1.** Репозиторий публичный MIT; kit предполагается публиковать в npm под именем, производным от `ctrl-ui`. Точный scope (`ctrl-ui` vs `@ctrl-ui/react`) уточняется при первой публикации.
- **A2.** Первое consuming-приложение ещё нет — стартовая тема нейтральная, не бренд конкретного продукта.
- **A3.** Документация-каталог достаточно Storybook; отдельный маркетинговый docs-сайт не нужен в фундаменте.
- **A4.** i18n (RTL, строковые defaults) учитывается в API (не зашивать английский в обязательный visible text без override), полноценная локализационная платформа не строится сейчас.
- **A5.** Visual regression (скриншот-тесты) желательны позже; в фундаменте достаточно a11y + unit + story states.
- **A6.** Brainstorm выполнен в non-interactive режиме Cloud Agent: продуктовые развилки, которые пользователь не зафиксировал явно, записаны как recommended default, а не как неявно «уже согласованные».

### Outstanding questions

- **Q1.** Нужен ли npm-publish в первом implementation slice или достаточно private/workspace пакета?
- **Q2.** Есть ли референс визуального языка (существующий продукт, palettes, density)?
- **Q3.** Нужен ли dark theme в первой поставке токенов или только контракт под него?
- **Q4.** Имя публичного пакета и org scope.

Эти вопросы не блокируют `ce-plan` инфраструктуры и token/atom слоя, если принять A1–A3.

### Approaches considered

Три продуктовые формы. Рекомендация — Approach A.

**Approach A — Token-strict Atomic kit (recommended).**  
Слои, токены, закрытые variants, a11y в API. Потребитель получает систему. Риск: медленнее «накидать кнопку». Подходит, потому что пользователь явно хочет систему, а не набор виджетов.

**Approach B — Headless primitives + optional theme.**  
Максимум кастомизации, слабая визуальная дисциплина, kit легко превращается в обёртку над Radix. Отклонено: ломает баланс strictness.

**Approach C — Copy-paste source kit.**  
Компоненты живут у потребителя. Отклонено: конфликтует с versioning/changelog как продуктовым контрактом.

Инфраструктурный challenger: Vite+ как единый оркестратор oxlint+oxfmt. Отклонён для фундамента — отдельные CLI oxlint/oxfmt проще для библиотеки; catalog и так на Vite. Пересмотреть, если toolchain-команд станет слишком много.

### Success criteria

- Новый author проходит flow Bootstrap без ручной настройки хуков.
- Добавление цвета-роли не требует правок компонентов.
- Публичный атом нельзя использовать так, чтобы автоматический a11y-сканер и keyboard smoke краснели на default story.
- Consumer theming не требует fork.
- История git читаема conventional commits; релиз имеет changeset-changelog.

## Implementation Units (requirements-level)

Планирование кода нарежет это подробнее. Здесь только границы, чтобы `ce-plan` не смешивал фазы.

1. **U1 — Platform.** Workspace, pnpm, tsdown, oxlint, oxfmt, Lefthook, commitlint, Changesets, Vitest, Storybook skeleton, CI gates. Нулевой UI, кроме smoke-компонента если нужен для проверки pipeline.
2. **U2 — Tokens.** Primitive / semantic / component token pipeline и CSS variable контракт, light theme (dark — по Q3).
3. **U3 — Atom contract.** Первый атом (скорее всего Button + Text/Icon) как эталон API, a11y, story, тестов и кастомизации. Все следующие атомы копируют этот эталон, а не изобретают второй.
4. **U4+.** Molecules → organisms (modal, table) → layout templates. Каждый слой обязан использовать только нижние. Не начинать с table/modal.

## Ready for Planning

Complete: actors, outcome, in/out, a11y floor, customization contract, toolchain constraints, acceptance.  
Consistent: oxfmt vs oxlint разведены; Stylelint не противоречит «oxc-native» цели.  
Focused: один продукт — фундамент Ctrl UI.  
Usable by planning: U1–U3 можно планировать без ответа на Q1–Q4.
