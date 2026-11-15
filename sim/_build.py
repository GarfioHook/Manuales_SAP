# -*- coding: utf-8 -*-
"""Genera las guías HTML autocontenidas desde sim/_guias.json + la librería de pantallas.
   Uso:  python3 sim/_build.py      (desde la carpeta del proyecto)"""
import json, html, os, re
BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)
R = lambda n: open(os.path.join(BASE, n), encoding='utf-8').read()

TPL = '''<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TIT__</title><style>__CSS__</style></head><body>
<aside id="side">
 <header><a class="bk" href="../compendio.html">&lsaquo; Volver al compendio</a>
   <h1 id="h1"></h1><p id="sub"></p>
   <label class="soc">Sociedad <select id="socsel"></select></label></header>
 <div id="pbar"><div id="pfill"></div></div>
 <div id="list"></div>
 <div id="btns"><button id="prev">&lsaquo; Anterior</button><button id="next" class="p">Siguiente &rsaquo;</button></div>
</aside>
<main id="stage"><div id="tip"></div><div id="gui"></div></main>
<script>__SCR__
const GUIA=__GUIA__;
__RT__</script></body></html>'''

def build():
    css, scr, rt = R('_runtime.css'), R('_screens.js'), R('_runtime.js')
    specs = json.load(open(os.path.join(BASE, '_guias.json'), encoding='utf-8'))
    for s in specs:
        gj = json.dumps({k: s[k] for k in ('tx','titulo','sub','modulo','soc','pasos') if k in s}, ensure_ascii=False)
        out = (TPL.replace('__CSS__', css).replace('__SCR__', scr).replace('__RT__', rt)
                  .replace('__GUIA__', gj)
                  .replace('__TIT__', html.escape(s['tx'] + ' · ' + s['titulo'])))
        open(os.path.join(BASE, s['slug'] + '.html'), 'w', encoding='utf-8').write(out)

    # sincronizar el compendio
    cp = os.path.join(ROOT, 'compendio.html')
    h = open(cp, encoding='utf-8').read()
    # compendio = un registro por guía (manual v2) + manuales sin guía
    npasos = sum(len([p for p in s['pasos'] if 'screen' in p]) for s in specs)
    mandir = os.path.join(ROOT, 'Manuales_v2')
    pdfs = {f.split('_')[0]: f for f in sorted(os.listdir(mandir)) if f.endswith('.pdf')}
    def tit(f): return f.split('_', 1)[1].rsplit('.', 1)[0].replace('_', ' ')
    def modu(c): return 'Cross' if c.startswith('MAN-MD') else c.split('-')[1]
    data = []
    for c in sorted(pdfs, key=lambda c: ['MD','MM','SD','FI'].index(c.split('-')[1]) * 100 + int(c.split('-')[-1])):
        gs = [s for s in specs if s.get('man') == c]
        if not gs:
            data.append({'pdf': 'Manuales_v2/' + pdfs[c], 'man': c, 'tx': '—', 'titulo': tit(pdfs[c]),
                         'modulo': modu(c), 'familia': c, 'estado': 'politica', 'guia': ''})
        for s in gs:
            data.append({'pdf': 'Manuales_v2/' + pdfs[c], 'man': c, 'tx': s['tx'], 'titulo': s['titulo'],
                         'modulo': s['modulo'], 'familia': c, 'estado': 'simulado',
                         'guia': 'sim/%s.html' % s['slug']})
    h = re.sub(r'const DATA = \[[\s\S]*?\n\];',
               'const DATA = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';', h, count=1)
    h = re.sub(r"\['Pasos interactivos',\d+", "['Pasos interactivos',%d" % npasos, h)
    nscr = len(re.findall(r'^ *[a-z0-9]+:\((?:tab)?\)=>', open(os.path.join(BASE, '_screens.js'), encoding='utf-8').read(), re.M))
    h = re.sub(r"\['Pantallas base',\d+", "['Pantallas base',%d" % nscr, h)
    open(cp, 'w', encoding='utf-8').write(h)
    print('guías: %d · pasos: %d' % (len(specs), npasos))

if __name__ == '__main__':
    build()
