# -*- coding: utf-8 -*-
"""
HarfBuzz + FreeType tabanli Gercek Arapca dizgi motoru.
Yapay zeka ile metin "cizdirmez"; metni Unicode olarak bire bir alir,
GSUB/GPOS (ligatur + hareke konumlandirma) ile tipografik olarak dizer.
"""
import numpy as np
import uharfbuzz as hb
import freetype
from PIL import Image


class ArRender:
    def __init__(self, path):
        data = open(path, "rb").read()
        self.face_hb = hb.Face(hb.Blob(data))
        self.font_hb = hb.Font(self.face_hb)
        self.ft = freetype.Face.from_bytes(data)

    def shape(self, text, size, direction="rtl"):
        f = self.font_hb
        f.scale = (size * 64, size * 64)
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        buf.direction = direction
        hb.shape(f, buf)
        out = []
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            out.append((info.codepoint, pos.x_advance / 64.0,
                        pos.x_offset / 64.0, pos.y_offset / 64.0))
        return out

    def measure(self, text, size, direction="rtl"):
        return abs(sum(a for _, a, _, _ in self.shape(text, size, direction)))

    def render(self, text, size, color=(43, 33, 23), direction="rtl", pad=8):
        """Metni RGBA PIL Image olarak dondurur: (img, baseline_y)."""
        glyphs = self.shape(text, size, direction)
        self.ft.set_char_size(int(size * 64))
        pen = 0.0
        placed = []
        for gid, xa, xo, yo in glyphs:
            placed.append((gid, pen + xo, yo))
            pen += xa
        width = abs(pen)
        rtl = pen < 0

        items = []
        x0 = y0 = 1e9
        x1 = y1 = -1e9
        for gid, x, yo in placed:
            self.ft.load_glyph(gid, freetype.FT_LOAD_RENDER | freetype.FT_LOAD_NO_HINTING)
            g = self.ft.glyph
            bm = g.bitmap
            w_, h_ = bm.width, bm.rows
            if w_ == 0 or h_ == 0:
                continue
            X = (x + width) if rtl else x
            px = X + g.bitmap_left
            py = -g.bitmap_top - yo
            arr = np.asarray(bm.buffer, dtype=np.uint8).reshape(h_, bm.pitch)[:, :w_]
            items.append((arr, px, py, w_, h_))
            x0 = min(x0, px); x1 = max(x1, px + w_)
            y0 = min(y0, py); y1 = max(y1, py + h_)
        if not items:
            return Image.new("RGBA", (4, 4), (0, 0, 0, 0)), pad
        W = int(np.ceil(x1 - x0)) + 2 * pad
        H = int(np.ceil(y1 - y0)) + 2 * pad
        canvas = np.zeros((H, W), np.float32)
        for arr, px, py, w_, h_ in items:
            ix = int(round(px - x0)) + pad
            iy = int(round(py - y0)) + pad
            sub = canvas[iy:iy + h_, ix:ix + w_]
            np.maximum(sub, arr.astype(np.float32) / 255.0, out=sub)
        rgba = np.zeros((H, W, 4), np.uint8)
        rgba[..., 0] = color[0]; rgba[..., 1] = color[1]; rgba[..., 2] = color[2]
        rgba[..., 3] = (canvas * 255).astype(np.uint8)
        baseline_y = pad - y0
        return Image.fromarray(rgba, "RGBA"), baseline_y
