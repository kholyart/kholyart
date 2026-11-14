/* KHOLY ART — the hero's picture changes in real 3D: the wall becomes glass mosaic, a wave of tiles lifts
   toward the viewer, turns over, and shows the next picture on the back. WebGL (three.js), one draw call. */
import * as THREE from "./three.module.min.js";

var RTL = getComputedStyle(document.documentElement).direction === "rtl";
var HEIGHT_URL = "img/glass-height.jpg"; /* optional glass surface map (from Nader); procedural surface if missing */

function easeIO(q) { return q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2; }
function cover(iw, ih, W, H) { var ir = iw / ih, fr = W / H; return ir > fr ? [((1 - fr / ir) / 2), 0, fr / ir, 1] : [0, ((1 - ir / fr) / 2), 1, ir / fr]; }

var VS = [
  "uniform float uP,uF,uSize,uLift,uGrout,uW,uH; uniform float uAxisX;",
  "attribute vec3 aCell; attribute vec4 aRand;",
  "varying vec2 vA,vB,vL; varying vec3 vN; varying float vFace,vQ,vSeed,vG;",
  "mat3 rY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}",
  "mat3 rX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}",
  "mat3 rZ(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}",
  "float eio(float q){return q<.5?4.*q*q*q:1.-pow(-2.*q+2.,3.)/2.;}",
  "void main(){",
  "  float q=clamp((uP-aCell.z)/uF,0.,1.), e=eio(q), arc=sin(e*3.14159265);",
  "  float ang=e*3.14159265*aRand.z;",
  /* the grout grid lives only on the tiles that are moving: the picture stays whole in front of and behind the wave */
  "  float mv=smoothstep(0.,.12,q)*(1.-smoothstep(.88,1.,q)), gd=uGrout*mv;",
  "  float hj=fract(sin(dot(aCell.xy,vec2(12.9898,78.233)))*43758.5453)*2.-1., hk=fract(sin(dot(aCell.xy,vec2(39.35,11.13)))*24634.63)*2.-1.;",
  "  float sc=1.06-0.145*gd;",
  "  vec3 lp=position*vec3(uSize*sc,uSize*sc,uSize);",
  "  mat3 R=rZ(hj*0.05*gd)*(uAxisX>.5?rX(ang):rY(ang))*rZ(aRand.y*0.35*arc)*rX(aRand.x*0.25*arc);",
  "  vec3 wp=R*lp+vec3(aCell.xy+vec2(hj,hk)*uSize*0.035*gd,arc*uLift*(0.75+0.5*aRand.w));",
  "  vN=normalize(R*normal); vFace=normal.z; vQ=q; vSeed=aRand.w; vL=position.xy; vG=gd;",
  "  vec2 pa=(aCell.xy+position.xy*uSize)/vec2(uW,uH)+.5;",
  "  vec2 pb=(aCell.xy+(uAxisX>.5?vec2(position.x,-position.y):vec2(-position.x,position.y))*uSize)/vec2(uW,uH)+.5;",
  "  vA=pa; vB=pb;",
  "  gl_Position=projectionMatrix*modelViewMatrix*vec4(wp,1.);",
  "}"].join("\n");

var FS = [
  "uniform sampler2D tA,tB,tH; uniform vec4 cA,cB; uniform float uGrout,uHasH,uHasA;",
  "varying vec2 vA,vB,vL; varying vec3 vN; varying float vFace,vQ,vSeed,vG;",
  "float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
  "float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}",
  "vec3 img(sampler2D t,vec4 c,vec2 p){vec2 u=c.xy+p*c.zw;return texture2D(t,u).rgb;}",
  "void main(){",
  "  vec3 col; float side=step(abs(vFace),.5);",
  "  if(vFace>.5) col=uHasA>.5?img(tA,cA,vA):vec3(.9); else if(vFace<-.5) col=img(tB,cB,vB);",
  "  else col=mix(uHasA>.5?img(tA,cA,vA):vec3(.9),img(tB,cB,vB),vQ)*.62;",
  "  vec2 l=vL+.5; vec2 uvs=l+vSeed*7.;",
  "  float hgt=uHasH>.5?texture2D(tH,l).r:(.55+.10*n2(uvs*3.)+.04*n2(uvs*9.)-.05*step(.965,n2(uvs*27.)));",
  "  float edge=min(min(l.x,1.-l.x),min(l.y,1.-l.y));",
  "  float bev=smoothstep(0.,.16,edge);",
  "  vec3 n=normalize(vN);",
  "  vec2 g=vec2(dFdx(hgt),dFdy(hgt));",
  "  float gs=uHasH>.5?14.:3.; float pb=uHasH>.5?0.25:0.8;",
  "  vec3 np=normalize(n+vec3(-g*gs,0.)*vG+vec3((l-.5)*(1.-bev)*pb,0.)*vG*(1.-side));",
  "  vec3 L=normalize(vec3(-.45,.55,.7)); vec3 H=normalize(L+vec3(0.,0.,1.));",
  "  float base=dot(vec3(0.,0.,1.),L), d=dot(np,L);",
  "  float shade=1.+.55*(d-base)*vG;",
  "  float spec=pow(max(dot(np,H),0.),70.)*.55*vG + pow(max(dot(np,H),0.),12.)*.10*vG;",
  "  float fres=pow(1.-max(np.z,0.),3.)*.35*vG;",
  "  col=col*shade+vec3(1.,.96,.9)*(spec+fres);",
  "  col*=1.-.10*vG*(1.-bev);",
  "  gl_FragColor=vec4(col,1.);",
  "  #include <colorspace_fragment>",
  "}"].join("\n");

var SVS = [
  "uniform float uP,uF,uSize,uLift; attribute vec3 aCell; attribute vec4 aRand; varying float vA; varying vec2 vL;",
  "float eio(float q){return q<.5?4.*q*q*q:1.-pow(-2.*q+2.,3.)/2.;}",
  "void main(){float q=clamp((uP-aCell.z)/uF,0.,1.),arc=sin(eio(q)*3.14159265),lift=arc*uLift*(.75+.5*aRand.w);",
  " vA=arc; vL=position.xy;",
  " vec3 wp=vec3(aCell.xy+vec2(.18,-.26)*lift*.35+position.xy*uSize*(1.+lift/uSize*.25),-uSize*.6);",
  " gl_Position=projectionMatrix*modelViewMatrix*vec4(wp,1.);}"].join("\n");
var SFS = ["varying float vA; varying vec2 vL;",
  "void main(){vec2 d=abs(vL)*2.; float m=1.-smoothstep(.55,1.,max(d.x,d.y)); gl_FragColor=vec4(0.,0.,0.,.5*vA*m);}"].join("\n");

function tileGeometry() {
  var r = 0.12, s = new THREE.Shape(), h = 0.5 - r;
  s.moveTo(-h, -0.5); s.lineTo(h, -0.5); s.quadraticCurveTo(0.5, -0.5, 0.5, -h); s.lineTo(0.5, h); s.quadraticCurveTo(0.5, 0.5, h, 0.5);
  s.lineTo(-h, 0.5); s.quadraticCurveTo(-0.5, 0.5, -0.5, h); s.lineTo(-0.5, -h); s.quadraticCurveTo(-0.5, -0.5, -h, -0.5);
  var g = new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 1, curveSegments: 2 });
  g.translate(0, 0, -0.08); g.computeVertexNormals();
  /* faces: the front cap points to +z (picture A), the back cap to -z (picture B) */
  return g;
}

var GEO = null, HTEX = null, HREADY = 0;

function Stage(frame) {
  var cv = document.createElement("canvas"); cv.className = "tl3"; cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;z-index:2;border-radius:inherit";
  frame.appendChild(cv);
  var ren = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: /km3dtest/.test(location.search) });
  ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); ren.outputColorSpace = THREE.SRGBColorSpace;
  this.frame = frame; this.cv = cv; this.ren = ren; this.scene = new THREE.Scene(); this.cam = new THREE.PerspectiveCamera(28, 1, 1, 10000);
  this.W = 0; this.H = 0; this.mesh = null; this.shadow = null; this.u = null;
}
Stage.prototype.build = function (W, H, seed) {
  var small = W < 640, size = small ? Math.max(13, W / 26) : Math.max(15, W / 60);
  var cols = Math.ceil(W / size), rows = Math.ceil(H / size), n = cols * rows, s = seed || 7;
  function rnd() { s = (s * 16807) % 2147483647; return s / 2147483647; }
  var mode = seed % 3, ox = rnd() * cols, oy = rnd() * rows, maxD = Math.sqrt(cols * cols + rows * rows);
  var cell = new Float32Array(n * 3), rand = new Float32Array(n * 4), k = 0;
  for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++, k++) {
    var o;
    if (mode === 0) o = ((RTL ? cols - 1 - x : x) + y) / (cols + rows);
    else if (mode === 1) o = Math.sqrt((x - ox) * (x - ox) + (y - oy) * (y - oy)) / maxD * 1.3;
    else o = y / rows * 0.85 + Math.sin(x / cols * Math.PI * 2.5) * 0.07 + 0.07;
    cell[k * 3] = (x + 0.5) * size - cols * size / 2; cell[k * 3 + 1] = rows * size / 2 - (y + 0.5) * size; cell[k * 3 + 2] = Math.min(1, o) * 0.8 + rnd() * 0.2;
    rand[k * 4] = rnd() * 2 - 1; rand[k * 4 + 1] = rnd() * 2 - 1; rand[k * 4 + 2] = rnd() < 0.5 ? 1 : -1; rand[k * 4 + 3] = rnd();
  }
  if (!GEO) GEO = tileGeometry();
  var geo = new THREE.InstancedBufferGeometry().copy(GEO); geo.instanceCount = n;
  geo.setAttribute("aCell", new THREE.InstancedBufferAttribute(cell, 3)); geo.setAttribute("aRand", new THREE.InstancedBufferAttribute(rand, 4));
  var u = this.u || {
    uP: { value: 0 }, uF: { value: 0.42 }, uSize: { value: size }, uLift: { value: size * 2.4 }, uGrout: { value: 0 }, uW: { value: cols * size }, uH: { value: rows * size }, uAxisX: { value: 0 },
    tA: { value: null }, tB: { value: null }, tH: { value: HTEX }, cA: { value: new THREE.Vector4(0, 0, 1, 1) }, cB: { value: new THREE.Vector4(0, 0, 1, 1) }, uHasH: { value: HREADY }, uHasA: { value: 0 }
  };
  u.uSize.value = size; u.uLift.value = size * 2.4; this.mode = mode; this.ox = (ox / cols - 0.5) * cols * size; this.oy = (0.5 - oy / rows) * rows * size; u.uW.value = cols * size; u.uH.value = rows * size; u.uAxisX.value = mode === 2 ? 1 : 0;
  this.u = u;
  if (this.mesh) { this.scene.remove(this.mesh); this.mesh.geometry.dispose(); this.scene.remove(this.shadow); this.shadow.geometry.dispose(); }
  var mat = this.mat || (this.mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: VS, fragmentShader: FS, extensions: { derivatives: true } }));
  this.mesh = new THREE.Mesh(geo, mat); this.mesh.frustumCulled = false;
  var sg = new THREE.InstancedBufferGeometry().copy(new THREE.PlaneGeometry(1, 1)); sg.instanceCount = n;
  sg.setAttribute("aCell", geo.getAttribute("aCell")); sg.setAttribute("aRand", geo.getAttribute("aRand"));
  var smat = this.smat || (this.smat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: SVS, fragmentShader: SFS, transparent: true, depthWrite: false }));
  this.shadow = new THREE.Mesh(sg, smat); this.shadow.frustumCulled = false;
  var gp = this.grout || (this.grout = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0x5b5247, transparent: true })));
  gp.scale.set(cols * size, rows * size, 1); gp.position.z = -size * 0.7;
  this.scene.add(gp); this.scene.add(this.shadow); this.scene.add(this.mesh);
  var fov = this.cam.fov * Math.PI / 180, dist = (H / 2) / Math.tan(fov / 2);
  this.dist = dist; this.cam.aspect = W / H; this.cam.position.set(0, 0, dist); this.cam.near = dist * 0.2; this.cam.far = dist * 3; this.cam.lookAt(0, 0, 0); this.cam.updateProjectionMatrix();
  /* the picture covers W×H; the tile grid can overhang a few pixels, so the cover is computed on the grid size */
  this.gw = cols * size; this.gh = rows * size;
};
function texFrom(im) { var t = new THREE.Texture(im); t.colorSpace = THREE.SRGBColorSpace; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; t.needsUpdate = true; return t; }

var stages = new WeakMap();
function swap(frame, img, src, dur, seed, done) {
  var st = stages.get(frame); if (!st) { st = new Stage(frame); stages.set(frame, st); }
  var tok = (frame._tok3 = (frame._tok3 || 0) + 1), im = new Image(); im.decoding = "async"; im.crossOrigin = "anonymous";
  im.onload = function () {
    if (frame._tok3 !== tok || !document.contains(frame)) return;
    var b = frame.getBoundingClientRect(), W = Math.round(b.width), H = Math.round(b.height);
    st.ren.setSize(W, H, false); st.build(W, H, seed); st.W = W; st.H = H;
    var u = st.u, a = img.complete && img.naturalWidth ? img : null;
    if (u.tA.value) u.tA.value.dispose(); if (u.tB.value) u.tB.value.dispose();
    u.tA.value = a ? texFrom(a) : null; u.uHasA.value = a ? 1 : 0; u.tB.value = texFrom(im);
    if (a) { var ca = cover(a.naturalWidth, a.naturalHeight, st.gw, st.gh); u.cA.value.set(ca[0], ca[1], ca[2], ca[3]); }
    var cb = cover(im.naturalWidth, im.naturalHeight, st.gw, st.gh); u.cB.value.set(cb[0], cb[1], cb[2], cb[3]);
    u.tH.value = HTEX; u.uHasH.value = HREADY;
    /* the grid is never laid over the whole picture: each tile shows its edges only while it turns */
    var t0 = null, swapped = false;
    u.uP.value = 0; u.uGrout.value = 1; st.grout.material.opacity = 1; st.ren.render(st.scene, st.cam);
    st.cv.style.opacity = "1"; st.img = img; st.busy = true;
    function step(now) {
      if (frame._tok3 !== tok || !document.contains(frame)) return;
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / dur);
      if (window.__kmP != null) p = window.__kmP;
      u.uP.value = p * 1.42;
      st.ren.render(st.scene, st.cam);
      if (window.__kmP != null) { requestAnimationFrame(step); return; }
      if (p < 1) { requestAnimationFrame(step); return; }
      if (!swapped) { swapped = true; img.src = src; }
      var fin = function () { st.cv.style.opacity = "0"; st.busy = false; if (done) done(); };
      if (img.decode) img.decode().then(fin, fin); else fin();
    }
    requestAnimationFrame(step);
  };
  im.onerror = function () { img.src = src; if (done) done(); };
  im.src = src;
}

/* the picture at rest: the same tiles, standing still, with the grout grid at full strength */
var LIVE = new Set();
function still(frame, img) {
  if (!img || !img.complete || !img.naturalWidth) return;
  var st = stages.get(frame); if (!st) { st = new Stage(frame); stages.set(frame, st); }
  var b = frame.getBoundingClientRect(), W = Math.round(b.width), H = Math.round(b.height); if (!W || !H) return;
  st.ren.setSize(W, H, false); st.build(W, H, 7); st.W = W; st.H = H;
  var u = st.u; if (u.tA.value) u.tA.value.dispose(); if (u.tB.value) u.tB.value.dispose();
  u.tA.value = texFrom(img); u.tB.value = null; u.uHasA.value = 1; u.tB.value = u.tA.value;
  var ca = cover(img.naturalWidth, img.naturalHeight, st.gw, st.gh); u.cA.value.set(ca[0], ca[1], ca[2], ca[3]); u.cB.value.copy(u.cA.value);
  u.tH.value = HTEX; u.uHasH.value = HREADY; u.uP.value = 0; u.uGrout.value = 1; st.grout.material.opacity = 1;
  st.ren.render(st.scene, st.cam); st.cv.style.opacity = "1"; st.img = img; LIVE.add(frame);
}
var rzT = null;
window.addEventListener("resize", function () {
  
});

(function init() {
  try {
    var t = document.createElement("canvas"); if (!(t.getContext("webgl2") || t.getContext("webgl"))) return;
    var hi = new Image(); hi.onload = function () { HTEX = new THREE.Texture(hi); HTEX.needsUpdate = true; HTEX.wrapS = HTEX.wrapT = THREE.ClampToEdgeWrapping; HREADY = 1;  }; hi.src = HEIGHT_URL;
    window.KM3D = { swap: swap, still: still, ok: true };
  } catch (e) { /* the 2D tiles stay */ }
})();
