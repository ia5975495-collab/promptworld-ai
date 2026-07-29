// ============================================================
//  YOUR AD LOCKER — one key per AdsTerra unit.
//  Paste the EXACT "GET CODE" block (the whole <script>…</script>,
//  or the <a>…</a> for the smartlink) between the backticks ` `.
//  Empty (`) = localhost shows the "your space" placeholder and
//  the live site shows nothing (clean) until you fill it.
//
//  WHICH CODE GOES WHERE:
//   left     <-  Banner 160x300
//   right    <-  Native Banner
//   smart    <-  Smartlink   (see note below if GET CODE is a raw URL)
//   bottom   <-  Banner 468x60   (desktop)
//   bottomM  <-  Banner 320x50   (mobile)
//   pop      <-  Popunder
//   social   <-  Social Bar
// ============================================================

export const ADS = {
   topThin: `<script>
  atOptions = {
    'key' : '0572a97365c25eeccb4dd15c559df7e3',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/0572a97365c25eeccb4dd15c559df7e3/invoke.js"></script>
`,
  left: `<script>
  atOptions = {
    'key' : 'a40381fe7ebcb61d2b1bac0991c3c4ce',
    'format' : 'iframe',
    'height' : 300,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/a40381fe7ebcb61d2b1bac0991c3c4ce/invoke.js"></script>
`,
  right: `<script async="async" data-cfasync="false" src="https://pl30550652.effectivecpmnetwork.com/4b09122a00629a80aacda2204d2eedec/invoke.js"></script>
<div id="container-4b09122a00629a80aacda2204d2eedec"></div>
`,
  smart: `https://www.effectivecpmnetwork.com/cxmr7gq1?key=8b44a538be7fa0dd8a0fb526e1269543`,
  bottom: `<script>
  atOptions = {
    'key' : '88d9bb6eb75c780213bf82dc5159a497',
    'format' : 'iframe',
    'height' : 60,
    'width' : 468,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/88d9bb6eb75c780213bf82dc5159a497/invoke.js"></script>
`,
  bottomM: `<script>
  atOptions = {
    'key' : 'b1046b92a7ef244d82323a5160f441fd',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/b1046b92a7ef244d82323a5160f441fd/invoke.js"></script>
`,
  pop: `<script src="https://pl30550650.effectivecpmnetwork.com/73/ce/bf/73cebf3905a7754406499267ba32ae7c.js"></script>

`,
  social: `<script src="https://pl30550651.effectivecpmnetwork.com/88/77/ed/8877ed257f413749eacd593f407fe1a1.js"></script>

`,
};