#version 300 es
precision highp float;
out vec4 o_color;
in vec2 tpos;
in vec4 color;

uniform float Time;

vec2 CmplSet(float Re, float Im) {
    vec2 res = vec2(Re, Im);
    return res;
}

vec2 CmplAddCmpl(vec2 Z1, vec2 Z2) {
    vec2 res = vec2(Z1.x + Z2.x, Z1.y + Z2.y);
    return res;
}

vec2 CmplMulCmpl(vec2 Z1, vec2 Z2) {
    vec2 res = vec2(Z1.x * Z2.x - Z1.y * Z2.y, Z1.x * Z2.y + Z2.x * Z1.y);
    return res;
}

float CmplNorm(vec2 Z) {
    return sqrt(Z.x * Z.x + Z.y * Z.y);
}

float Mandelbrot(vec2 Z) {
    float n = 0.0;
    vec2 Z0 = Z;
    while(n < 255.0 && CmplNorm(Z) < 2.0)
        Z = CmplAddCmpl(CmplMulCmpl(Z, Z), Z0), n++;
    return n;
}

float Julia(vec2 Z, vec2 C) {
    float n = 0.0;

    while(n < 255.0 && CmplNorm(Z) < 2.0)
        Z = CmplAddCmpl(CmplMulCmpl(Z, Z), C), n++;
    return n;
}

void main() {
    float n = 0.0;
    vec2 z, c;

      //o_color = color * Julia(tpos, vec2(0.35, 0.38)) / 256.0;
    float x0 = -2.0, x1 = 2.0, y0 = -2.0, y1 = 2.0;

    z = CmplSet(x0 + gl_FragCoord.x * (x1 - x0) / 200.0, y0 + gl_FragCoord.y * (y1 - y0) / 200.0);
    c = CmplSet(0.35 + 0.08 * sin(Time + 3.0), 0.39 + 0.08 * sin(1.1 * Time));

    n = Julia(z, vec2(0.35, 0.38));
      //n = Mandelbrot(z);

    o_color = vec4(n / 255.0, n / (8.0 * 255.0), n * 8.0 / 255.0, 1);
      //o_color = vec4(n / 16.0, n / 128.0, n * 2.0, 1);
}