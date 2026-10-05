# -*- coding: utf-8 -*-
"""Koruma tilsimi: (A) foto graf uzerine dairesel bire-bir Arapca yazit,
(B) arastirma icin yazdirilabilir metin sayfasi."""
import sys, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
sys.path.insert(0, "/home/user/tolga/tools")
from ar_render import ArRender

REG = "/home/user/fonts/Amiri-Regular-full.ttf"
BOLD = "/home/user/fonts/Amiri-Bold-full.ttf"
INK = (43, 33, 23)
SOFT = (118, 96, 72)

BASMALA = ["بِسْمِ", "اللَّهِ", "الرَّحْمَٰنِ", "الرَّحِيمِ"]
IKHLAS = ["قُلْ", "هُوَ", "اللَّهُ", "أَحَدٌ", "اللَّهُ", "الصَّمَدُ",
          "لَمْ", "يَلِدْ", "وَلَمْ", "يُولَدْ", "وَلَمْ", "يَكُنْ", "لَهُ",
          "كُفُوًا", "أَحَدٌ"]

KURSI = ("اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ "
         "لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ "
         "يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ "
         "وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ")
FALAQ = ("قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِنْ شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ "
         "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾")
NAS = ("قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ "
       "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾")
IKHLAS_T = "قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ﴿٤﴾"
BASMALA_T = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"


# ---------------------------------------------------------------- (A) HALKA
def make_ring():
    R_ = ArRender(REG)
    img = Image.open("/home/user/tolga/images/koruma-tilsimi.png").convert("RGBA")
    W, H = img.size
    gray = np.array(img.convert("L"), np.float32)
    light = gray > 150
    light[:430, :430] = False          # mum
    light[:200, :] = False             # ahsap parlakliklari
    ys, xs = np.nonzero(light)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    Rad = ((xs.max() - xs.min()) + (ys.max() - ys.min())) / 4
    print("center", cx, cy, "R", Rad)

    YY, XX = np.mgrid[0:H, 0:W].astype(np.float32)
    rad = np.sqrt((XX - cx) ** 2 + (YY - cy) ** 2)
    r_in, r_out = 0.785 * Rad, 0.930 * Rad   # isin bandi (motifler iceride kalir)

    arr = np.array(img, np.float32)
    fill = arr.copy()
    rng = np.random.default_rng(5)
    for r in range(int(r_in) - 8, int(r_out) + 9):
        m = (rad >= r) & (rad < r + 1)
        if m.sum() == 0:
            continue
        med = np.median(arr[m][:, :3], axis=0)
        fill[m, 0] = med[0]; fill[m, 1] = med[1]; fill[m, 2] = med[2]
    blot = rng.normal(0, 1, (H // 50 + 2, W // 50 + 2, 3))
    blot = np.array(Image.fromarray(((blot - blot.min()) / (blot.max() - blot.min() + 1e-9) * 255).astype(np.uint8))
                    .resize((W, H), Image.BICUBIC), np.float32) / 255.0 - 0.5
    fill[..., :3] += blot * 9.0
    fill[..., :3] += rng.normal(0, 2.2, fill[..., :3].shape)
    feather = np.clip((rad - (r_in - 6)) / 8, 0, 1) * np.clip(((r_out + 6) - rad) / 8, 0, 1)
    mask = Image.fromarray((feather * 255).astype(np.uint8), "L")
    img.paste(Image.fromarray(np.clip(fill, 0, 255).astype(np.uint8), "RGBA"), (0, 0), mask)

    d = ImageDraw.Draw(img)
    for rr in (r_in + 4, r_out - 4):
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=INK + (235,), width=3)

    r_mid = (r_in + r_out) / 2
    band_h = r_out - r_in
    words = BASMALA + IKHLAS
    JUNC = len(BASMALA)                 # besmele|sure ayraci (gap after index JUNC-1)

    s = int(band_h * 0.62)
    for _ in range(8):
        ims = [R_.render(w, s, INK)[0] for w in words]
        mh = max(im.size[1] for im in ims)
        if mh <= band_h * 0.86:
            break
        s = max(20, int(s * band_h * 0.86 / mh))
    ims = [R_.render(w, s, INK)[0] for w in words]
    wang = [im.size[0] / r_mid for im in ims]
    sumW = sum(wang)
    g = (2 * math.pi * 0.965 - sumW) / 20.0     # 18 normal + 1 cift ayraç
    jg = 2 * g

    A = sum(wang[:JUNC]) + (JUNC - 1) * g + jg / 2.0
    theta = math.pi / 2 - A
    gap_centers = []
    th = theta
    for i in range(len(words)):
        th += wang[i]
        gp = jg if i == JUNC - 1 else g
        gap_centers.append((th + gp / 2, i))
        th += gp

    def rosette(bx, by, rr0):
        d.ellipse([bx - rr0 * 0.55, by - rr0 * 0.55, bx + rr0 * 0.55, by + rr0 * 0.55], fill=INK + (235,))
        for k in range(8):
            aa = k * math.pi / 4
            px_, py_ = bx + rr0 * 1.5 * math.cos(aa), by + rr0 * 1.5 * math.sin(aa)
            d.ellipse([px_ - rr0 * 0.62, py_ - rr0 * 0.62, px_ + rr0 * 0.62, py_ + rr0 * 0.62], fill=INK + (235,))

    bottom_gap = min(gap_centers, key=lambda t: abs(((t[0] - 3 * math.pi / 2 + math.pi) % (2 * math.pi)) - math.pi))
    th = theta
    for i, (im, wa) in enumerate(zip(ims, wang)):
        tc = th + wa / 2
        rot = im.rotate(-(math.degrees(tc) - 90), expand=True, resample=Image.BICUBIC)
        px = cx + r_mid * math.cos(tc)
        py = cy - r_mid * math.sin(tc)
        img.paste(rot, (int(px - rot.size[0] / 2), int(py - rot.size[1] / 2)), rot)
        th += wa
        gp = jg if i == JUNC - 1 else g
        gc = th + gp / 2
        if i != JUNC - 1 and abs(gc - bottom_gap[0]) < 1e-9:
            rosette(cx + r_mid * math.cos(gc), cy - r_mid * math.sin(gc), band_h * 0.11)
        th += gp
    img.convert("RGB").save("/home/user/tolga/images/koruma-tilsimi-arapca.png")
    print("ring OK, font", s, "gap deg", math.degrees(g))


# ---------------------------------------------------------------- (B) SAYFA
def parchment(w, h, seed=3):
    rng = np.random.default_rng(seed)
    base = np.zeros((h, w, 3), np.float32)
    base[..., 0], base[..., 1], base[..., 2] = 238, 229, 209
    blot = rng.normal(0, 1, (h // 60 + 2, w // 60 + 2, 3))
    blot = np.array(Image.fromarray(((blot - blot.min()) / (blot.max() - blot.min() + 1e-9) * 255).astype(np.uint8))
                    .resize((w, h), Image.BICUBIC), np.float32) / 255.0 - 0.5
    base[..., :3] += blot[..., :3] * 14
    grain = rng.normal(0, 2.0, (h, w, 1))
    base += grain
    yy, xx = np.mgrid[0:h, 0:w]
    vig = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    base *= (1 - 0.10 * np.clip(vig - 0.55, 0, 1))[..., None]
    return Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB")


def wrap(R, text, size, maxw):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        cand = (cur + " " + w).strip()
        if cur and R.measure(cand, size) > maxw:
            lines.append(cur)
            cur = w
        else:
            cur = cand
    if cur:
        lines.append(cur)
    return lines


def make_sheet():
    R, B = ArRender(REG), ArRender(BOLD)
    W, H = 2480, 3508
    img = parchment(W, H).convert("RGBA")
    d = ImageDraw.Draw(img)
    d.rectangle([110, 110, W - 110, H - 110], outline=INK + (255,), width=6)
    d.rectangle([140, 140, W - 140, H - 140], outline=INK + (200,), width=2)
    y = 250

    def center(im, yy, bold=False):
        img.paste(im, (int(W / 2 - im.size[0] / 2), int(yy)), im)
        return yy + im.size[1]

    t, _ = R.render("KORUMA TILSIMI · METİN SAYFASI  —  araştırma nüshası", 50, SOFT, direction="ltr")
    y = center(t, y) + 14
    t, _ = R.render("Metinler bire bir Unicode’dur; dizgi Amiri (naskh) + HarfBuzz GSUB/GPOS ile yapılmıştır.", 38, SOFT, direction="ltr")
    y = center(t, y) + 40

    im, _ = B.render(BASMALA_T, 100, INK)
    y = center(im, y) + 34

    def block(label, body, bsize):
        nonlocal y
        t, _ = R.render(label, 44, SOFT, direction="ltr")
        y = center(t, y) + 16
        for ln in wrap(R, body, bsize, W - 520):
            im, _ = R.render(ln, bsize, INK)
            y = center(im, y) + int(bsize * 0.35)
        y += 26

    block("ÂYETÜ’L-KÜRSÎ  (el-Bakara 2:255)", KURSI, 74)
    d.line([W // 2 - 420, y - 10, W // 2 + 420, y - 10], fill=SOFT + (200,), width=3)
    y += 26
    block("İHLÂS  (112)", BASMALA_T + " " + IKHLAS_T, 58)
    block("FELAK  (113)", BASMALA_T + " " + FALAQ, 58)
    block("NÂS  (114)", BASMALA_T + " " + NAS, 58)

    t, _ = R.render("Tılsım halkası yazıtı: Besmele + İhlâs Suresi  ·  Kaynak nüsha: images/koruma-tilsimi-arapca.png", 38, SOFT, direction="ltr")
    center(t, H - 230)
    img.convert("RGB").save("/home/user/tolga/images/tilsim-metin-sayfasi.png")
    print("sheet OK, bottom y =", y)


if __name__ == "__main__":
    make_ring()
    make_sheet()
