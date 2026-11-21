import json, os, sys, base64, urllib.request, concurrent.futures as cf
K=os.environ["K"]; OUT=sys.argv[1]
BASE=("Hyperrealistic editorial lifestyle photograph, shot on a Sony A7 IV with a Sony FE 50mm f/1.4 GM lens at f/2, natural window light, "
"subtle film-like color grading, shallow depth of field, true-to-life skin texture with natural wrinkles, no retouching look, candid not posed. "
"An affluent, healthy American couple in their late 60s, upper-middle-class, tasteful casual clothing (cashmere sweater, linen shirt). "
"Setting: a warm Tuscan-style home with travertine floors, hand-troweled plaster walls, exposed wood ceiling beams, arched windows, terracotta and olive tones. "
"Leave clean, uncluttered negative space in the top third of the frame for text overlay. No text, no logos, no watermarks, the iPad screen is turned away or shows a soft unreadable glow. ")
SHOTS={
"01":"They sit close together on a cream linen sofa in the living room, both looking at an iPad held by the wife, smiling warmly, morning light through an arched window behind them.",
"02":"They stand at a kitchen island of honed marble with copper pots and a bowl of lemons, coffee mugs in hand, the husband holding an iPad, both reading attentively and smiling slightly.",
"03":"Golden hour on a covered stone loggia overlooking cypress trees and rolling hills, they sit at a wrought-iron table with an iPad and two glasses of white wine, laughing together.",
"04":"In a home study with walnut bookshelves and a leather armchair, the husband points at the iPad screen while the wife leans in smiling, reading glasses on, warm lamp light mixed with daylight.",
"05":"At a rustic farmhouse dining table with a neat folder of paperwork, a pen and an iPad, the couple reviewing together thoughtfully, the wife smiling with relief, soft side window light.",
"06":"Wide environmental portrait: the couple relaxed on a terrace off the living room with potted olive trees and terracotta urns, wife holding the iPad, husband's arm around her, both smiling at the screen, late afternoon sun.",
}
def go(k):
    body=json.dumps({"model":"gpt-image-2","prompt":BASE+SHOTS[k],"size":"1024x1536","quality":"high","n":1}).encode()
    r=urllib.request.Request("https://api.openai.com/v1/images/generations",body,{"Authorization":"Bearer "+K,"Content-Type":"application/json"})
    d=json.load(urllib.request.urlopen(r,timeout=600))
    open(f"{OUT}/{k}.png","wb").write(base64.b64decode(d["data"][0]["b64_json"])); return k
with cf.ThreadPoolExecutor(6) as ex:
    for f in cf.as_completed([ex.submit(go,k) for k in SHOTS]):
        try: print("ok",f.result())
        except Exception as e: print("ERR",e, getattr(e,'read',lambda:b'')()[:500])
