from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
asset_dir = root / 'assets' / 'images'

TARGETS = [
    'logo-badge.png',
    'logo-kawanata.png',
    'icon.png',
    'adaptive-icon.png',
    'splash-icon.png',
    'logo-splash.png',
]

for name in TARGETS:
    path = asset_dir / name
    if not path.exists():
        print(f'SKIP {name}: not found')
        continue

    img = Image.open(path).convert('RGBA')
    img.save(path, format='PNG', optimize=True, compress_level=9)
    print(f'OPTIMIZED {name}: {path.stat().st_size} bytes')
