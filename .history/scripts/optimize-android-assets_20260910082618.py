from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
asset_dir = root / 'assets' / 'images'

MAX_DIMENSION = 1200
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
    width, height = img.size
    max_size = max(width, height)
    if max_size > MAX_DIMENSION:
        scale = MAX_DIMENSION / max_size
        new_size = (max(1, int(width * scale)), max(1, int(height * scale)))
        img = img.resize(new_size, Image.Resampling.LANCZOS)

    img.save(path, format='PNG', optimize=True, compress_level=9)
    print(f'OPTIMIZED {name}: {path.stat().st_size} bytes')
