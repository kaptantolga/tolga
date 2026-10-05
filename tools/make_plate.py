# -*- coding: utf-8 -*-
"""Tek levha: tilsim + dairesel yazitin duz bire-bir transkripsiyonu."""
import sys
sys.path.insert(0, "/home/user/tolga/tools")
from PIL import Image
from make_tilsim import ArRender, parchment, REG, BOLD, INK, SOFT, BASMALA_T, IKHLAS_T, wrap

W, H = 2200, 2780
img = parchment(W, H, seed=11).convert("RGBA")
from PIL import ImageDraw
d = ImageDraw.Draw(img)
d.rectangle([90, 90, W - 90, H - 90], outline=INK + (255,), width=6)
d.rectangle([118, 118, W - 118, H - 118], outline=INK + (200,), width=2)

tal = Image.open("/home/user/tolga/images/koruma-tilsimi-arapca.png").convert("RGBA")
tal = tal.resize((1500, 1500), Image.LANCZOS)
img.paste(tal, (W // 2 - 750, 170), tal)

R, B = ArRender(REG), ArRender(BOLD)
y = 1740

def center(im, yy):
    img.paste(im, (int(W / 2 - im.size[0] / 2), int(yy)), im)
    return yy + im.size[1]

t, _ = R.render("TILSIMIN DAİRESEL YAZITI — DÜZ NÜSHA (bire bir)", 46, SOFT, direction="ltr")
y = center(t, y) + 26
im, _ = B.render(BASMALA_T, 116, INK)
y = center(im, y) + 20
for ln in wrap(R, IKHLAS_T, 96, W - 480):
    im, _ = R.render(ln, 96, INK)
    y = center(im, y) + 26
y += 24
d.line([W // 2 - 380, y, W // 2 + 380, y], fill=SOFT + (200,), width=3)
y += 26
t, _ = R.render("Şekil 1 — Koruma tılsımı ve üzerindeki yazıtın düz nüshası: Besmele + İhlâs (112).", 40, SOFT, direction="ltr")
y = center(t, y) + 8
t, _ = R.render("Dizgi: Amiri (naskh) + HarfBuzz GSUB/GPOS · Tam külliyat: images/tilsim-metin-sayfasi.png", 40, SOFT, direction="ltr")
center(t, y)
img.convert("RGB").save("/home/user/tolga/images/tilsim-levha.png")
print("plate OK, bottom", y)
