const a0_0x6aa566=a0_0x3f16;(function(_0xe522cc,_0x1e5cac){const _0x5c8536=a0_0x3f16,_0x5e2c77=_0xe522cc();while(!![]){try{const _0x373f85=-parseInt(_0x5c8536(0xad))/0x1*(-parseInt(_0x5c8536(0xae))/0x2)+parseInt(_0x5c8536(0xcd))/0x3*(parseInt(_0x5c8536(0xbc))/0x4)+-parseInt(_0x5c8536(0xd0))/0x5*(-parseInt(_0x5c8536(0xde))/0x6)+parseInt(_0x5c8536(0xd2))/0x7+parseInt(_0x5c8536(0x100))/0x8+-parseInt(_0x5c8536(0xf1))/0x9+-parseInt(_0x5c8536(0x104))/0xa;if(_0x373f85===_0x1e5cac)break;else _0x5e2c77['push'](_0x5e2c77['shift']());}catch(_0x2595b1){_0x5e2c77['push'](_0x5e2c77['shift']());}}}(a0_0xfba7,0x9c096));const moment=require('moment'),pool=require('../../dbconnect');class BaseModelUtils{['openConnection']=async()=>{const _0xbd9eb=a0_0x3f16;if(!this[_0xbd9eb(0xf0)])this[_0xbd9eb(0xf0)]=await pool['promise']()[_0xbd9eb(0xdd)]();};['getPaginationCountCallback']=(_0x230f56,_0x142e76,_0x259751,_0x36bd56)=>{const _0x146153=a0_0x3f16;_0x142e76=+_0x142e76;let _0x3daee1=_0x36bd56?_0x36bd56[0x0]:+_0x230f56[0x0][0x0][0x0]['total'];const _0x4af769=_0x36bd56?_0x36bd56[0x1]:_0x230f56[0x0][0x1][0x0]['total'],_0x193f1b=_0x3daee1===0x0?0x0:+_0x259751*(+_0x142e76-0x1)+0x1,_0x20ea62=+_0x259751*+_0x142e76;let _0x4f8ec5={'rawTotal':_0x4af769,'total':_0x3daee1,'pages':Math[_0x146153(0xc2)](_0x3daee1/+_0x259751),'currentPage':_0x142e76,'prevPage':_0x142e76>0x1?_0x142e76-0x1:0x1,'pageSize':_0x259751,'showing':_0x193f1b+_0x146153(0xc1)+(_0x20ea62>_0x3daee1?_0x3daee1:_0x20ea62)};return _0x4f8ec5[_0x146153(0xf9)]=+_0x4f8ec5['currentPage']<+_0x4f8ec5[_0x146153(0xf7)]?+_0x4f8ec5[_0x146153(0xfb)]+0x1:+_0x4f8ec5[_0x146153(0xf7)],_0x4f8ec5[_0x146153(0xc8)]=[],_0x4f8ec5;};[a0_0x6aa566(0xc4)]=async(_0x156dfb,_0x1374db)=>{const _0x3773ea=a0_0x6aa566;return _0x1374db['firstData']=_0x156dfb&&_0x156dfb[0x0][0x0]?this[_0x3773ea(0xdb)]({'data':_0x156dfb[0x0][0x0],'fillables':this[_0x3773ea(0xf2)]}):null,_0x1374db['data']=_0x156dfb?this[_0x3773ea(0xdb)]({'data':_0x156dfb[0x0][0x1],'fillables':this[_0x3773ea(0xf2)]}):null,_0x1374db[_0x3773ea(0xe2)]&&(_0x1374db['firstData']=await this[_0x3773ea(0xdc)](_0x1374db[_0x3773ea(0xe2)]),_0x1374db[_0x3773ea(0xe2)]=await this['getAppendedAttributes'](_0x1374db[_0x3773ea(0xe2)]),_0x1374db['firstData']=_0x1374db[_0x3773ea(0xe2)][0x0],_0x1374db[_0x3773ea(0xc8)]=await this['retRelationships'](_0x1374db['data']),_0x1374db[_0x3773ea(0xc8)]=await this['getAppendedAttributes'](_0x1374db[_0x3773ea(0xc8)])),_0x1374db;};[a0_0x6aa566(0xdc)]=async _0x688a06=>{const _0x4353e8=a0_0x6aa566,{withTables:_0x1f2e8f}=this;let _0x4448f2=[];if(_0x1f2e8f[_0x4353e8(0xe4)]&&_0x688a06['length'])return _0x4448f2=await Promise[_0x4353e8(0xc6)](_0x688a06[_0x4353e8(0xcb)](async _0x3b4eff=>{const _0x14e5ea=_0x4353e8;return await Promise[_0x14e5ea(0xc6)](_0x1f2e8f[_0x14e5ea(0xcb)](async _0x40908a=>{const _0x4ae791=_0x14e5ea,_0x40b674=require('../../../models/'+_0x40908a[_0x4ae791(0xfc)]);let _0x3fd12d=new _0x40b674(this[_0x4ae791(0xf0)]);if(_0x40908a[_0x4ae791(0x109)])_0x3fd12d=_0x3fd12d[_0x4ae791(0x109)](_0x40908a[_0x4ae791(0x109)][_0x4ae791(0xee)](/-(?![^()]*(?:\([^()]*\))?\))/));_0x40908a[_0x4ae791(0xe8)]&&typeof _0x40908a[_0x4ae791(0xe8)]===_0x4ae791(0xb8)&&Object[_0x4ae791(0xc3)](_0x40908a[_0x4ae791(0xe8)])[_0x4ae791(0xcb)](_0x4c03c4=>{const _0x436b53=_0x4ae791;if(_0x4c03c4===_0x436b53(0xce))_0x3fd12d=_0x3fd12d[_0x4c03c4](_0x40908a[_0x436b53(0xe8)][_0x4c03c4][0x0],_0x40908a[_0x436b53(0xe8)][_0x4c03c4][0x1]);else _0x3fd12d=_0x3fd12d[_0x4c03c4](_0x40908a[_0x436b53(0xe8)][_0x4c03c4]);});const _0x1ef889=await _0x3fd12d['where']({[_0x40908a[_0x4ae791(0xd8)]]:{'value':_0x3b4eff[_0x40908a[_0x4ae791(0xdf)]]}})[_0x40908a[_0x4ae791(0xff)]]();_0x3b4eff[_0x40908a[_0x4ae791(0xfe)]]=null;if(_0x1ef889&&!_0x1ef889[_0x4ae791(0x102)]){_0x40908a[_0x4ae791(0xfe)]=this['extractRelKey'](_0x40908a[_0x4ae791(0xfe)]),_0x3b4eff[_0x40908a['key']]=_0x1ef889;if(_0x40908a[_0x4ae791(0xc9)])_0x3b4eff[_0x40908a[_0x4ae791(0xfe)]]=_0x40908a[_0x4ae791(0xc9)](_0x3b4eff[_0x40908a['key']]);}return _0x3b4eff;})),_0x3b4eff;})),_0x4448f2;else return _0x688a06;};[a0_0x6aa566(0x105)]=async _0x26a0fa=>{const _0x1dd51b=a0_0x6aa566;let _0x146cc1=[];if(this['appends']&&this[_0x1dd51b(0xb2)]['length'])_0x146cc1=await Promise['all'](_0x26a0fa['map'](async _0x51cddb=>{const _0x3c8e0b=_0x1dd51b;return await Promise[_0x3c8e0b(0xc6)](this[_0x3c8e0b(0xb2)][_0x3c8e0b(0xcb)](async _0x21c68a=>{const _0x32dc95=_0x3c8e0b,_0x16f3b4=_0x21c68a[_0x32dc95(0xee)]('_')[_0x32dc95(0xcb)](_0x1960cf=>_0x1960cf['charAt'](0x0)['toUpperCase']()+_0x1960cf['slice'](0x1))[_0x32dc95(0xf6)]('');if(this[_0x32dc95(0xb7)+_0x16f3b4])_0x51cddb=await this[_0x32dc95(0xb7)+_0x16f3b4](_0x51cddb,this[_0x32dc95(0xf0)]);return _0x51cddb;})),_0x51cddb;}));else _0x146cc1=_0x26a0fa;return _0x146cc1;};['generateValidFields']=(_0x35b0ef,_0x30aa94)=>{const _0x3bce76=a0_0x6aa566;let _0x2010c3=[];return _0x35b0ef[_0x3bce76(0xcb)](_0x42de5c=>{const _0x3091b9=_0x3bce76;_0x30aa94[_0x42de5c]!==undefined&&_0x2010c3[_0x3091b9(0x101)](_0x42de5c);}),_0x2010c3;};['queryBuilderV2']=(_0x445111,_0x13ecc0={})=>{const _0x27855a=a0_0x6aa566,_0x50e474={'join':!![],'where':!![],'group':!![],'having':!![],'order':!![],'limit':!![],'skip':!![],..._0x13ecc0};let _0x358bf8=_0x445111;const _0x4b0505=Object[_0x27855a(0xc3)](this[_0x27855a(0xf2)])['indexOf'](_0x27855a(0xb0))>-0x1;if(_0x50e474['join'])_0x358bf8+=this[_0x27855a(0xcc)];if(_0x50e474[_0x27855a(0xb4)])_0x358bf8+=this[_0x27855a(0xc0)];if(!this[_0x27855a(0xba)]&&_0x4b0505){const _0x68a7f4=this[_0x27855a(0xf5)]+'.deleted_at\x20IS\x20NULL';if(this[_0x27855a(0xc0)])_0x358bf8+=_0x27855a(0xfd)+_0x68a7f4+'\x20';else _0x358bf8+=_0x27855a(0xb1)+_0x68a7f4;}if(_0x50e474['group'])_0x358bf8+=this[_0x27855a(0xfa)];if(_0x50e474[_0x27855a(0xeb)])_0x358bf8+=this[_0x27855a(0xb9)];if(_0x50e474[_0x27855a(0xd1)])_0x358bf8+=this[_0x27855a(0xc7)];if(_0x50e474['limit'])_0x358bf8+=this[_0x27855a(0xe3)];if(_0x50e474[_0x27855a(0xc5)])_0x358bf8+=this['skip'];return _0x358bf8;};['queryBuilder']=(_0x3fc8f9,_0x52f209,_0x90d1a4,_0xe7ab0)=>{const _0x382def=a0_0x6aa566,_0x4ab21c=Object[_0x382def(0xc3)](_0x90d1a4)[_0x382def(0xac)](_0x382def(0xb0))>-0x1;if(!_0x52f209&&_0x4ab21c){const _0x3e9274=_0xe7ab0+'.deleted_at\x20IS\x20NULL';if(_0x3fc8f9)_0x3fc8f9+=_0x382def(0xfd)+_0x3e9274+'\x20';else _0x3fc8f9='\x20WHERE\x20'+_0x3e9274;}return _0x3fc8f9;};[a0_0x6aa566(0xf8)]=()=>{const _0x5b290a=a0_0x6aa566;let _0x1896f0=this[_0x5b290a(0xf5)]+'.*',_0x58dfbc=Object[_0x5b290a(0xc3)](this[_0x5b290a(0xf2)]);if(this['protected'][_0x5b290a(0xe4)]>0x0)_0x58dfbc=_0x58dfbc['filter'](_0x540f6d=>this[_0x5b290a(0xe6)][_0x5b290a(0xac)](_0x540f6d)===-0x1);if(this[_0x5b290a(0xed)][_0x5b290a(0xe4)]>0x0){const _0x16642e=!this[_0x5b290a(0xed)][_0x5b290a(0xd9)]('id')&&!this[_0x5b290a(0xed)][_0x5b290a(0xd9)](this[_0x5b290a(0xf5)]+_0x5b290a(0xd5))&&!this['selectedFields'][_0x5b290a(0xd9)](this[_0x5b290a(0xf5)]+'.*')&&!this[_0x5b290a(0xed)][_0x5b290a(0xd9)]('*');_0x1896f0=[..._0x16642e?[this[_0x5b290a(0xf5)]+_0x5b290a(0xd5)]:[],...this[_0x5b290a(0xed)]][_0x5b290a(0xf6)](',');}else _0x1896f0=[this['table']+_0x5b290a(0xd5),..._0x58dfbc][_0x5b290a(0xf6)](',');return _0x1896f0;};['parseValue']=(_0x464b44,_0x4e9d66)=>{const _0x558046=a0_0x6aa566,_0x2e1906={'string':'','text':'','int':0x0,'decimal':0x0,'date':moment()[_0x558046(0xf4)](_0x558046(0xe0)),'datetime':moment()[_0x558046(0xf4)](_0x558046(0xe0))};let _0x36577d=(_0x464b44===_0x558046(0xab)||_0x464b44===null||!_0x464b44)&&_0x4e9d66!==_0x558046(0xe7)&&_0x4e9d66!==_0x558046(0xef)?'NULL':_0x2e1906[_0x4e9d66];if(_0x464b44&&_0x36577d!==_0x558046(0xb3))switch(_0x4e9d66){case'datetime':_0x36577d=moment(_0x464b44)[_0x558046(0xf4)](_0x558046(0xe0));break;case'date':_0x36577d=moment(_0x464b44)[_0x558046(0xf4)](_0x558046(0xbb));break;case _0x558046(0xef):case _0x558046(0xe7):_0x36577d=parseFloat(_0x464b44?_0x464b44:0x0);break;case _0x558046(0xe1):_0x36577d=_0x464b44[_0x558046(0xd6)]();default:_0x36577d=_0x464b44;break;}return _0x36577d!=='NULL'?'\x27'+_0x36577d+'\x27':_0x36577d;};[a0_0x6aa566(0xdb)]=({data:_0x310e56,fillables:_0x2d1541})=>{const _0x4a8d96=a0_0x6aa566;if(_0x310e56){const _0x475517=Object['keys'](_0x2d1541)[_0x4a8d96(0xbe)](_0x2c7c28=>_0x2d1541[_0x2c7c28]===_0x4a8d96(0xe7));_0x475517[_0x4a8d96(0xe4)]&&(_0x310e56=_0x310e56[_0x4a8d96(0xcb)](_0x1a0337=>{const _0x46dba0=_0x4a8d96;let _0x56b771={..._0x1a0337};return _0x475517[_0x46dba0(0xb5)](_0x337dff=>_0x56b771[_0x337dff]=parseFloat(_0x1a0337[_0x337dff])),_0x56b771;}));}return _0x310e56;};[a0_0x6aa566(0xb6)]=_0x51f0eb=>{const _0x1407f9=a0_0x6aa566;let _0x7c373d=_0x51f0eb;const _0x4ecc9b=_0x51f0eb[_0x1407f9(0xac)](':');return _0x4ecc9b>-0x1&&(_0x7c373d=_0x7c373d['substr'](0x0,_0x4ecc9b)),_0x7c373d;};[a0_0x6aa566(0xda)]=()=>{const _0x5cc8d0=a0_0x6aa566;if(!this['connectionReused'])this[_0x5cc8d0(0xf0)][_0x5cc8d0(0x108)]();};[a0_0x6aa566(0x107)]=(_0xc54769,_0x94d8cc)=>{const _0x3dd1d6=a0_0x6aa566;let _0x524a75='';return _0xc54769[_0x3dd1d6(0xb5)](_0x273647=>{const _0x3eb84a=_0x3dd1d6;if(_0x94d8cc[_0x3eb84a(0xac)](_0x3eb84a(0xd7))>-0x1)_0x273647['created_at']=moment()[_0x3eb84a(0xf4)](_0x3eb84a(0xe0));_0x524a75+=(_0x524a75?',':'')+'\x20('+_0x94d8cc[_0x3eb84a(0xcb)](_0x451b40=>''+this[_0x3eb84a(0xd4)](_0x273647[_0x451b40],this[_0x3eb84a(0xf2)][_0x451b40]))['join'](',')+')';}),_0x524a75;};['generateLoggables']=(_0x5eaa02,_0x3e9546)=>{const _0x27ac9e=a0_0x6aa566;if(_0x5eaa02&&_0x3e9546)return[...Array(_0x5eaa02[_0x27ac9e(0xbd)])]['map']((_0x136c52,_0x594879)=>{const _0x4c3193=_0x27ac9e;return{..._0x3e9546,'ref_id':_0x5eaa02[_0x4c3193(0xec)]+_0x594879};});return null;};[a0_0x6aa566(0x106)]=async(_0x479fa2=[])=>{const _0x234897=a0_0x6aa566,_0x4a4302=require(_0x234897(0xaf));await new _0x4a4302()[_0x234897(0xb4)]({'ref_type':{'value':this[_0x234897(0xf5)]}})[_0x234897(0xe5)]({'ref_id':_0x479fa2})[_0x234897(0xd3)]([]);if(this['taggables']&&this['taggables'][_0x234897(0xe4)]&&_0x479fa2&&_0x479fa2['length']){const _0x2ce96a=[];this[_0x234897(0xe9)][_0x234897(0xb5)](_0x7baa5f=>{_0x479fa2['forEach'](_0x271a7c=>{const _0x251878=a0_0x3f16;_0x2ce96a[_0x251878(0x101)]({'ref_id':_0x271a7c,'ref_type':this[_0x251878(0xf5)],'name':_0x7baa5f});});}),await new _0x4a4302()[_0x234897(0xbf)](_0x2ce96a);}};[a0_0x6aa566(0xf3)]=async(_0x2ca74d=0xf)=>{const _0x3c9161=a0_0x6aa566;if(this['taggables']&&this['taggables']['length']){const _0x4db2ed=require(_0x3c9161(0xaf)),_0x584db2=await new _0x4db2ed()[_0x3c9161(0xb4)]({'ref_type':{'value':this[_0x3c9161(0xf5)]}})['whereIn']({'name':this[_0x3c9161(0xe9)]})[_0x3c9161(0xcf)](_0x2ca74d)[_0x3c9161(0xca)]([_0x3c9161(0xea)]);if(_0x584db2&&_0x584db2[_0x3c9161(0xe4)])this[_0x3c9161(0xe5)]({[this[_0x3c9161(0xf5)]+_0x3c9161(0xd5)]:_0x584db2},'OR');}};}module[a0_0x6aa566(0x103)]=BaseModelUtils;function a0_0x3f16(_0x582cac,_0x22ff71){const _0xfba7b9=a0_0xfba7();return a0_0x3f16=function(_0x3f16b5,_0x21f45f){_0x3f16b5=_0x3f16b5-0xab;let _0x3e69c3=_0xfba7b9[_0x3f16b5];return _0x3e69c3;},a0_0x3f16(_0x582cac,_0x22ff71);}function a0_0xfba7(){const _0x168f0c=['nextPage','groupQuery','currentPage','model','\x20AND\x20','key','relType','140952seKIdS','push','error','exports','14209470PKjkRO','getAppendedAttributes','saveTags','generateInsertValues','release','with','null','indexOf','2omMWma','445520kElrql','../../../models/Tag','deleted_at','\x20WHERE\x20','appends','NULL','where','forEach','extractRelKey','append','object','havingQuery','includeTrash','YYYY-MM-DD','222736KgMVpK','affectedRows','filter','create','whereQuery','\x20-\x20','ceil','keys','getPaginationDataCallback','skip','all','orderQuery','data','transform','pluck','map','joinQuery','3CYLmwa','orderBy','max','37225uAYJLJ','order','8205589ABPGKK','delete','parseValue','.id','toString','created_at','fKey','includes','closeConnection','decimalTypeCast','retRelationships','getConnection','918NtAkjc','sKey','YYYY-MM-DD\x20HH:mm:ss','string','firstData','limit','length','whereIn','protected','decimal','qry','taggables','ref_id','having','insertId','selectedFields','split','int','con','6930558KdvBRn','fillables','getTagged','format','table','join','pages','selectBuilder'];a0_0xfba7=function(){return _0x168f0c;};return a0_0xfba7();}