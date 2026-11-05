import sys, re, json, html

src, out = sys.argv[1], sys.argv[2]
h = open(src, encoding='utf-8', errors='replace').read()

def clean(s):
    s = re.sub(r'<svg.*?</svg>', '', s, flags=re.S)
    s = re.sub(r'<[^>]+>', '', s)
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()

pills = [clean(p) for p in re.findall(r'<span class="trust-pill">(.*?)</span>', h, flags=re.S)]

grid = h[h.find('<div class="grid">'):]
cards = re.split(r'<div class="card">', grid)[1:]
clinics = []
for c in cards:
    def one(pat):
        m = re.search(pat, c, flags=re.S)
        return clean(m.group(1)) if m else ''
    name = one(r'<h3>(.*?)</h3>')
    if not name:
        continue
    tags = [clean(t).replace(' ✓', '') for t in re.findall(r'<span class="tag[^"]*">(.*?)</span>', c, flags=re.S)]
    quote = one(r'<div class="quote">\s*<p>(.*?)</p>').strip('"“”')
    attr = one(r'<div class="attr">(.*?)</div>').lstrip('—– ').strip()
    rows = []
    for lab, val in re.findall(r'<span class="dlabel">(.*?)</span>\s*<span class="dval[^"]*">(.*?)</span>', c, flags=re.S):
        rows.append({'label': clean(lab), 'value': clean(val).replace(' ✓', '')})
    links = []
    for href, title in re.findall(r'<a href="([^"]+)"[^>]*title="([^"]*)"', c):
        links.append({'href': html.unescape(href), 'title': title})
    for href in re.findall(r'<a href="([^"]+)"', c):
        href = html.unescape(href)
        if not any(l['href'] == href for l in links):
            links.append({'href': href, 'title': ''})
    clinics.append({
        'name': name,
        'clinicians': one(r'<div class="clinician">(.*?)</div>'),
        'location': one(r'<div class="location">(.*?)</div>'),
        'tags': tags,
        'quote': quote,
        'quoteAttribution': attr,
        'details': rows,
        'links': links,
    })

json.dump({'source': 'https://pelvy.app/clinicians-directory/', 'captured': '2026-10-12', 'listed': pills, 'clinics': clinics},
          open(out, 'w'), indent=1, ensure_ascii=False)
print('pills', len(pills), 'cards', len(clinics))
print('with quote', sum(1 for c in clinics if c['quote']))
for c in clinics[:3]:
    print(json.dumps(c, ensure_ascii=False)[:900])
print('link titles:', sorted(set(l['title'] for c in clinics for l in c['links'])))
print('labels:', sorted(set(r['label'] for c in clinics for r in c['details'])))
print('names not in pills:', [c['name'] for c in clinics if c['name'].strip() not in [p.strip() for p in pills]])
