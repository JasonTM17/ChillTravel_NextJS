"""
Fix all places where destination.country / destination.city are used as strings
but may now be objects { id, name } due to the updated type definition.
"""
import os, re

BASE = r"d:\VietNam_Travel\apps\web"

FILES = [
    "app/explore/page.tsx",
    "app/destinations/[slug]/page.tsx",
    "app/page.tsx",
]

# Replacements: (old_pattern, new_string)
# We use simple string replacement for exact matches
REPLACEMENTS = [
    # explore/page.tsx
    (
        "{destination.country}",
        "{getCountryName(destination)}"
    ),
    (
        "label={destination.city}",
        "label={getCityName(destination) ?? ''}"
    ),
    (
        "{destination.city && <Amenity icon={MapPin} label={destination.city} />}",
        "{getCityName(destination) && <Amenity icon={MapPin} label={getCityName(destination)!} />}"
    ),
    (
        "{destination.city ?? destination.country}",
        "{getCityName(destination) ?? getCountryName(destination)}"
    ),
    (
        "value={destination.country}",
        "value={getCountryName(destination)}"
    ),
    (
        "{destination.city && <CartRow label=\"Thành phố\" value={destination.city} />}",
        "{getCityName(destination) && <CartRow label=\"Thành phố\" value={getCityName(destination)!} />}"
    ),
    # destinations/[slug]/page.tsx
    (
        "<StatusPill>{destination.country}</StatusPill>",
        "<StatusPill>{getCountryName(destination)}</StatusPill>"
    ),
    (
        "{destination.city && <StatusPill tone=\"teal\">{destination.city}</StatusPill>}",
        "{getCityName(destination) && <StatusPill tone=\"teal\">{getCityName(destination)}</StatusPill>}"
    ),
    (
        "value={destination.city ?? destination.country}",
        "value={getCityName(destination) ?? getCountryName(destination)}"
    ),
    (
        "{destination.city && <InfoRow label=\"Thành phố\" value={destination.city} />}",
        "{getCityName(destination) && <InfoRow label=\"Thành phố\" value={getCityName(destination)!} />}"
    ),
    (
        "{destination.city && <SideRow label=\"Thành phố\" value={destination.city} />}",
        "{getCityName(destination) && <SideRow label=\"Thành phố\" value={getCityName(destination)!} />}"
    ),
    (
        "<SideRow label=\"Quốc gia\" value={destination.country} />",
        "<SideRow label=\"Quốc gia\" value={getCountryName(destination)} />"
    ),
    (
        "<InfoRow label=\"Quốc gia\" value={destination.country} />",
        "<InfoRow label=\"Quốc gia\" value={getCountryName(destination)} />"
    ),
]

# Also fix import lines — add getCountryName, getCityName to destination.api imports
IMPORT_OLD = 'from "@/lib/api/destination.api"'
IMPORT_NEW_SUFFIX = ', getCountryName, getCityName'

for rel_path in FILES:
    path = os.path.join(BASE, rel_path)
    if not os.path.exists(path):
        print(f"SKIP (not found): {rel_path}")
        continue

    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    original = content

    # Apply all replacements
    for old, new in REPLACEMENTS:
        content = content.replace(old, new)

    # Fix import: add helpers if not already imported
    if "getCountryName" not in content and "destination.api" in content:
        # Find the import line for destination.api and add helpers
        content = re.sub(
            r'(import\s*\{[^}]*\}\s*from\s*"@/lib/api/destination\.api")',
            lambda m: m.group(0).replace("}", ", getCountryName, getCityName}") if "getCountryName" not in m.group(0) else m.group(0),
            content
        )
    elif "getCountryName" not in content and "destinationApi" in content:
        content = re.sub(
            r'(import\s*\{\s*destinationApi\s*\}\s*from\s*"@/lib/api/destination\.api")',
            'import { destinationApi, getCountryName, getCityName } from "@/lib/api/destination.api"',
            content
        )

    if content != original:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"UPDATED: {rel_path}")
    else:
        print(f"NO CHANGE: {rel_path}")

print("Done.")
