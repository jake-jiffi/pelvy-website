# Find the four corners of the phone's blank white screen by fitting a line to each
# straight edge of the bright region, then intersecting. No third-party imports.
import subprocess, sys

def load_gray(path):
    raw = subprocess.run(['magick', path, '-colorspace', 'Gray', '-depth', '8', 'pgm:-'], capture_output=True).stdout
    # parse P5 header
    parts, i = [], 0
    while len(parts) < 4:
        while raw[i:i+1].isspace(): i += 1
        if raw[i:i+1] == b'#':
            while raw[i:i+1] != b'\n': i += 1
            continue
        j = i
        while not raw[j:j+1].isspace(): j += 1
        parts.append(raw[i:j]); i = j
    i += 1
    w, h = int(parts[1]), int(parts[2])
    return w, h, raw[i:i + w * h]

def fit(points):  # least squares x = a*y + b (for near-vertical) handled by caller swapping
    n = len(points); sx = sum(p[0] for p in points); sy = sum(p[1] for p in points)
    sxx = sum(p[0] * p[0] for p in points); sxy = sum(p[0] * p[1] for p in points)
    a = (n * sxy - sx * sy) / (n * sxx - sx * sx); b = (sy - a * sx) / n
    return a, b

def quad(path, thr=232):
    w, h, px = load_gray(path)
    bright = lambda x, y: px[y * w + x] >= thr
    cx, cy = w // 2, h // 2
    assert bright(cx, cy), 'centre is not screen'
    # extents through the centre
    l = cx
    while l > 0 and bright(l - 1, cy): l -= 1
    r = cx
    while r < w - 1 and bright(r + 1, cy): r += 1
    t = cy
    while t > 0 and bright(cx, t - 1): t -= 1
    b = cy
    while b < h - 1 and bright(cx, b + 1): b += 1
    sw, sh = r - l, b - t
    left, right, top, bot = [], [], [], []
    for k in range(20, 81, 3):  # rows in the middle 60% of the height: straight part of the side edges
        y = t + sh * k // 100
        x = cx
        while x > 0 and bright(x - 1, y): x -= 1
        left.append((y, x))
        x = cx
        while x < w - 1 and bright(x + 1, y): x += 1
        right.append((y, x + 1))
    for k in range(15, 86, 3):  # bottom edge across the width
        x = l + sw * k // 100
        y = cy
        while y < h - 1 and bright(x, y + 1): y += 1
        bot.append((x, y + 1))
    for k in list(range(6, 20, 2)) + list(range(80, 95, 2)):  # top edge either side of the notch
        x = l + sw * k // 100
        y = t + sh * 12 // 100
        if not bright(x, y): continue
        while y > 0 and bright(x, y - 1): y -= 1
        top.append((x, y))
    la, lb = fit(left); ra, rb = fit(right)      # x = a*y + b
    ta, tb = fit(top); ba, bb = fit(bot)         # y = a*x + b
    def cross(va, vb, ha, hb):                   # x = va*y + vb ; y = ha*x + hb
        y = (ha * vb + hb) / (1 - ha * va); return (va * y + vb, y)
    c = [cross(la, lb, ta, tb), cross(ra, rb, ta, tb), cross(ra, rb, ba, bb), cross(la, lb, ba, bb)]
    return w, h, c

for p in sys.argv[1:]:
    w, h, c = quad(p)
    print(p.split('/')[-1], f'{w}x{h}')
    print('  px  TL TR BR BL:', [(round(x, 1), round(y, 1)) for x, y in c])
    print('  pct TL TR BR BL:', [(round(100 * x / w, 3), round(100 * y / h, 3)) for x, y in c])
