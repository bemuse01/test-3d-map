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
        uniform float uZdist;

        varying vec3 vPosition;

        void main(){
            float horOpacity = (1.0 - (distance(vPosition, vec3(0)) / uDist)) * uOpacity;
            float verOpacity = (1.0 - distance(vPosition.z, 0.0) / uZdist) * uOpacity;
            gl_FragColor = vec4(uColor, horOpacity * verOpacity);
        }
    `
}