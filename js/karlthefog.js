function createGlContext( cv )
{
    var gGLContext = null;
    var names = [ "webgl", "experimental-webgl", "webkit-3d", "moz-webgl" ];
    for( var i = 0; i<names.length; i++)
    {
        try
        {
            gGLContext = cv.getContext( names[i], {alpha: true, depth: false, antialias: false, stencil: true, premultipliedAlpha: false } );
        }
        catch( e )
        {
           gGLContext = null;
        }
        if( gGLContext )
             break;
    }

    return gGLContext;
}

function StartKarl(){
  var mCanvas = document.getElementById('canvas'),
      mMouseIsDown = false
      mMouseOriX = 0, mMouseOriY = 0, mMousePosX = 0, mMousePosY = 0

/*
  document.onmousedown = function(ev){
    mMouseOriX = (ev.pageX)*mCanvas.width/mCanvas.offsetWidth;
    mMouseOriY = mCanvas.height - (ev.pageY)*mCanvas.height/mCanvas.offsetHeight;
    mMouseIsDown = true;
    return false
  }
  document.onmousemove = function(ev){
    if( mMouseIsDown ){
      mMousePosX = (ev.pageX)*mCanvas.width/mCanvas.offsetWidth;
      mMousePosY = mCanvas.height - (ev.pageY)*mCanvas.height/mCanvas.offsetHeight;
      mMousePosY = -80
      console.log( mMousePosY)


    }
    return false
  }

  document.onmouseup = function(ev){
    mMouseIsDown = false;
    mMouseOriX = -Math.abs( mMouseOriX );
    mMouseOriY = -Math.abs( mMouseOriY );
  }*/

  
  glContext = createGlContext( document.getElementById('canvas') );
  
  mEffect = new Effect( false, glContext, mCanvas.width, mCanvas.height, null, this, false, false );
  mEffect.NewShader( document.getElementById('fshader').text)
  mEffect.NewTexture(0, {mType: 'texture', mID:0, mSrc:"gfx/noise.png"})
  
  function render(){ 
    var scrollPercent = window.scrollY/document.body.scrollHeight,
        scrollFirst = Math.min(window.scrollY/window.innerHeight, 1.0)

    $('.big').css('opacity', .5 - scrollFirst*1.2 )

  	var t = (new Date()).getTime()/4000.0 % 5000
    mEffect.Paint( t, 0, 0, 60*Math.sin(t*.4), -60+10*Math.sin(t*0.6)+scrollPercent*50 )
    requestAnimationFrame( render )
  }

  render()

  function snapToSection(){
    var tops = $('.big,.section').map(function(){return $(this).position().top-window.scrollY})
    tops = tops.sort(function(a,b){return a*a > b*b})

    $('html, body').stop(true).animate({
        scrollTop: tops[0]+window.scrollY
    }, 150).dequeue()

  }

  var snapTimer = null
  $(document).scroll(function(){
    if( snapTimer ) clearTimeout(snapTimer)
    snapTimer = setTimeout(function(){
        snapToSection()
    }, 300)
  })

  function save(){
    var rsvp = {
        name: $('#yourname').val(),
        email: $('#youremail').val(),
        people: $('#numpeople').val(),
        thought: $('#thought').val(),
        time: Date.now()
    }

    if( !rsvp.name || !rsvp.email || !rsvp.thought ){
      return
    }

    var rsvpRef = new Firebase("https://toelsewhere.firebaseio.com/rsvp")
    rsvpRef.push(rsvp)

    $('.entry').fadeOut(1000)
    $('<h1>').text("SEE YOU SOON. MEWRP.").hide().appendTo('.two .content').delay(1500).fadeIn(1000).delay(1500).fadeOut(2000, function(){
        $('html, body').stop(true).animate({
            scrollTop: 0
        }, 8000).dequeue()
    })

    console.log("RSVPing")
  }

  $('.rsvp').click(function(){
    save()
  })

  $(document).keyup(function(evt){
    if( evt.which == 13 ){ save() }
  })
}