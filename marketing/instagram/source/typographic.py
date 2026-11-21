import sys, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

S, OUT = sys.argv[1], sys.argv[2]
X = 2  # supersample
W, H = 1080 * X, 1350 * X
M = 92 * X

NAVY = (23, 50, 77); DEEP = (15, 35, 56); TEAL = (23, 107, 121); LTEAL = (133, 185, 186)
GOLD = (161, 123, 53); BGOLD = (204, 168, 98); CREAM = (246, 243, 236); INK = (24, 34, 48)
WHITE = (255, 255, 255); MUTED = (101, 113, 122)

THEMES = {
    "navy": dict(bg=NAVY, glow=(34, 72, 106), fg=WHITE, acc=BGOLD, sub=(200, 214, 224), line=(255, 255, 255, 40), mark=(255, 255, 255), ghost=255),
    "cream": dict(bg=(245, 241, 232), glow=(250, 247, 240), fg=NAVY, acc=GOLD, sub=MUTED, line=(23, 50, 77, 40), mark=NAVY, ghost=0),
    "teal": dict(bg=(19, 92, 104), glow=(30, 118, 132), fg=WHITE, acc=(232, 205, 148), sub=(208, 230, 232), line=(255, 255, 255, 46), mark=(255, 255, 255), ghost=255),
}

def F(name, size, wght, opsz=None):
    f = ImageFont.truetype(f"{S}/fonts/{name}.ttf", int(size * X))
    if name.startswith("SourceSerif"):
        f.set_variation_by_axes([wght, opsz or 60])
    else:
        f.set_variation_by_axes([opsz or 32 if size > 20 else 14, wght])
    return f

def serif(sz, w=600): return F("SourceSerif4", sz, w)
def ital(sz, w=500): return F("SourceSerif4-Italic", sz, w)
def sans(sz, w=500): return F("Inter", sz, w)

def tracked(d, x, y, text, f, fill, tr):
    for ch in text:
        d.text((x, y), ch, font=f, fill=fill); x += d.textlength(ch, font=f) + tr * X
    return x
def tracked_w(d, text, f, tr): return sum(d.textlength(c, font=f) + tr * X for c in text) - tr * X

def mark_layer(scale, color, alpha=(128, 255, 255), teal=LTEAL):
    s = scale * X
    L = Image.new("RGBA", (int(40 * s) + 4, int(42 * s) + 4)); d = ImageDraw.Draw(L)
    P = lambda pts: [(px * s, py * s) for px, py in pts]
    d.polygon(P([(4, 33), (4, 13), (13, 8), (13, 33)]), fill=color + (alpha[0],))
    d.polygon(P([(15, 33), (15, 8), (24, 3), (24, 33)]), fill=color + (alpha[1],))
    d.polygon(P([(26, 33), (26, 15), (35, 10), (35, 33)]), fill=teal + (alpha[2],))
    d.line(P([(5, 39), (20, 36), (35, 39)]), fill=color + (alpha[1],), width=max(2, int(2 * s)), joint="curve")
    return L

def base(theme):
    t = THEMES[theme]
    im = Image.new("RGBA", (W, H), t["bg"] + (255,))
    m = Image.new("L", (W // 4, H // 4)); ImageDraw.Draw(m).ellipse([-W * .05, -H * .09, W * .225, H * .14], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(65)).resize((W, H), Image.BILINEAR)
    im = Image.composite(Image.new("RGBA", (W, H), t["glow"] + (255,)), im, m)
    return im, t

def grain(im, amt):
    n = Image.effect_noise((W // 2, H // 2), 40).resize((W, H)).convert("L")
    n = n.point(lambda v: 128 + (v - 128) * 0.6)
    gl = Image.merge("RGBA", (n, n, n, Image.new("L", (W, H), amt)))
    return Image.alpha_composite(im, gl)

def header(im, t, kicker, num):
    d = ImageDraw.Draw(im)
    f = sans(19, 650)
    d.rectangle([M, 98 * X, M + 34 * X, 100 * X + 1], fill=t["acc"])
    tracked(d, M + 50 * X, 86 * X, kicker, f, t["acc"], 3.6)


def footer(im, t, cta="Compare at topproviderpicks.com"):
    d = ImageDraw.Draw(im)
    y = H - 150 * X
    d.line([(M, y), (W - M, y)], fill=t["line"], width=X)
    mk = mark_layer(1.15, t["mark"], teal=LTEAL if t["mark"] == (255, 255, 255) else TEAL)
    im.alpha_composite(mk, (M, y + 42 * X))
    d = ImageDraw.Draw(im)
    tracked(d, M + 60 * X, y + 41 * X, "TOP", sans(15, 500), t["fg"], 3.4)
    tracked(d, M + 60 * X, y + 62 * X, "PROVIDER PICKS", sans(20, 750), t["fg"], 2.6)
    fc = sans(21, 550)
    w = d.textlength(cta, font=fc)
    d.text((W - M - w, y + 54 * X), cta, font=fc, fill=t["fg"])
    d.text((W - M - w - 34 * X, y + 51 * X), "→", font=sans(24, 500), fill=t["acc"])

def headline(im, t, x, y, lines, size=104, lead=1.06, accent_italic=True):
    """lines: list of lists of (text, kind) where kind in 'r','a' (accent italic)."""
    d = ImageDraw.Draw(im)
    fr, fa = serif(size, 600), ital(size, 500)
    for segs in lines:
        cx = x
        for text, kind in segs:
            f = fa if kind == "a" else fr
            d.text((cx, y), text, font=f, fill=t["acc"] if kind == "a" else t["fg"])
            cx += d.textlength(text, font=f)
        y += int(size * lead * X)
    return y

def para(im, t, x, y, text, size=29, w=600, color=None, maxw=None, lead=1.45):
    d = ImageDraw.Draw(im); f = sans(size, 420)
    maxw = maxw or (W - 2 * M)
    words = text.split(); cur = ""; out = []
    for wd in words:
        tt = (cur + " " + wd).strip()
        if d.textlength(tt, font=f) <= maxw: cur = tt
        else: out.append(cur); cur = wd
    out.append(cur)
    for ln in out:
        d.text((x, y), ln, font=f, fill=color or t["sub"]); y += int(size * lead * X)
    return y

def pills(im, t, x, y, items, size=20):
    d = ImageDraw.Draw(im); f = sans(size, 600)
    for it in items:
        w = tracked_w(d, it.upper(), f, 1.6)
        bw = w + 40 * X
        if x + bw > W - M: x = M; y += 62 * X
        d.rounded_rectangle([x, y, x + bw, y + 46 * X], radius=23 * X, outline=t["acc"], width=int(1.5 * X))
        tracked(d, x + 20 * X, y + 11 * X, it.upper(), f, t["fg"], 1.6)
        x += bw + 14 * X
    return y + 46 * X

def ghost_mark(im, t, x, y, scale, alpha=22):
    a = alpha
    col = (255, 255, 255) if t["ghost"] == 255 else NAVY
    im.alpha_composite(mark_layer(scale, col, alpha=(a, int(a * 1.6), int(a * 1.6)), teal=col), (int(x), int(y)))

# ---------- motifs ----------
def motif_bars(im, t):  # gold: ascending ingot bars
    L = Image.new("RGBA", (W, H)); d = ImageDraw.Draw(L)
    bx, by = W - M - 330 * X, H - 210 * X
    for i, hgt in enumerate([150, 230, 320]):
        x0 = bx + i * 118 * X
        d.polygon([(x0, by), (x0, by - hgt * X), (x0 + 96 * X, by - hgt * X - 46 * X), (x0 + 96 * X, by)], fill=[(122, 94, 48, 255), (166, 128, 66, 255), (214, 178, 108, 255)][i])
    im.alpha_composite(L)

def motif_house(im, t):
    d = ImageDraw.Draw(im); c = t["acc"]; w = 4 * X
    cx, base_y = W - M - 200 * X, H - 215 * X
    roof = [(cx - 210 * X, base_y - 230 * X), (cx, base_y - 400 * X), (cx + 210 * X, base_y - 230 * X)]
    d.line(roof, fill=c, width=w, joint="curve")
    d.line([(cx - 170 * X, base_y - 262 * X), (cx - 170 * X, base_y), (cx + 170 * X, base_y), (cx + 170 * X, base_y - 262 * X)], fill=c, width=w, joint="curve")
    d.rectangle([cx - 40 * X, base_y - 130 * X, cx + 40 * X, base_y], outline=c, width=w)
    d.ellipse([cx - 26 * X, base_y - 300 * X, cx + 26 * X, base_y - 248 * X], outline=c, width=w)

def motif_cards(im, t):
    for i, (ang, a) in enumerate([(14, 70), (4, 140), (-7, 255)]):
        L = Image.new("RGBA", (int(520 * X), int(330 * X))); d = ImageDraw.Draw(L)
        col = t["acc"] if i == 2 else t["fg"]
        d.rounded_rectangle([6 * X, 6 * X, 514 * X, 324 * X], radius=30 * X, outline=col + (a,), width=4 * X)
        if i == 2:
            d.rounded_rectangle([50 * X, 96 * X, 126 * X, 150 * X], radius=10 * X, outline=col + (a,), width=4 * X)
            for k in range(4):
                d.rectangle([50 * X + k * 104 * X, 226 * X, 50 * X + k * 104 * X + 78 * X, 236 * X], fill=col + (a,))
        L = L.rotate(ang, expand=True, resample=Image.BICUBIC)
        im.alpha_composite(L, (int(W - M - L.width + 40 * X - i * 26 * X), int(H - 210 * X - L.height + i * 18 * X)))

def motif_columns(im, t):  # bank
    d = ImageDraw.Draw(im); c = t["acc"]; w = 4 * X
    cx, by = W - M - 210 * X, H - 215 * X
    d.polygon([(cx - 230 * X, by - 330 * X), (cx, by - 440 * X), (cx + 230 * X, by - 330 * X)], outline=c, width=w)
    d.line([(cx - 230 * X, by - 330 * X), (cx + 230 * X, by - 330 * X)], fill=c, width=w)
    for k in range(4):
        x0 = cx - 180 * X + k * 120 * X
        d.rectangle([x0, by - 300 * X, x0 + 40 * X, by - 40 * X], outline=c, width=w)
    d.line([(cx - 250 * X, by - 20 * X), (cx + 250 * X, by - 20 * X)], fill=c, width=w)
    d.line([(cx - 250 * X, by), (cx + 250 * X, by)], fill=c, width=w)

def motif_steps_down(im, t):
    L = Image.new("RGBA", (W, H)); d = ImageDraw.Draw(L)
    bx, by = W - M - 420 * X, H - 210 * X
    for i, hgt in enumerate([360, 270, 180, 90]):
        x0 = bx + i * 108 * X
        d.rectangle([x0, by - hgt * X, x0 + 84 * X, by], fill=t["acc"] + (int(255 * [0.9, 0.62, 0.4, 0.22][i]),))
    im.alpha_composite(L)

def motif_gauge(im, t):
    d = ImageDraw.Draw(im)
    cx, cy, r = W - M - 230 * X, H - 220 * X, 230 * X
    d.arc([cx - r, cy - r, cx + r, cy + r], 180, 360, fill=t["line"][:3] + (90,) if len(t["line"]) == 4 else t["line"], width=26 * X)
    d.arc([cx - r, cy - r, cx + r, cy + r], 180, 322, fill=t["acc"], width=26 * X)
    ang = math.radians(322); ri = r - 60 * X
    d.line([(cx, cy), (cx + ri * math.cos(ang), cy + ri * math.sin(ang))], fill=t["fg"], width=6 * X)
    d.ellipse([cx - 16 * X, cy - 16 * X, cx + 16 * X, cy + 16 * X], fill=t["fg"])

def motif_line(im, t):
    d = ImageDraw.Draw(im)
    pts = [(0, 0), (90, 40), (170, 10), (250, 110), (330, 90), (420, 200), (500, 260)]
    bx, by = W - M - 500 * X, H - 220 * X
    P = [(bx + px * X, by - py * X) for px, py in pts]
    d.line([(bx, by), (W - M, by)], fill=t["line"], width=2 * X)
    d.line(P, fill=t["acc"], width=6 * X, joint="curve")
    for p in P[1:]:
        d.ellipse([p[0] - 11 * X, p[1] - 11 * X, p[0] + 11 * X, p[1] + 11 * X], fill=t["bg"] if False else THEMES["teal"]["bg"], outline=t["acc"], width=5 * X)

def motif_scales(im, t):
    d = ImageDraw.Draw(im); c = t["acc"]; w = 4 * X
    cx, by = W - M - 220 * X, H - 215 * X
    d.line([(cx, by - 400 * X), (cx, by - 20 * X)], fill=c, width=w)
    d.line([(cx - 110 * X, by), (cx + 110 * X, by)], fill=c, width=w)
    d.line([(cx - 200 * X, by - 350 * X), (cx + 200 * X, by - 350 * X)], fill=c, width=w)
    d.ellipse([cx - 16 * X, by - 420 * X, cx + 16 * X, by - 388 * X], outline=c, width=w)
    for sx in (-200, 200):
        px = cx + sx * X
        d.line([(px, by - 350 * X), (px - 70 * X, by - 200 * X)], fill=c, width=w)
        d.line([(px, by - 350 * X), (px + 70 * X, by - 200 * X)], fill=c, width=w)
        d.arc([px - 80 * X, by - 270 * X, px + 80 * X, by - 130 * X], 0, 180, fill=c, width=w)
        d.line([(px - 80 * X, by - 200 * X), (px + 80 * X, by - 200 * X)], fill=c, width=w)


def button(im, t, x, y, text):
    d = ImageDraw.Draw(im); f = sans(26, 650)
    w = d.textlength(text, font=f) + 52 * X + 40 * X
    d.rounded_rectangle([x, y, x + w, y + 74 * X], radius=37 * X, fill=t["acc"])
    tc = WHITE if t is THEMES["cream"] else t["bg"]
    d.text((x + 34 * X, y + 20 * X), text, font=f, fill=tc)
    d.text((x + w - 58 * X, y + 17 * X), "→", font=sans(30, 600), fill=tc)
    return y + 74 * X

def motif_search(im, t):
    d = ImageDraw.Draw(im); c = t["acc"]; w = 10 * X
    cx, cy, r = W - M - 260 * X, H - 430 * X, 150 * X
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=c, width=w)
    d.line([(cx + r * .72, cy + r * .72), (cx + r * 1.55, cy + r * 1.55)], fill=c, width=24 * X)
    mk = mark_layer(4.4, t["mark"], teal=TEAL if t is THEMES["cream"] else LTEAL)
    im.alpha_composite(mk, (int(cx - 20 * 4.4 * X), int(cy - 22 * 4.4 * X)))

def motif_compare(im, t):
    L = Image.new("RGBA", (W, H)); d = ImageDraw.Draw(L)
    bx, by = W - M - 470 * X, H - 225 * X
    for i in range(3):
        x0 = bx + i * 160 * X; top = by - (330 if i == 1 else 290) * X
        hi = i == 1
        col = t["acc"] + (255,) if hi else t["fg"] + (110,)
        d.rounded_rectangle([x0, top, x0 + 136 * X, by], radius=18 * X, outline=col, width=(5 if hi else 3) * X)
        for k in range(3):
            d.rectangle([x0 + 26 * X, top + 120 * X + k * 44 * X, x0 + 110 * X, top + 128 * X + k * 44 * X], fill=col)
        if hi:
            cx, cy = x0 + 68 * X, top + 60 * X
            d.line([(cx - 26 * X, cy), (cx - 6 * X, cy + 20 * X), (cx + 28 * X, cy - 18 * X)], fill=col, width=8 * X, joint="curve")
    im.alpha_composite(L)

def promo(num, theme, kicker, lines, body, url, motif, size=104, name=None):
    im, t = base(theme)
    ghost_mark(im, t, W - 520 * X, 120 * X, 16, alpha=5 if theme == "cream" else 8)
    header(im, t, kicker, num)
    y = headline(im, t, M, 200 * X, lines, size=size)
    y += 44 * X
    y = para(im, t, M, y, body, size=30, maxw=W - 2 * M - 60 * X)
    y += 36 * X
    button(im, t, M, y, url)
    if motif: motif(im, t)
    footer(im, t, "Link in bio")
    im = grain(im, 4 if theme == "cream" else 12)
    im.convert("RGB").resize((1080, 1350), Image.LANCZOS).save(f"{OUT}/{name}.jpg", quality=95)

U = "topproviderpicks.com"
promo(1, "navy", "BEST GOLD IRA COMPANIES",
      [[("Looking for the", "r")], [("best gold IRA", "a")], [("companies?", "r")]],
      "We line them up side by side so you don't have to. See the full comparison on our site.", U, motif_bars, name="promo-01-gold")
promo(2, "cream", "BEST MORTGAGE COMPANIES",
      [[("Shopping for", "r")], [("a mortgage?", "r")], [("Compare lenders first.", "a")]],
      "Find the best mortgage companies, compared in plain English, all in one place.", U, motif_house, size=92, name="promo-02-mortgage")
promo(3, "teal", "BEST CREDIT CARDS",
      [[("Find the", "r")], [("best credit card", "a")], [("for you.", "r")]],
      "Cash back, travel and more. See how the top cards stack up on our site.", U, motif_cards, name="promo-03-credit-cards")
promo(4, "navy", "TOP PROVIDER PICKS",
      [[("The best", "r")], [("companies.", "r")], [("One place.", "a")]],
      "Gold IRAs, mortgages, banks, credit cards and more, compared side by side.", U, motif_compare, name="general-01-one-place")
promo(5, "cream", "BEFORE YOU SIGN ANYTHING",
      [[("Research first.", "r")], [("Sign second.", "a")]],
      "Look up the best companies in your category before you make the call.", U, motif_search, name="general-02-research-first")
promo(6, "teal", "PICK THE RIGHT COMPANY",
      [[("Big decision?", "r")], [("Compare before", "r")], [("you commit.", "a")]],
      "Honest, plain-English comparisons of the companies that handle your money.", U, motif_compare, name="general-03-compare")
print("done")
