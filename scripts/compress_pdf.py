"""Lightly compress a PDF to fit under a size limit (default 24.3 MB), keeping image resolution.
Recompresses only the largest JPEG 2000 images (about 22% smaller each), in their own format.
Usage: python3 scripts/compress_pdf.py input.pdf output.pdf [target_bytes]"""
import io, os, sys
from PIL import Image
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, NumberObject

src, out = sys.argv[1], sys.argv[2]
target = int(sys.argv[3]) if len(sys.argv) > 3 else 24_300_000
w = PdfWriter(clone_from=PdfReader(src))
seen, objs = set(), []
for page in w.pages:
    for img in page.images:
        ref = img.indirect_reference
        if ref.idnum in seen:
            continue
        seen.add(ref.idnum)
        o = ref.get_object()
        if o.get('/Filter') == '/JPXDecode':
            objs.append((len(o._data), o))
objs.sort(key=lambda x: -x[0])
total, n = os.path.getsize(src), 0
for size, o in objs:
    if total <= target or size < 300_000:
        break
    im = Image.open(io.BytesIO(o._data)); im.load()
    raw = im.size[0] * im.size[1] * len(im.getbands())
    b = io.BytesIO()
    im.save(b, 'JPEG2000', quality_mode='rates', quality_layers=[raw / int(size * 0.78)], irreversible=True)
    data = b.getvalue()
    if len(data) >= size:
        continue
    o._data = data
    o[NameObject('/Length')] = NumberObject(len(data))
    total += len(data) - size
    n += 1
w.write(out)
print(f'{n} images recompressed, final size {os.path.getsize(out) / 1e6:.1f} MB')
