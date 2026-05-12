import os

replacements = [
    # Colors
    ('[#0277d4]', 'tv-blue'),
    ('[#005ea8]', 'tv-blue-dark'),
    ('[#eef7ff]', 'tv-blue-light'),
    ('[#1f9be0]', 'tv-blue'),
    ('[#0c83c9]', 'tv-blue'),
    ('[#ff6d1a]', 'tv-orange'),
    ('[#e95c0a]', 'tv-orange-dark'),
    ('[#e85e0f]', 'tv-orange-dark'),
    ('[#ff5f12]', 'tv-orange'),
    ('[#f6fbff]', 'tv-bg'),
    ('[#f7fbff]', 'tv-bg'),
    ('[#fbfdff]', 'tv-bg'),
    ('[#f3f9ff]', 'tv-bg'),
    ('[#d9ecfb]', 'tv-border'),
    ('[#edf4fa]', 'tv-border'),
    ('[#e4eef6]', 'tv-border'),
    ('[#b8d8f0]', 'tv-border'),
    ('[#e8f1fb]', 'tv-blue-light'),
    ('[#071827]', 'tv-ink'),
    ('[#334e60]', 'tv-ink-2'),
    ('[#476273]', 'tv-ink-3'),
    ('[#6f8594]', 'tv-ink-3'),
    ('[#40515d]', 'tv-ink-3'),
    ('[#34566f]', 'tv-ink-3'),
    ('[#5c6b73]', 'tv-ink-3'),
    ('[#687983]', 'tv-ink-3'),
    # Border radius
    ('rounded-3xl', 'rounded-tv-lg'),
    ('rounded-2xl', 'rounded-tv'),
    ('rounded-xl', 'rounded-tv-sm'),
    ('rounded-[18px]', 'rounded-tv'),
    ('rounded-[22px]', 'rounded-tv'),
    ('rounded-[26px]', 'rounded-tv'),
    ('rounded-[28px]', 'rounded-tv-lg'),
    ('rounded-[20px]', 'rounded-tv'),
    # Font weight
    ('font-black', 'font-bold'),
    # Shadows
    ('shadow-[0_14px_34px_rgba(2,68,120,0.08)]', 'shadow-tv-card'),
    ('shadow-[0_18px_42px_rgba(2,68,120,0.12)]', 'shadow-tv-hover'),
    ('shadow-[0_12px_30px_rgba(2,68,120,0.06)]', 'shadow-tv-card'),
    ('shadow-[0_16px_42px_rgba(2,68,120,0.1)]', 'shadow-tv-card'),
    ('shadow-[0_18px_44px_rgba(2,68,120,0.08)]', 'shadow-tv-card'),
    ('shadow-[0_18px_54px_rgba(2,68,120,0.08)]', 'shadow-tv-card'),
    ('shadow-[0_24px_60px_rgba(2,68,120,0.14)]', 'shadow-tv-hover'),
    ('shadow-[0_20px_46px_rgba(2,68,120,0.18)]', 'shadow-tv-hover'),
    ('shadow-[0_22px_54px_rgba(2,119,212,0.24)]', 'shadow-tv-hover'),
    ('shadow-[0_10px_24px_rgba(2,119,212,0.22)]', 'shadow-tv-card'),
]

files = [
    'apps/web/components/local-chat-concierge.tsx',
    'apps/web/components/skeleton.tsx',
    'apps/web/components/breadcrumbs.tsx',
    'apps/web/components/dark-mode-toggle.tsx',
    'apps/web/components/ai/budget-simulator.tsx',
    'apps/web/components/ai/compare-console.tsx',
    'apps/web/components/ai/mood-search-panel.tsx',
    'apps/web/components/ai/personality-quiz.tsx',
    'apps/web/app/ai-planner/page.tsx',
    'apps/web/app/chat/page.tsx',
    'apps/web/app/budget/page.tsx',
    'apps/web/app/compare/page.tsx',
    'apps/web/app/map/page.tsx',
    'apps/web/app/flights/page.tsx',
    'apps/web/app/hotels/page.tsx',
    'apps/web/app/hotels/[id]/page.tsx',
    'apps/web/app/experiences/page.tsx',
    'apps/web/app/support/page.tsx',
    'apps/web/app/loyalty/page.tsx',
    'apps/web/app/trips/page.tsx',
    'apps/web/app/personality/page.tsx',
    'apps/web/app/booking/[id]/page.tsx',
]

base = r'd:\VietNam_Travel'
total_updated = 0
total_skipped = 0
total_no_change = 0

for f in files:
    path = os.path.join(base, f)
    if not os.path.exists(path):
        print(f'SKIP (not found): {f}')
        total_skipped += 1
        continue
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    original = content
    change_count = 0
    for old, new in replacements:
        count = content.count(old)
        if count > 0:
            content = content.replace(old, new)
            change_count += count
    if content != original:
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(content)
        print(f'UPDATED ({change_count} replacements): {f}')
        total_updated += 1
    else:
        print(f'NO CHANGE: {f}')
        total_no_change += 1

print(f'\nSummary: {total_updated} updated, {total_no_change} unchanged, {total_skipped} skipped')
