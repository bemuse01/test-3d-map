export default {
    vertex: `
        varying vec3 vPosition;

        void main(){
            vPosition = position;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragment: `
        uniform vec3 uColor;
        uniform float uDist;
        uniform float uOpacity;

        varying vec3 vPosition;

        void main(){
            float opacity = (1.0 - (distance(vPosition, vec3(0)) / uDist)) * uOpacity;
            gl_FragColor = vec4(uColor, opacity);
        }
    `
}