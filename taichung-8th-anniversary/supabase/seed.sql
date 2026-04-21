-- Seed data for Taichung 8th Anniversary Event

-- Clear existing configs (Optional, use with caution)
-- TRUNCATE public.stamp_configs CASCADE;

-- Insert Master Configs
INSERT INTO public.stamp_configs (stamp_id, variant_id, area_name, is_active)
VALUES 
    ('01', 1, '入口主題陳列區', true),
    
    -- 02 Variants (Rotating)
    ('02', 1, '生活雜貨區 (V1)', true),
    ('02', 2, '生活雜貨區 (V2)', false),
    ('02', 3, '生活雜貨區 (V3)', false),
    
    ('03', 1, '露台區', true),
    ('04', 1, '兒童繪本區', true),
    
    -- 05 Variants (Rotating)
    ('05', 1, '書櫃深處 (V1)', true),
    ('05', 2, '書櫃深處 (V2)', false),
    ('05', 3, '書櫃深處 (V3)', false),
    
    -- 06 Variants (Rotating)
    ('06', 1, 'WIRED TOKYO 吧檯 (V1)', true),
    ('06', 2, 'WIRED TOKYO 吧檯 (V2)', false),
    ('06', 3, 'WIRED TOKYO 吧檯 (V3)', false),
    
    ('07', 1, '天井區', true),
    ('08', 1, '結帳櫃檯旁', true),
    
    -- Hidden Points
    ('A', 1, '隱藏點 (松鼠)', true),
    ('B', 1, '隱藏點 (小鳥)', true),
    ('C', 1, '隱藏點 (小鹿)', true);

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
