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
global.Point     = Point;
global.Text      = Text;

// Root
global.Animation = Animation;

// ==== Utilities ====
global.Vector    = Vector;


// ========== PSENGINE LAUNCH ==========
import './core/init';
