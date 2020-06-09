// ========== PSENGINE VARIABLES ==========
// ==== Core ====
import pSimulator from './core/Simulator';

// ==== Drawer ====
// Objects
import pSPoint    from './drawer/objects/Point';
import pSText     from './drawer/objects/Text';

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

// Root
global.pSAnimation = Animation;

// ==== Utilities ====
global.Vector      = Vector;


// ========== PSENGINE LAUNCH ==========
import './core/init';
