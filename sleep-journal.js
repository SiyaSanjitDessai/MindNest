body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Times New Roman', serif;
  color: #F4F4F4;
}

.bg-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
}

.container {
  max-width: 700px;
  margin: auto;
  padding: 20px;
  background: rgba(102, 153, 204, 0.8);
  border-radius: 12px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
  margin-top: 30px;
  text-align: center;
}

.banner-image {
  width: 100%;
  height: auto;
  max-height: 250px;
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 20px;
  display: block;
}

input, textarea {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border-radius: 8px;
  border: none;
  background-color: #D6EAF8;
}

button {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background: linear-gradient(90deg, #A9CCE3, #6C87C2);
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: 0.3s;
}

button:hover {
  background: linear-gradient(90deg, #A9CCE3);
}

.entry {
  margin-top: 15px;
  padding: 12px;
  background: #AED6F1;
  border-radius: 8px;
  color: black;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.recommendation {
  font-style: italic;
  margin-top: 20px;
}

canvas {
  margin-top: 30px;
  background: white;
  border-radius: 10px;
}
