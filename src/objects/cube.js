/**
 * Create a cube we can play with
 * 
 * @returns    object consisting of three matrices: vertices, colors and indices
 */
function cube() {
   // Define and store geometry
   // We use 4 vertices per face below. We duplicate vertices so each
   // face has its own 4 vertices. This means 24 vertices below
   // (6 faces * 4 vertices)

   let vertices = [     // 24 vertices defining the cube
      [-0.5, -0.5, -0.5, 1], // first face
      [0.5, -0.5, -0.5, 1],
      [0.5, 0.5, -0.5, 1],
      [-0.5, 0.5, -0.5, 1],
      [-0.5, -0.5, 0.5, 1], // second face
      [0.5, -0.5, 0.5, 1],
      [0.5, 0.5, 0.5, 1],
      [-0.5, 0.5, 0.5, 1],
      [-0.5, -0.5, -0.5, 1], // third face
      [0.5, -0.5, -0.5, 1],
      [0.5, -0.5, 0.5, 1],
      [-0.5, -0.5, 0.5, 1],
      [0.5, 0.5, -0.5, 1], // fourth face 
      [-0.5, 0.5, -0.5, 1],
      [0.5, 0.5, 0.5, 1],
      [-0.5, 0.5, 0.5, 1],
      [-0.5, -0.5, -0.5, 1], // fifth face
      [-0.5, 0.5, -0.5, 1],
      [-0.5, -0.5, 0.5, 1],
      [-0.5, 0.5, 0.5, 1],
      [0.5, -0.5, -0.5, 1], // sixth face
      [0.5, 0.5, -0.5, 1],
      [0.5, -0.5, 0.5, 1],
      [0.5, 0.5, 0.5, 1],
   ];

   // We still have 12 triangles, because we still have 6 faces (2 triangles per face)
   // The difference from previous example is that indices go to 23 (because we have
   // 24 vertices in total and faces do not share vertices anymore)
   // Note -- it is tricky to get this right by hand!  

   let indices = [
      [0, 1, 2],
      [0, 2, 3],
      [4, 5, 6],
      [4, 6, 7],
      [8, 9, 10],
      [8, 10, 11],
      [12, 13, 14],
      [13, 14, 15],
      [16, 17, 18],
      [17, 18, 19],
      [20, 21, 22],
      [21, 22, 23],
   ];

   // We define 24 colours (one colour per vertex). We group them by faces;
   // sets of four vertices belonging to the same face get the same colour   

   let colors = [
      [1, 0, 1, 1],    // purple
      [1, 0, 1, 1],
      [1, 0, 1, 1],
      [1, 0, 1, 1],
      [1, 1, 1, 1],    // white
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [0, 0, 1, 1],    // blue 
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [0, 0, 1, 1],
      [0, 1, 1, 1],    // cyan
      [0, 1, 1, 1],
      [0, 1, 1, 1],
      [0, 1, 1, 1],
      [1, 0, 0, 1],    // red
      [1, 0, 0, 1],
      [1, 0, 0, 1],
      [1, 0, 0, 1],
      [1, 1, 0, 1],    // yellow 
      [1, 1, 0, 1],
      [1, 1, 0, 1],
      [1, 1, 0, 1],
   ];

   let normals = [     // 24 vertices defining the cube
      [0, 0, -1, 0], // first face
      [0, 0, -1, 0],
      [0, 0, -1, 0],
      [0, 0, -1, 0],
      [0, 0, 1, 0], // second face
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, -1, 0, 0], // third face
      [0, -1, 0, 0],
      [0, -1, 0, 0],
      [0, -1, 0, 0],
      [0, 1, 0, 0], // fourth face 
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [-1, 0, 0, 0], // fifth face
      [-1, 0, 0, 0],
      [-1, 0, 0, 0],
      [-1, 0, 0, 0],
      [1, 0, 0, 0], // sixth face
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
   ];

   let texcoords = [
      [0, 0], [1, 0], [1, 1], [0, 1],
      [0, 0], [1, 0], [1, 1], [0, 1],
      [0, 0], [1, 0], [1, 1], [0, 1],
      [0, 0], [1, 0], [0, 1], [1, 1],
      [0, 0], [1, 0], [0, 1], [1, 1],
      [0, 0], [1, 0], [0, 1], [1, 1],
   ];
   return {
      vertices: vertices,
      colors: colors,
      indices: indices,
      normals: normals,
      texcoords: texcoords
   };
}
