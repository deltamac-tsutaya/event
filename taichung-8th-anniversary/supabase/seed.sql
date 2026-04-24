-- Clear existing data before seeding to avoid duplicate key errors
TRUNCATE public.rewards CASCADE;
TRUNCATE public.stamp_configs CASCADE;

-- 1. Insert Master Configs
INSERT INTO public.stamp_configs (stamp_id, variant_id, area_name, is_active)
VALUES
    ('01', 1, '入口主題陳列區 (2F)', true),

    -- 02 Variants (Rotating)
    ('02', 1, '職人雜貨區 (2F) V1', true),
    ('02', 2, '職人雜貨區 (2F) V2', false),
    ('02', 3, '職人雜貨區 (2F) V3', false),

    ('03', 1, '戶外座位區 (3F)', true),
    ('04', 1, '兒童繪本書櫃 (3F)', true),

    -- 05 Variants (Rotating)
    ('05', 1, '樓梯書牆 (3F) V1', true),
    ('05', 2, '樓梯書牆 (3F) V2', false),
    ('05', 3, '樓梯書牆 (3F) V3', false),

    -- 06 Variants (Rotating)
    ('06', 1, '吧檯區 (2F) V1', true),
    ('06', 2, '吧檯區 (2F) V2', false),
    ('06', 3, '吧檯區 (2F) V3', false),

    ('07', 1, '天井吊燈區 (3F)', true),
    ('08', 1, '告示牌 (1F)', true),

    -- Hidden Points
    ('A', 1, '員工身上（隨機）', true),
    ('B', 1, '戶外座位桌上', true),
    ('C', 1, '電梯告示', true);

-- Insert Rewards
INSERT INTO public.rewards (id, tier, provider, name, conditions, probability, daily_limit, validity_days)
VALUES 
    ('S1', 'S', 'WIRED', '雙人套餐 188 元抵用券', '限店內使用，有效至 2026/5/30', 1, 1, 30),
    ('S2', 'S', 'TSUTAYA', '88 元現金抵用券', '全館適用，有效至 2026/5/30', 1, 1, 30),
    ('A1', 'A', 'WIRED', '法式巧克力香蕉聖代 體驗券', '店內兌換，有效至 2026/5/30', 1, 1, 30),
    ('A2', 'A', 'WIRED', '松露薯條 體驗券', '店內兌換，有效至 2026/5/30', 1, 1, 30),
    ('A3', 'A', 'TSUTAYA', '伯爵茶巴斯克 體驗券', '跨店兌換，有效至 2026/5/30', 1, 1, 30),
    ('A4', 'A', 'TSUTAYA', 'WIRED 招牌水果茶 體驗券', '跨店兌換，有效至 2026/5/30', 1, 1, 30),
    ('B1', 'B', 'WIRED', '雙人套餐 88 折', '有效至 2026/5/30', 3, 5, 30),
    ('B2', 'B', 'WIRED', 'Brunch 套餐 88 折', '有效至 2026/5/30', 3, NULL, 30),
    ('B3', 'B', 'WIRED', '草莓煉乳抹茶法式吐司 加碼體驗券', '需消費滿額使用，有效至 2026/5/30', 3, 3, 30),
    ('B4', 'B', 'WIRED', '外帶飲品 買一送一', '限外帶使用，有效至 2026/5/30', 10, NULL, 30),
    ('B5', 'B', 'TSUTAYA', '文具雜貨 88 折', '指定品項適用，有效至 2026/5/30', 3, NULL, 30),
    ('B6', 'B', 'TSUTAYA', '書籍雜誌 88 折', '指定書籍適用，有效至 2026/5/30', 3, NULL, 30),
    ('B7', 'B', 'TSUTAYA', '88 元抵用券 (滿 888)', '滿額折抵，有效至 2026/5/30', 39, NULL, 30),
    ('B8', 'B', 'TSUTAYA', '92 折優惠券', '通用折扣，有效至 2026/5/30', 30, NULL, 30);
