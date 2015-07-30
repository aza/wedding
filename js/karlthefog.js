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
  $('header').css('visibility', 'visible').addClass('wow fadeIn')

}