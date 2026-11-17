# Makes a copy of dist/ with relative links, so the site works inside a preview host.
import os, re, shutil, sys
src, dst = sys.argv[1], sys.argv[2]
shutil.rmtree(dst, ignore_errors=True); shutil.copytree(src, dst)
def rel(target, depth):
    path = target.lstrip('/')
    frag = ''
    if '#' in path: path, frag = path.split('#', 1); frag = '#' + frag
    if path == '' or path.endswith('/'): path += 'index.html'
    return '../' * depth + path + frag
for root, _, files in os.walk(dst):
    for f in files:
        if not f.endswith('.html'): continue
        p = os.path.join(root, f)
        depth = os.path.relpath(p, dst).count('/')
        s = open(p, encoding='utf-8').read()
        s = re.sub(r'(href|src|data-zoom)="(/(?!/)[^"]*)"', lambda m: f'{m[1]}="{rel(m[2], depth)}"', s)
        s = re.sub(r'srcset="([^"]*)"', lambda m: 'srcset="' + ', '.join(
            (rel(x.strip().split(' ')[0], depth) + (' ' + ' '.join(x.strip().split(' ')[1:]) if ' ' in x.strip() else '')) if x.strip().startswith('/') else x.strip()
            for x in m[1].split(',')) + '"', s)
        open(p, 'w', encoding='utf-8').write(s)
print('ok')
