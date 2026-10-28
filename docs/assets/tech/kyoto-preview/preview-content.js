// Portfolio presentation data; not a TV connection.
const art=window.previewArt;
window.kyotoData({apps:[],inputs:[],vpn:true,mediaPermission:true,youtubeProgress:true,
continue:[{key:'film',title:'Вечернее кино',source:'Kodi',poster:true,art:art.train,duration:6840,position:2160},{key:'kyoto',title:'Прогулка по Киото',source:'YouTube',poster:true,art:art.kyoto,duration:3120,position:740},{key:'space',title:'За пределами Земли',source:'YouTube',poster:true,art:art.orbit,duration:2280,position:920},{key:'mountains',title:'Путешествие в горы',source:'Kodi',poster:true,art:art.snow,duration:5400,position:1860}],
subscriptions:[{key:'food',title:'Один вечер в Японии',source:'YouTube',poster:true,art:art.ramen,duration:1420},{key:'night',title:'Токио после дождя',source:'YouTube',poster:true,art:art.train,duration:1980},{key:'snow',title:'Дорога к вершине',source:'YouTube',poster:true,art:art.snow,duration:1740},{key:'orbit',title:'Тихая орбита',source:'YouTube',poster:true,art:art.orbit,duration:2150}]});
function showScene(scene){document.querySelector('.kc-close').click(); if(scene==='settings'||scene==='cast')document.querySelector('[data-panel="'+scene+'"]').click();}
window.addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='kyoto-scene')showScene(e.data.scene);});
const scene=new URLSearchParams(location.search).get('scene');if(scene)showScene(scene);
