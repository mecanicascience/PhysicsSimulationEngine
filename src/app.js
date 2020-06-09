// ========== PSENGINE VARIABLES ==========
// ==== Core ====
import pSimulator from './core/Simulator';

// ==== Drawer ====
// Objects
import pSPoint    from './drawer/objects/Point';
import pSText     from './drawer/objects/Text';
import pSTriangle from './drawer/objects/Triangle';

// Root
import Animation  from './drawer/Animation';
import pSDrawer   from './drawer/Drawer';
import pSPlotter  from './drawer/Plotter';

// ==== Utilities ====
import Vector     from './utilities/Vector';


// ========== GLOBAL VARIABLES ==========
// ==== Drawer ====
// Objects
global.pSPoint     = pSPoint;
global.pSText      = pSText;
global.pSTriangle  = pSTriangle;

// Root
global.pSAnimation = Animation;

// ==== Utilities ====
global.Vector      = Vector;


// ========== PSENGINE LAUNCH ==========
import './core/init';
