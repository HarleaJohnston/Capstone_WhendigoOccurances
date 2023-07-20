import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

function App() {
  return (
      <div>
        <body>
        <div>
            <div> 
              <img className='bannerSize' src={process.env.PUBLIC_URL + '/Banner 1.png'}/>
            </div>
            <div class="container">
              <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
                <div class="col-md-3 mb-2 mb-md-0">
                  <a href="/" class="d-inline-flex link-body-emphasis text-decoration-none">
                    <svg class="bi" width="40" height="32" role="img" aria-label="Bootstrap"></svg>
                  </a>
                </div>

                <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                  <li><a href="#" class="nav-link px-2 link-secondary">Home</a></li>
                  <li><a href="/posts" class="nav-link px-2 link-secondary">Post Feed</a></li>
                  <li><a href="/collections" class="nav-link px-2 link-secondary">Collections</a></li>
                  <li><a href="/profile" class="nav-link px-2 link-secondary">Profile</a></li>
                </ul>

                <div class="col-md-3 text-end">
                  <button type="button" class="btn btn-outline-primary me-2">Login</button>
                  <button type="button" class="btn btn-primary">Sign-up</button>
                </div>
              </header>
            </div>      
          </div>
            <div className="ContentBox">
              <h1 className="HeaderFont">"Whendigo isn't a place where people live but settle. It's a place where specters, creatures, and the unknown rule. I wouldn't even say it's a town at all but a living being waiting to swallow us whole. - Francis Greeves Whendigo</h1>
                  <div className="Center">
                        <div className='Center'>
                            <div className="Column">
                                  <div className="Row">
                                <div className='Box'>
                                    <img className="ImgSize" src={process.env.PUBLIC_URL + '/WhendigoSign.png'}></img>
                                  </div>
                                  <div className="Box2">
                                    <h3 className="FontSize">Whendigo, Missouri</h3>
                                    <p className="FontSize2">
                                      Whendigo, Missouri was founded in 1831. Though the orginal town of Whendigo was burned to the ground in 1841. If the rumors are true, you can still find the charred remains deep in the woods around Dead Man's Walk.
                                      The current Whendigo, Missouri - "Missouri's most Haunted Town"  was rebuilt in 1842. Where it soon became a tourist hot spot for those who love all things that go bump in the night. 
                                    </p>
                                  </div>
                              </div>

                              <div className="spacer"></div>

                              <div className="Row">
                                  <div className="Box2">
                                    <h3 className="FontSize">Tourist Trap Whendigo</h3>
                                    <p className="FontSize2">
                                    After the fire, Whendigo residents started to have more strange happenings. Stories of creatures in the woods, cultists terrorizing citizens, and of ghosts seen around town and in the woods.
                                    Soon Wendigo became the tourist trap it’s known for around the 1950’s. Drawing the masses in with haunted locations like Dead Man’s Walk, Whendigo Inn, and St. Johns All Girls College. 
                                    </p>
                                  </div>
                                  <div className='Box3'>
                                    <img className="ImgSize" src={process.env.PUBLIC_URL + '/town.jpg'}></img>
                                </div>

                              </div>
                            </div>

                        </div>
                  </div>
            </div>
        </body>
        <div class="container">
          <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div class="col-md-4 d-flex align-items-center">
              <a href="/" class="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
                <svg class="bi" width="30" height="24"></svg>
              </a>
              <span class="mb-3 mb-md-0 text-body-secondary">© 2023 Company, Inc</span>
            </div>

            <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
              <li class="ms-3"><a class="text-body-secondary" href="#"><svg class="bi" width="24" height="24"></svg></a></li>
              <li class="ms-3"><a class="text-body-secondary" href="#"><svg class="bi" width="24" height="24"></svg></a></li>
              <li class="ms-3"><a class="text-body-secondary" href="#"><svg class="bi" width="24" height="24"></svg></a></li>
            </ul>
          </footer>
        </div>
      </div>


  );
}

export default App;
