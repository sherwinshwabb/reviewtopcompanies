import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S, OUT = sys.argv[1], sys.argv[2]
NAVY=(23,50,77); TEAL=(23,107,121); LTEAL=(133,185,186); GOLD=(201,163,92); WHITE=(255,255,255)
def font(name, size, wt):
    f=ImageFont.truetype(f"{S}/fonts/{name}.ttf", size); f.set_variation_by_axes([size if name=="SourceSerif4" else 14, wt] if name=="SourceSerif4" else [14, wt]) if False else None
    try: f.set_variation_by_name(wt)
    except Exception: pass
    return f
def mark_on(im, x, y, s):
    SS=4; w,h=int(40*s*SS)+8,int(42*s*SS)+8
    L=Image.new("RGBA",(w,h)); ld=ImageDraw.Draw(L); _mark(ld,0,0,s*SS); L=L.resize((w//SS,h//SS),Image.LANCZOS)
    im.alpha_composite(L,(int(x),int(y)))
def _mark(d, x, y, s, light=True):
    a,b,c = ((255,255,255,128),(255,255,255,255),LTEAL+(255,)) if light else ((23,50,77,128),NAVY+(255,),TEAL+(255,))
    P=lambda pts:[(x+px*s,y+py*s) for px,py in pts]
    d.polygon(P([(4,33),(4,13),(13,8),(13,33)]),fill=a)
    d.polygon(P([(15,33),(15,8),(24,3),(24,33)]),fill=b)
    d.polygon(P([(26,33),(26,15),(35,10),(35,33)]),fill=c)
    d.line(P([(5,39),(20,36),(35,39)]),fill=b,width=max(2,int(2*s)),joint="curve")
def wrap(d,text,f,w):
    lines=[];cur=""
    for word in text.split():
        t=(cur+" "+word).strip()
        if d.textlength(t,font=f)<=w: cur=t
        else: lines.append(cur);cur=word
    return lines+[cur]
def spaced(d,xy,text,f,fill,track):
    x,y=xy
    for ch in text: d.text((x,y),ch,font=f,fill=fill); x+=d.textlength(ch,font=f)+track
    return x
def spaced_w(d,text,f,track): return sum(d.textlength(c,font=f)+track for c in text)-track

POSTS=[
 ("01","GOLD IRA RESEARCH","Look up the best gold IRA companies first.","Plain-English comparisons, side by side."),
 ("02","BEFORE YOU SIGN","5 questions to ask a gold dealer before you pay.","Product · Delivered total · Buyback · Next steps · Time to think"),
 ("03","SPOT THE PITCH","Your retirement deserves more than a sales pitch.","Learn the pressure tactics to watch for."),
 ("04","KNOW THE COSTS","Gold IRA fees: what you'll actually pay.","One-time fees vs. yearly fees, on one page."),
 ("05","HOW IT WORKS","Dealer, custodian, depository. Know who holds your gold.","Understand the chain before you fund."),
 ("06","MEET TOP PROVIDER PICKS","Pick the right company the first time.","Gold IRAs · Mortgages · Banks · Credit cards · and more"),
]
W,H=1080,1350
for n,kick,head,sub in POSTS:
    im=Image.open(f"{S}/raw/{n}.png").convert("RGB").resize((1080,1620),Image.LANCZOS).crop((0,150,1080,1500)).convert("RGBA")
    # top navy gradient for legibility
    g=Image.new("RGBA",(W,H)); gd=ImageDraw.Draw(g)
    for y in range(H):
        t=max(0,1-y/720); gd.line([(0,y),(W,y)],fill=NAVY+(int(235*t**1.35),))
    for y in range(H-260,H):
        t=(y-(H-260))/260; gd.line([(0,y),(W,y)],fill=(10,22,35,int(150*t**1.5)))
    im=Image.alpha_composite(im,g); d=ImageDraw.Draw(im)
    M=72
    fk=font("Inter",26,"SemiBold"); y=84
    d.rectangle([M,y+6,M+40,y+9],fill=GOLD)
    spaced(d,(M+56,y-8),kick,fk,GOLD,3.5)
    fh=font("SourceSerif4",70,"SemiBold"); y+=58
    for ln in wrap(d,head,fh,W-2*M):
        d.text((M,y),ln,font=fh,fill=WHITE); y+=82
    fs=font("Inter",31,"Regular"); y+=24
    for ln in wrap(d,sub,fs,W-2*M):
        d.text((M,y),ln,font=fs,fill=(225,233,238)); y+=42
    # footer brand lockup
    mark_on(im,M,H-118,1.45); d=ImageDraw.Draw(im)
    ft=font("Inter",19,"Medium"); fb=font("Inter",25,"Bold")
    spaced(d,(M+74,H-117),"TOP",ft,WHITE,4); spaced(d,(M+74,H-90),"PROVIDER PICKS",fb,WHITE,3)
    fu=font("Inter",26,"Medium"); url="topproviderpicks.com"
    d.text((W-M-d.textlength(url,font=fu),H-96),url,font=fu,fill=WHITE)
    im.convert("RGB").save(f"{OUT}/post-{n}.jpg",quality=95)


def profile(with_text, name):
    P=1080; im=Image.new("RGBA",(P,P),NAVY+(255,))
    glow=Image.new("RGBA",(P,P)); gd=ImageDraw.Draw(glow); gd.ellipse([140,100,940,900],fill=(38,78,114,255)); glow=glow.filter(ImageFilter.GaussianBlur(170))
    im=Image.alpha_composite(im,glow)
    ring=Image.new("RGBA",(P*2,P*2)); ImageDraw.Draw(ring).ellipse([110,110,P*2-110,P*2-110],outline=GOLD+(255,),width=12); im.alpha_composite(ring.resize((P,P),Image.LANCZOS))
    s=12.5 if with_text else 15
    oy=-80 if with_text else -10
    mark_on(im,P/2-20*s,P/2-21*s+oy,s)
    if with_text:
        d=ImageDraw.Draw(im); fw=font("Inter",50,"Bold"); t="TOP PROVIDER PICKS"; w=spaced_w(d,t,fw,5)
        spaced(d,((P-w)/2,P/2+215),t,fw,WHITE,5)
    im.convert("RGB").save(f"{OUT}/{name}.png")
    c=im.copy(); m=Image.new("L",(P*2,P*2)); ImageDraw.Draw(m).ellipse([0,0,P*2,P*2],fill=255); c.putalpha(m.resize((P,P),Image.LANCZOS)); c.save(f"{OUT}/{name}-circle-preview.png")
profile(False,"profile-photo")
profile(True,"profile-photo-alt-wordmark")
