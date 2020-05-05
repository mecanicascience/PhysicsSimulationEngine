import pSEngine from './main';

const _pSglobalEngineInit = () => {
	new pSEngine();
};

const waitForDocumentReady = new Promise((resolve, reject) => {
    if(document.readyState === 'loading') // complete
        resolve();
    else
        window.addEventListener('load', resolve, false);
});

waitForDocumentReady.then(_pSglobalEngineInit);

export default pSEngine;
