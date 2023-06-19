#version 300 es
in vec4 in_pos;
out vec2 tpos;
out highp vec4 color;

uniform float Time;

void main() {
    gl_Position = in_pos;
    tpos = in_pos.xy;
    color = in_pos;
}