import json, os, sys, base64, urllib.request, concurrent.futures as cf
K=os.environ["K"]; OUT=sys.argv[1]
BASE=("Hyperrealistic editorial lifestyle photograph, shot on a Sony A7 IV with a Sony FE 50mm f/1.4 GM lens at f/2, natural window light, "
"subtle film-like color grading, shallow depth of field, true-to-life skin texture with natural wrinkles, no retouching look, candid not posed. "
"An attractive, relatable upper-middle-class American couple in their late 30s to early 40s, tasteful casual clothing (knit sweater, oxford shirt, denim). "
"Setting: a warm, upscale home with Tuscan / Mediterranean influences: plaster walls, wood beams, arched windows, natural stone and olive tones. "
"Leave clean, uncluttered negative space in the top third of the frame for text overlay. No text, no logos, no watermarks, the iPad screen is turned away or shows a soft unreadable glow. ")
SHOTS={
"y1":"They sit side by side at a kitchen island in a home they are shopping for, the wife holding an iPad, both smiling with excitement, house keys and a coffee mug on the counter, morning light through an arched window.",
"y2":"They relax on a linen sofa in a living room, the husband holding an iPad while the wife leans on his shoulder smiling at the screen, a golden retriever asleep on a rug nearby, soft afternoon light.",
"y3":"At a wooden dining table with a laptop closed to one side and an iPad between them, the couple comparing options, the husband pointing at the screen and the wife smiling and nodding, bright natural window light.",
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
