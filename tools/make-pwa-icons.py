"""Rasterize the simple favicon geometry into installable PNG sizes."""

from pathlib import Path
import struct
import zlib


def rounded(x, y, left, top, right, bottom, radius):
    cx = min(max(x, left + radius), right - radius)
    cy = min(max(y, top + radius), bottom - radius)
    return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2


def color_at(x, y):
    if not rounded(x, y, 0, 0, 64, 64, 16):
        return (0, 0, 0, 0)
    for left, top, color in (
        (14, 14, (182, 243, 99, 255)),
        (35, 14, (71, 141, 85, 255)),
        (14, 35, (71, 141, 85, 255)),
        (35, 35, (182, 243, 99, 255)),
    ):
        if rounded(x, y, left, top, left + 15, top + 15, 4):
            return color
    return (11, 20, 17, 255)


def chunk(kind, data):
    body = kind + data
    return struct.pack('!I', len(data)) + body + struct.pack('!I', zlib.crc32(body) & 0xFFFFFFFF)


def render(size):
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            row.extend(color_at((x + .5) * 64 / size, (y + .5) * 64 / size))
        rows.append(row)
    header = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('!IIBBBBB', size, size, 8, 6, 0, 0, 0)
    return header + chunk(b'IHDR', ihdr) + chunk(b'IDAT', zlib.compress(b''.join(rows), 9)) + chunk(b'IEND', b'')


target = Path(__file__).resolve().parent.parent / 'icons'
target.mkdir(exist_ok=True)
for pixels in (192, 512):
    (target / f'icon-{pixels}.png').write_bytes(render(pixels))
