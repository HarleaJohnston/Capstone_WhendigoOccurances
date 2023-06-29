import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

function App() {
  return (
    <div>
      <div>
        <img className='bannerSize' src={process.env.PUBLIC_URL + '/Banner 1.png'}/>
      </div>
      <div class="navColor">
      <div class="container">
    <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
      <div class="col-md-3 mb-2 mb-md-0">
        <a href="/" class="d-inline-flex link-body-emphasis text-decoration-none">
          <svg class="bi" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
        </a>
      </div>

      <ul class="nav col-12 justify-content-center mb-md-0">
        <li><a href="#" class="nav-link px-2">Home</a></li>
        <li><a href="#" class="nav-link px-2">Post Feed</a></li>
        <li><a href="#" class="nav-link px-2">Gallery</a></li>
        <li><a href="#" class="nav-link px-2">Recordings</a></li>
      </ul>
    </header>
  </div>
      </div>
      

    </div>
  );
}

export default App;
