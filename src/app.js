const _pSglobalEngineInit = () => {
	new pSEngine();
};

// Run new configuration on document loaded
if(document.readyState === 'loading')
	_pSglobalEngineInit();
else
	window.addEventListener('load', _pSglobalEngineInit, false);
