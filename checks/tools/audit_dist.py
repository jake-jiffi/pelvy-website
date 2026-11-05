# Static audit of the built site: links, titles, descriptions, headings, images, schema.
import sys, re, json, os, html
from html.parser import HTMLParser

dist = sys.argv[1]
pages = []
for root, _, files in os.walk(dist):
    for f in files:
        if f.endswith('.html'):
            pages.append(os.path.join(root, f))

class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.title=''; self.in_title=False; self.desc=None; self.canon=None; self.h=[]; self.cur=None
        self.links=[]; self.imgs=[]; self.ld=[]; self.in_ld=False; self.og={}; self.robots=None; self.ids=set(); self.lang=None; self.buf=''
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        if tag=='html': self.lang=a.get('lang')
        if tag=='title': self.in_title=True
        if tag=='meta':
            if a.get('name')=='description': self.desc=a.get('content')
            if a.get('name')=='robots': self.robots=a.get('content')
            if (a.get('property') or '').startswith('og:'): self.og[a['property']]=a.get('content')
        if tag=='link' and a.get('rel')=='canonical': self.canon=a.get('href')
        if tag in ('h1','h2','h3','h4'): self.cur=tag; self.buf=''
        if tag=='a' and a.get('href') is not None: self.links.append(a['href'])
        if tag=='img': self.imgs.append(a)
        if tag=='script' and a.get('type')=='application/ld+json': self.in_ld=True; self.buf=''
    def handle_endtag(self, tag):
        if tag=='title': self.in_title=False
        if tag==self.cur: self.h.append((tag, re.sub(r'\s+',' ',self.buf).strip())); self.cur=None
        if tag=='script' and self.in_ld: self.ld.append(self.buf); self.in_ld=False
    def handle_data(self, d):
        if self.in_title: self.title+=d
        if self.cur or self.in_ld: self.buf+=d

site = {}
for p in sorted(pages):
    url = '/' + os.path.relpath(p, dist).replace('index.html','')
    x=P(); x.feed(open(p, encoding='utf-8').read()); site[url]=x

problems=[]; ext=set()
print(f"{'url':70} {'title':>5} {'desc':>5} h1 imgs")
for url,x in site.items():
    h1=[t for t in x.h if t[0]=='h1']
    noalt=[i for i in x.imgs if 'alt' not in i]
    print(f"{url[:70]:70} {len(x.title):5} {len(x.desc or ''):5} {len(h1)}  {len(x.imgs)}")
    if not (20 <= len(x.title) <= 65): problems.append(f'{url}: title length {len(x.title)}: {x.title}')
    if not x.desc or not (70 <= len(x.desc) <= 165): problems.append(f'{url}: description length {len(x.desc or "")}')
    if len(h1)!=1: problems.append(f'{url}: {len(h1)} h1')
    if noalt: problems.append(f'{url}: {len(noalt)} images without alt')
    if not x.canon and '404' not in url: problems.append(f'{url}: no canonical')
    if x.lang!='en-AU': problems.append(f'{url}: lang {x.lang}')
    for need in ('og:title','og:description','og:image','og:url'):
        if need not in x.og: problems.append(f'{url}: missing {need}')
    for i in x.imgs:
        if not i.get('width') or not i.get('height'): problems.append(f'{url}: image without dimensions {i.get("src","")[:50]}')
    for raw in x.ld:
        try: json.loads(raw)
        except Exception as e: problems.append(f'{url}: bad JSON-LD {e}')
    # heading order: no jump of more than one level down
    last=1
    for tag,_ in x.h:
        lvl=int(tag[1])
        if lvl>last+1: problems.append(f'{url}: heading jumps h{last} to h{lvl} at "{_[:40]}"')
        last=lvl
    for href in x.links:
        if href.startswith(('http://','https://')): ext.add(href); continue
        if href.startswith(('mailto:','tel:')): continue
        path, _, frag = href.partition('#')
        target = url if path=='' else path
        if not target.endswith('/') and '.' not in target.split('/')[-1]: problems.append(f'{url}: link without trailing slash {href}')
        if target not in site and not os.path.exists(os.path.join(dist, target.lstrip('/'))):
            problems.append(f'{url}: broken link {href}')
        elif frag and target in site and frag not in site[target].ids:
            problems.append(f'{url}: missing anchor {href}')
titles=[x.title for x in site.values()]; descs=[x.desc for x in site.values()]
for t in set(titles):
    if titles.count(t)>1: problems.append(f'duplicate title: {t}')
for d in set(descs):
    if d and descs.count(d)>1: problems.append(f'duplicate description: {d[:60]}')
print('\nPROBLEMS', len(problems)); [print(' -', p) for p in problems]
print('\nEXTERNAL', len(ext)); [print(' ', e) for e in sorted(ext) if 'linkedin.com/company' not in e][:60]
