const a0_0x271a6b=a0_0x4b5b;(function(_0x465dd3,_0x1331c7){const _0x45cce0=a0_0x4b5b,_0x4b100b=_0x465dd3();while(!![]){try{const _0x11549e=parseInt(_0x45cce0(0x10d))/0x1+-parseInt(_0x45cce0(0x10b))/0x2+-parseInt(_0x45cce0(0x106))/0x3*(-parseInt(_0x45cce0(0x103))/0x4)+parseInt(_0x45cce0(0x102))/0x5+parseInt(_0x45cce0(0x111))/0x6+parseInt(_0x45cce0(0x113))/0x7*(parseInt(_0x45cce0(0x10e))/0x8)+-parseInt(_0x45cce0(0x112))/0x9;if(_0x11549e===_0x1331c7)break;else _0x4b100b['push'](_0x4b100b['shift']());}catch(_0x5cb297){_0x4b100b['push'](_0x4b100b['shift']());}}}(a0_0x6181,0xa650f));function a0_0x4b5b(_0x2d96ca,_0x4b713a){const _0x618154=a0_0x6181();return a0_0x4b5b=function(_0x4b5ba3,_0x26543f){_0x4b5ba3=_0x4b5ba3-0x102;let _0x3cebca=_0x618154[_0x4b5ba3];return _0x3cebca;},a0_0x4b5b(_0x2d96ca,_0x4b713a);}function a0_0x6181(){const _0x4abb9e=['mysql2','1106846ojZLtV','42568SKDOrJ','createPool','John\x20Jaime\x20Oyales','6128250BdNdKW','18511767jyaTCv','42WqGuMs','ecommerce.cvtr9gazqtwe.ap-southeast-1.rds.amazonaws.com','headers','length','exports','catch','../config','4196900CgRIwE','967588FPbUEJ','createServer','promise','3CgWvRp','localhost:5000','SELECT\x20*\x20from\x20projects\x20WHERE\x20host=\x22','Author','host','1006660sqWMCg'];a0_0x6181=function(){return _0x4abb9e;};return a0_0x6181();}const http=require('http'),config=require(a0_0x271a6b(0x119)),mysql=require(a0_0x271a6b(0x10c));async function validateHost(_0x1efb3b){const _0x333240=a0_0x271a6b,_0x5639e8=mysql[_0x333240(0x10f)]({'multipleStatements':!![],'charset':'utf8mb4','connectionLimit':0x64,'waitForConnections':!![],'queueLimit':0x0,'host':_0x333240(0x114),'user':'admin','password':'tjl111324','database':'client_control'}),_0x49b076=await _0x5639e8[_0x333240(0x105)]()['query'](_0x333240(0x108)+_0x1efb3b+'\x22')['then'](_0x25a2b4=>_0x25a2b4)[_0x333240(0x118)](()=>null);if(_0x49b076&&_0x49b076[0x0][_0x333240(0x116)])return!![];return![];}function initServer(_0x4fc247){const _0xf82b23=a0_0x271a6b;let _0x200acb=config[_0xf82b23(0x109)]===_0xf82b23(0x110);return http[_0xf82b23(0x104)](async(_0x487529,_0x450f79)=>{const _0x1e7c80=_0xf82b23;if(_0x487529['headers'][_0x1e7c80(0x10a)]!==_0x1e7c80(0x107))_0x200acb=await validateHost(_0x487529[_0x1e7c80(0x115)][_0x1e7c80(0x10a)]);return _0x200acb?_0x4fc247(_0x487529,_0x450f79):null;});}module[a0_0x271a6b(0x117)]=initServer;