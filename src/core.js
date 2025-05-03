// DEBUG: Pause function
function togglePause() {
   paused = !paused;
}

/**
 * This function initialises GL and the viewport.
 */
function glInit() {
   // Initialise and clear viewport
   gl.clearColor(0., 0., 0., 1);
   gl.clearDepth(1.0);
   gl.viewport(0.0, 0.0, canvas.width, canvas.height);
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   gl.enable(gl.DEPTH_TEST);
}

/**
 * Load a cube map texture
 */
function loadCubeMap(urls) {
   const texture = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

   const faceInfos = [
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: urls[0] },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: urls[1] },
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: urls[2] },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: urls[3] },
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: urls[4] },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: urls[5] },
   ];

   let loaded = 0;

   faceInfos.forEach((faceInfo) => {
      const { target, url } = faceInfo;

      // Setup each face so it's immediately renderable
      gl.texImage2D(target, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([100, 100, 255, 255]));


      const image = new Image();
      image.addEventListener('load', function () {
         gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
         gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

         // Only set the texture active when all sides are loaded
         loaded++;
         if (loaded == 6) {
            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
         }

      });
      image.src = url;
   });
   gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
   return texture;
}

/*
 * Define the skybox geometry
 */
function createSkybox() {
   var vertices = [
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
   ];


   return {
      vertices: vertices,
   };
}

/**
 * Draw the skybox to the scene
 */
function drawSkybox() {
   gl.useProgram(skyboxShaderprogram)
   var skyboxVBO = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, skyboxVBO);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(skybox.vertices), gl.STATIC_DRAW);

   var positionAttributeLocation = gl.getAttribLocation(skyboxShaderprogram, "aPosition");
   gl.enableVertexAttribArray(positionAttributeLocation);
   gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);



   var projectionMatrix = P; // Assuming P is your projection matrix

   gl.bindTexture(gl.TEXTURE_CUBE_MAP, skyboxTexture)
   var uSkybox = gl.getUniformLocation(skyboxShaderprogram, "uSkybox");
   gl.uniform1i(uSkybox, 0);

   var u_viewDirectionProjectionInverse =
      gl.getUniformLocation(skyboxShaderprogram, "u_viewDirectionProjectionInverse");

   // Prepare the view and projection matrices
   var viewMatrix = mat4.create();
   mat4.invert(viewMatrix, M_view);
   // mat4.rotate(viewMatrix, viewMatrix, Math.PI, [0, 1, 0]); // Optional: Adjust based on your scene setup
   // Remove translation from the view matrix
   viewMatrix[12] = 0;
   viewMatrix[13] = 0;
   viewMatrix[14] = 0;

   mat4.multiply(projectionMatrix, projectionMatrix, viewMatrix)
   mat4.invert(projectionMatrix, projectionMatrix)
   gl.uniformMatrix4fv(u_viewDirectionProjectionInverse, false, projectionMatrix)

   // Draw the skybox
   gl.drawArrays(gl.TRIANGLES, 0, 12); // Assuming your skybox is made of 12 triangles (6 faces * 2 triangles each)

   // Clean up
   gl.disableVertexAttribArray(positionAttributeLocation);
   gl.useProgram(null);
}

function createTexture(src) {

   gl.activeTexture(gl.TEXTURE0)

   // Create and store data into texture buffer
   let texture = gl.createTexture();
   gl.bindTexture(gl.TEXTURE_2D, texture);
   // Fill with a single pixel so we can start rendering. This is standard approach in WebGL
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([127, 127, 255, 255]));

   // load image
   var image = new Image();

   image.addEventListener("load", function () {
      console.log('hello');
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
   });

   //image.src = "textures/marble10 diffuse 1k.jpg";
   //image.src = "textures/wood 01 Diffuse.jpg";
   image.src = src;
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

   return texture;

}

/**
 * This function draws an object using the supplied shader program
 * 
 * @param   bufferObject   An object returned by initObject
 * @param   shaderprogram  a shader program returned by createProgram
 */
function drawObject(bufferObject, shaderprogram) {
   gl.useProgram(shaderprogram);

   let vertex_buffer = bufferObject.vertex_buffer;
   let color_buffer = bufferObject.color_buffer;
   let normal_buffer = bufferObject.normal_buffer;
   let index_buffer = bufferObject.index_buffer;
   let number = bufferObject.numVertices;
   let tex_buffer = bufferObject.tex_buffer;
   let texture = bufferObject.texture;

   // Bind buffers
   gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
   let aPosition = gl.getAttribLocation(shaderprogram, "aPosition");
   gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(aPosition);

   gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
   let aColor = gl.getAttribLocation(shaderprogram, "aColor");
   gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(aColor);

   gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
   let aNormal = gl.getAttribLocation(shaderprogram, "aNormal");
   gl.vertexAttribPointer(aNormal, 4, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(aNormal);

   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

   gl.bindTexture(gl.TEXTURE_2D, bufferObject.texture)

   let useTexture = gl.getUniformLocation(shaderprogram, "useTexture");
   if (bufferObject.texture != null) {

      gl.uniform1i(useTexture, true)

      gl.bindBuffer(gl.ARRAY_BUFFER, tex_buffer);
      let aTexCoord = gl.getAttribLocation(shaderprogram, "aTexCoord");
      gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aTexCoord);
   } else {
      gl.uniform1i(useTexture, false)
   }


   gl.drawElements(gl.TRIANGLES, number, gl.UNSIGNED_SHORT, 0);
}

/**
 * This function initialises an object. It uploads all its arrays to the GPU
 * and records the references to each. We can then pass this object to drawObject
 * which will bind the arrays appropriately
 * 
 * @param   object         An object containing arrays for vertices, colors, normals, and indices
 * @param   shaderprogram  a shader program returned by createProgram
 */
function initObject(object, shaderprogram, texture, texType = gl.TEXTURE_2D) {
   gl.useProgram(shaderprogram);

   // Vertices, colors and indices arrive in the form of 2D matrix objects for ease of manipulation
   // We need to flatten them and convert them to JS arrays before passing them to WebGL
   let vertices = object.vertices.flat();
   let colors = object.colors.flat();
   let indices = object.indices.flat();
   let normals = object.normals.flat();
   let texcoords = object.texcoords.flat();

   // Create and store data into vertex buffer
   let vertex_buffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

   // Create and store data into color buffer
   let color_buffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

   // Create and store data into color buffer
   let normal_buffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

   // Create and store data into index buffer
   let index_buffer = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


   let tex_buffer = null;
   if (texture != null) {
      gl.bindTexture(texType, texture);

      tex_buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, tex_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
   }

   return {
      vertex_buffer: vertex_buffer,
      color_buffer: color_buffer,
      normal_buffer: normal_buffer,
      index_buffer: index_buffer,
      tex_buffer: tex_buffer,
      numVertices: indices.length,
      texture: texture
   };
}

/**
 * This function compiles the supplied vertex and fragment shaders into a program
 * 
 * @param   vertCode  Vertex shader code, written in GLSL
 * @param   fragCode  Fragment shader code, written in GLSL
 * 
 * @returns    Shader program
 */
function createProgram(vertCode, fragCode) {
   // Compile and upload shader programs
   let vertShader = gl.createShader(gl.VERTEX_SHADER);
   gl.shaderSource(vertShader, vertCode);
   gl.compileShader(vertShader);

   let fragShader = gl.createShader(gl.FRAGMENT_SHADER);
   gl.shaderSource(fragShader, fragCode);
   gl.compileShader(fragShader);

   let shaderprogram = gl.createProgram();
   gl.attachShader(shaderprogram, vertShader);
   gl.attachShader(shaderprogram, fragShader);
   gl.linkProgram(shaderprogram);

   gl.useProgram(shaderprogram);

   return shaderprogram;
}
