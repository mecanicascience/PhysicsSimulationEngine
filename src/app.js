// ========== PSENGINE VARIABLES ==========
// ==== Core ====
import pSimulator from './core/Simulator';

// ==== Drawer ====
// Objects
import Point      from './drawer/objects/Point';
import Text       from './drawer/objects/Text';

// Root
import Animation  from './drawer/Animation';
import pSDrawer   from './drawer/Drawer';
import pSPlotter  from './drawer/Plotter';

// ==== Utilities ====
import Vector     from './utilities/Vector';


// ========== GLOBAL VARIABLES ==========
// ==== Drawer ====
// Objects
global.pSPoint     = Point;
global.pSText      = Text;

// Root
global.pSAnimation = Animation;

// ==== Utilities ====
global.Vector    = Vector;


// ========== PSENGINE LAUNCH ==========
import './core/init';
