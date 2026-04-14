const SPRITE_DATA = {
  DON_CARLOS: {
    palette: {
      s:'#C68642',S:'#A06830',h:'#333',H:'#555',w:'#FFF',W:'#DDD',g:'#FFD700',G:'#B8860B',
      e:'#FFF',p:'#000',m:'#822',u:'#222',U:'#444',b:'#444',B:'#333',k:'#543',K:'#432',
      n:'#B07535',f:'#DDAA66',r:'#88CCFF',t:'#333',T:'#222',c:'#FFF',d:'#EEE','0':'#000',
    },
    head: [
      '........hhhhhhhh............',
      '.......hhhhhhhhhh...........',
      '......hhhhhhhhhhhh..........',
      '.....hhSssssssssSShh.......',
      '.....hssssssssssssShh......',
      '.....ssssrssssrssssSh......',
      '.....sssesssssssesssS......',
      '.....ssseepssssseepsSS.....',
      '.....sssssssssssssssS......',
      '.....ssssssnnnnssssS.......',
      '.....ssssnnnnnnssssS.......',
      '.....ssuuuuuuuuuuusS.......',
      '.....sssUuuuuuuUsssS.......',
      '.....sssssmmmmmsssS........',
      '......SsssssssssssSS.......',
      '.......SSssssssssSS........',
      '........SsssssssS..........',
      '........gggggggggG.........',
      '........gGgGgGgGgG.........',
      '.........gggggggG..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
    ],
    torso: [
      '.....cccccccccccccccc......',
      '....WccccccccccccccccW.....',
      '...WwwwwwwwwwwwwwwwwwW.....',
      '...wwwwwdwwwwwdwwwwwwW.....',
      '...wwwwwwwwwwwwwwwwwwW.....',
      '...wwwwwwgwwwwwwwwwwW......',
      '...wwwwwgGgwwwwwwwwwW......',
      '...WwwwwwwwwwwwwwwwWW......',
      '...WwwwwwwwwwwwwwwWW.......',
      '...WwwwwwwwwwwwwwwwwWW.....',
      '...WwwwwwwwwwwwwwwwwwW.....',
      '...WwwwwwwwwwwwwwwwwwWW....',
      '...WWwwwwwwwwwwwwwwwwWW....',
      '....WbbbbbbbBBBbbbbbW......',
      '....BBbbbbbbBBBBbbbbBB.....',
      '....tttttttttttttttttt.....',
      '....tttttttttttttttttt.....',
      '....tttttttttTttttttt......',
      '....ttttttt....tttttt......',
      '....ttttttt....tttttt......',
      '.....kkkkkk....kkkkkkk.....',
      '.....kKkKkk....kKkKkKk....',
      '.....kkkkkk....kkkkkkkk....',
      '.....KKkKKk....KKkKKkkk...',
      '.....kkkkKk....kkkkKkk....',
      '.....kkkkKk....kkkkKkk....',
    ],
    fist: ['..ssSS..','.ssssss.','ssssssss','ssSsSsSS','SsSsSsSS','SSSSSSSS','.SSSSSS.','..SSSS..'],
  },
  GRINGO: {
    palette: {
      s:'#FFCCAA',S:'#DDAA88',h:'#DAA520',H:'#C09018',w:'#FF6347',W:'#CC4030',
      e:'#FFF',p:'#0A0',m:'#A44',b:'#C2B280',B:'#A89060',k:'#8B4513',K:'#6A340F',
      n:'#EEAA88',f:'#FFE0C0',c:'#C41E3A',C:'#922',g:'#DAA520',G:'#B08000',
      d:'#FF8866',r:'#FF8888',t:'#C2B280',T:'#A89060','0':'#000',
    },
    head: [
      '.......cccccccccccc........',
      '......cCCCccCCCCCCcc.......',
      '......cccccccccccccc.......',
      '.....cccccccccccccccc......',
      '.....cccccccccccccccc......',
      '......rrssssssssssrr.......',
      '......rssssssssssssr.......',
      '......sssssssssssssss......',
      '......sssesssssesssss......',
      '......ssseppssssepssS......',
      '......sssssssssssssss......',
      '......rsssssnnssssrss......',
      '......rssssssssssssrs......',
      '.......ssssmmmmsssss.......',
      '.......SssssssssssSS.......',
      '........SssssssssS.........',
      '........SsssssssSS.........',
      '.........ssssssss..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
    ],
    torso: [
      '.....wwwwwwwwwwwwwwwWW.....',
      '....WwwwwwwwwwwwwwwwwWW....',
      '...WwwwwWwwwWwwwWwwwwWW....',
      '...wwwwwwwwwwwwwwwwwwwW....',
      '...wwwwWwwwWwwwWwwwwwwW....',
      '...wwwwwwwwwwwwwwwwwwwW....',
      '...GggggggggGGgggggggGG...',
      '...GggggggGGGGGggggggGG...',
      '...GggggggggGGgggggggGG...',
      '...bbbbbbbbbbbbbbbbbbbbb...',
      '...bbbbbbbbbbbbbbbbbbbbb...',
      '...bbbbBbbbbbbbBbbbbbbb....',
      '...bbbbbbbbbbbbbbbbbbbbb...',
      '...bbbbbbbbbbbbbbbbbbbbb...',
      '...bbbbbbbbbbbbbbbbbbbbb...',
      '...bbbbb......bbbbbbbbb...',
      '...bbbbb......bbbbbbbbb...',
      '...kkssskk....kksssskk....',
      '...kkkkkk.....kkkkkkk.....',
      '...kKKkkk.....kKKkkkk.....',
      '...kkkkkk.....kkkkkkk.....',
      '...kkkkkk.....kkkkkkk.....',
      '...kkkkkk.....kkkkkkk.....',
      '...kkkkkk.....kkkkkkk.....',
      '...kkkkkk.....kkkkkkk.....',
      '...kkkkkk.....kkkkkkk.....',
    ],
    fist: ['..ssSs..','.ssssss.','ssSsssss','ssSsSsSS','SsSsSsSS','SSSSSSSS','.SSSSSS.','..SSSS..'],
  },
  CLARISA: {
    palette: {
      s:'#FFCCAA',S:'#DDAA88',h:'#1A1A0A',H:'#333320',w:'#FF69B4',W:'#CC4488',
      e:'#FFF',p:'#422',m:'#FF4488',b:'#FFF',B:'#EEE',k:'#F00',K:'#C00',
      n:'#EEAA88',f:'#FFE0C0',g:'#FFD700',G:'#DAA520',d:'#FF88AA',D:'#FF6699',
      c:'#FF1493',C:'#CC0066',r:'#4AF',R:'#222',t:'#FFF',T:'#EEE','0':'#000',
    },
    head: [
      '....hhhhhhhhhhhhhhhhh......',
      '...hhhhhhhhhhhhhhhhhh......',
      '..hhhHhhhhhhhhhhHhhhh......',
      '..hhHsssssssssssHhhhh......',
      '..hhssssssssssssshhhh......',
      '..hhsssssssssssssHhhh......',
      '..hhsssesssssesssHhhh......',
      '..hhssseepssseepshhhh......',
      '..hhsssssssssssssHhhh......',
      '..hhsssssnnssssssHhhh......',
      '..hhssssssssssssshhhh......',
      'g.hhssssmmmmsssshhhh.g.....',
      'g.hhSssssssssssShhhh.g.....',
      'g..hhSSsssssssSShhh..g.....',
      'G...hhSssssssShhh...G......',
      '.....hhsssssshhh...........',
      '.....hhsssssshhh...........',
      '.....hhsssssshhh...........',
      '.....hhsssssshhh...........',
      '.....hhsssssshhh...........',
      '.....hhsssssshhh...........',
      '.....hhsssssshhh...........',
      '.....hhsssssshhh...........',
      '.....hhsssssshhh...........',
    ],
    torso: [
      '...hhwwwwwwwwwwwwwwWWh.....',
      '..hhWwwwwwwwwwwwwwWWhh.....',
      '.hhWwwwDwwwwwwwDwwWWhh.....',
      '.hhWwwwwwwcwwwwwwwWWhh.....',
      '.hhWwwwwwwwwwwwwwwWWhh.....',
      '.hhWwwwwwwwwwwwwwwWWhh.....',
      '.hh.WwwwwwwwwwwwWWW.hh.....',
      '.hh.WWwwwwwwwwwWWW..hh.....',
      '....bbbbbbbbb...............',
      '....bbbbbbbbb...............',
      '....bBbBbBbBb...............',
      '....bbbbbbbbb...............',
      '...bbbbb..bbbbb.............',
      '...bbbbb..bbbbb.............',
      '....kkkk..kkkkk.............',
      '....kKkk..kKkkk.............',
      '....kkkk..kkkkk.............',
    ],
    fist: ['..cccc..','.cDDDcc.','cDsDDDcc','cccccccc','CcCcCcCC','CCCCCCCC','.CCCCCC.','..CCCC..'],
  },
  PANZAEPERRA: {
    palette: {
      s:'#8D5524',S:'#6B3F1A',h:'#111',H:'#222',w:'#555',W:'#444',
      e:'#FFF',p:'#000',m:'#622',b:'#444',B:'#333',k:'#222',K:'#111',
      n:'#7A4820',f:'#A06830',g:'#FFD700',G:'#B8860B',c:'#222',C:'#111',
      d:'#666',D:'#555',t:'#444',T:'#333','0':'#000',
    },
    head: [
      '....ccccccccccccccc.........',
      '...cCCCCCCCCCCCCCcc.........',
      '...cccccccccccccccc.........',
      '..cccccccccccccccccc........',
      '..ccccccccccccccccccc.......',
      '.....sssssssssssssss........',
      '.....ssssssssssssssS........',
      '.....ssssssssssssssSS.......',
      '.....ssesssssssesssS........',
      '.....ssepssssssepssS........',
      '.....sssssssssssssssS.......',
      '.....ssssssnnssssssS........',
      '.....ssssssssssssssS........',
      '......sssgmmmmmsssSS........',
      '.......SsssssssssS..........',
      '........SsssssssSS..........',
      '.........sssssssS...........',
      '.........sssssss............',
      '.........ssssssS............',
      '.........ssssssS............',
      '.........ssssssS............',
      '.........ssssssS............',
      '.........ssssssS............',
      '.........sssssss............',
    ],
    torso: [
      '.....wwwwwwwwwwwwwwwWW.....',
      '....WwwwwwwwwwwwwwwwwWW....',
      '...WwwwwwwwwwwwwwwwwwWW....',
      '...wwwwwwwwwwwwwwwwwwwW....',
      '...wwwwwwwwwwwwwwwwwwwW....',
      '...wwwwwwwwwwwwwwwwwwW.....',
      '...WwwwwwwwwwwwwwwwwWW.....',
      '...WwwwwwwwwwwwwwwwwwwW....',
      '...WwwwwwwwwwwwwwwwwwwwW...',
      '...WwwwwwwwwwwwwwwwwwwwW...',
      '...WWwwwwwwwwwwwwwwwwwWW...',
      '....WwwwwwwwwwwwwwwwwWW....',
      '....bbbbbbbBBBbbbbbbbB.....',
      '....tttttttttttttttttt.....',
      '....ttttTtttttttTttttt.....',
      '....ttttttttttttttttttt....',
      '....ttttttt....ttttttttt...',
      '....kkkkkkk....kkkkkkkkk...',
      '.....kkkkkk....kkkkkkkk....',
      '.....kkkkKk....kkkkKkkk....',
      '.....kkkkkk....kkkkkkkk....',
      '.....kkkkkk....kkkkkkkk....',
      '.....kkkkkk....kkkkkkkk....',
      '.....kkkkkk....kkkkkkkk....',
      '.....kkkkkk....kkkkkkkk....',
      '.....kkkkkk....kkkkkkkk....',
    ],
    fist: ['..ssSs..','.ssssSs.','SsSsSsSS','SssSsSSS','SSSSSSSS','.SSSSSS.','..SSSS..','..SSSS..'],
  },
  MICHIQUITO: {
    palette: {
      s:'#FFCCAA',S:'#DDAA88',h:'#3A2A1A',H:'#5A4A3A',w:'#FFB6C1',W:'#DD8899',
      e:'#FFF',p:'#422',m:'#C66',b:'#F5F5DC',B:'#E0D8C0',k:'#DEB887',K:'#C0A070',
      n:'#EEAA88',f:'#FFE0C0',g:'#FFD700',G:'#DAA520',d:'#FF69B4',D:'#DD4488',
      c:'#FFD0DA',C:'#FFAACC',t:'#F5F5DC',T:'#E0D8C0','0':'#000',
    },
    head: [
      '.......hhhHHHHH............',
      '......hhhhhhHHHHH..........',
      '.....hhhhhsssHHHHH.........',
      '.....hhhssssssssHHH........',
      '.....hssssssssssssH........',
      '.....sssssssssssssss.......',
      '.....sssessssssesssS.......',
      '.....ssseppsssseepsS.......',
      '.....ssssssssssssssS.......',
      '.....sssssnnsssssssS.......',
      '.....ssssssssssssssS.......',
      '.....ssssssmmsssssS........',
      '......SssssssssssSS........',
      '.......SssssssssS..........',
      '........sssssssS...........',
      '........sssssssS...........',
      '........ssssssss...........',
      '........ssssssss...........',
      '........ssssssss...........',
      '........ssssssss...........',
      '........ssssssss...........',
      '........ssssssss...........',
      '........ssssssss...........',
      '........ssssssss...........',
    ],
    torso: [
      '....ccwwwwwwwwwwwwwcc......',
      '...ccwwwwwwwwwwwwwwwcc.....',
      '..ccwwwwwwwwwwwwwwwwcc.....',
      '..cwwwwdwwwwwwwwdwwwcc.....',
      '..cwwwwwwwwwwwwwwwwwWc.....',
      '..cwwwwwwwwDwwwwwwwwWc.....',
      '..cwwwwwwwwwwwwwwwwWWc.....',
      '..cWwwwwwwwwwwwwwwWWWc.....',
      '...WwwwwwwwwwwwwwwWWW......',
      '...bbbbbbbbBBbbbbbb........',
      '...bbbbbbbbBBbbbbbb........',
      '...bbbbbbbbBBbbbbbb........',
      '...bbbbbBbbBBbbBbbbb.......',
      '...bbbbbbbbbbbbbbbbb.......',
      '...bbbbbb....bbbbbbb.......',
      '....kkkkk....kkkkkk........',
      '....kKkkk....kKkkkk........',
      '....kkkkk....kkkkkk........',
    ],
    fist: ['..ssSs..','.ssssss.','ssSsssss','SssSsSSS','SsSsSsSS','SSSSSSSS','.SSSSSS.','..SSSS..'],
  },
  HITMENA: {
    palette: {
      s:'#FFCCAA',S:'#DDAA88',h:'#8B6914',H:'#AA8830',w:'#800080',W:'#600060',
      e:'#FFF',p:'#000',m:'#C44',b:'#556B2F',B:'#445520',k:'#FFCCAA',K:'#DDAA88',
      n:'#EEAA88',f:'#FFE0C0',g:'#C0C0C0',G:'#888',d:'#D44',D:'#44D',
      c:'#9B59B6',C:'#7A3D96',t:'#556B2F',T:'#445520','0':'#000',
    },
    head: [
      '..hh...hh...hh...hh.......',
      '..hh..hhh...hhh..hh.......',
      '..hh.hhhh...hhhh.hh.......',
      '..hhhhhssssssshhhhhh.......',
      '..hhhhssssssssshhhh........',
      '..hhssssssssssssshh........',
      '..hhsssesssssessshh........',
      '..hhssseppssseppshh........',
      '..hhsssssssssssssHh........',
      '..hhsssgnnngssssshh........',
      '..hhsssssssssssssHh........',
      '..hhsssssmmsssssshh........',
      '..hhSsssssssssssShh........',
      '..hh.SsssssssssS.hh.......',
      '..hh..sssssssssS..hh......',
      '..hh..ssssssssss..hh......',
      '..hh..ssssssssss..hh......',
      '..hh..ssssssssss..hh......',
      '..hh..ssssssssss..hh......',
      '..hh..ssssssssss..hh......',
      '..hh..ssssssssss..hh......',
      '..hh..ssssssssss..hh......',
      '..hh..ssssssssss..hh......',
      '..hh..ssssssssss..hh......',
    ],
    torso: [
      '.....wwwwwwwwwwwwwwwWW.....',
      '....WwwwwwwwwwwwwwwwwWW....',
      '...WwwwwwwwwwwwwwwwwwwW....',
      '...wwwwwwwcwwwwwwwwwwwW....',
      '...wwwwwwwwwwwwwwwwwwwW....',
      '...wwwwwwwwwwwwwwwwwwW.....',
      '....ssssssssssssssssss.....',
      '....bbbbbbbBBBbbbbbbb......',
      '....bbbbbbbBBBbbbbbbb......',
      '....bbbbbbbbBBbbbbbbbb.....',
      '....bbbbbbbbbbbbbbbbbbb....',
      '....bbbbbbbbbbbbbbbbbbb....',
      '....bbbbbb....bbbbbbbb.....',
      '....kkkkk......kkkkkkk.....',
      '....kkkkk......kkkkkkk.....',
      '....kkkkk......kkkkkkk.....',
      '....kkkkk......kkkkkkk.....',
    ],
    fist: ['..ssSs..','.ssssss.','SsSsSsSS','SssSsSSS','SSSSSSSS','.SSSSSS.','..SSSS..','..SSSS..'],
  },
  KAREN: {
    palette: {
      s:'#C68642',S:'#A06830',h:'#222',H:'#444',w:'#8B0000',W:'#660000',
      e:'#FFF',p:'#000',m:'#844',b:'#333',B:'#222',k:'#111',K:'#000',
      n:'#B07535',f:'#DDAA66',g:'#C0C0C0',G:'#888',c:'#666',C:'#555',
      d:'#8B0000',D:'#660000',t:'#333',T:'#222','0':'#000',
    },
    head: [
      '.......hhhhhhhh...........',
      '......hhhhhhhhhh..........',
      '.....hhhhhhhhhhhh.........',
      '....hhhhhhhhhhhhhh........',
      '...hhssssssssssssShh......',
      '...hsssssssssssssssh......',
      '...sssssssssssssssss......',
      '...ssssssssssssssssS......',
      '...sgsesssssssesgsS.......',
      '...ssseppssssseppsSS......',
      '...ssssssssssssssssS......',
      '...ssssssnnsssssssS.......',
      '...sssssssssssssssS.......',
      '...sgsssmmmmmssgsS........',
      '....SsssssssssssSS........',
      '.....SsssssssssS..........',
      '......ssssssssss..........',
      '......ssssssssss..........',
      '......ssssssssss..........',
      '......ssssssssss..........',
      '......ssssssssss..........',
      '......ssssssssss..........',
      '......ssssssssss..........',
      '......ssssssssss..........',
    ],
    torso: [
      '....ddddddddddddddddddd..',
      '...WddddddddddddddddddW..',
      '...WdwwwwwwwwwwwwwwwwwdW..',
      '...WdwwwwwwwwwwwwwwwwwdW..',
      '...WwwwwwwwwwwwwwwwwwwwW..',
      '...WwwwwwwwwwwwwwwwwwwwW..',
      '...WwwwwwwwwwwwwwwwwwwWW..',
      '...WwwwwwwwwwwwwwwwwwWWW..',
      '...WWwwwwwwwwwwwwwwwWWW...',
      '....WwwwwwwwwwwwwwwwWW....',
      '....bbbbbbbBBbbbbbbb......',
      '....tttttttttttttttt.......',
      '....ttttttttttttttttt......',
      '....ttttttttttttttttt......',
      '....ttttttt....ttttttt.....',
      '....kkkkkkk....kkkkkkk....',
      '....kKkKkkk....kKkKkkk....',
      '....kkkkkkk....kkkkkkk....',
    ],
    fist: ['..ssSs..','.ssssss.','SsSsSsSS','SssSsSSS','SSSSSSSS','.SSSSSS.','..SSSS..','..SSSS..'],
  },
  CARRETASTAR: {
    palette: {
      s:'#D49A6A',S:'#B07535',h:'#5C3317',H:'#7A5530',w:'#CC7733',W:'#AA5522',
      e:'#FFF',p:'#000',m:'#822',u:'#3A2A1A',U:'#5A4A3A',b:'#444',B:'#333',
      k:'#654321',K:'#432310',t:'#556B2F',T:'#445520',c:'#8B4513',C:'#654321',
      d:'#FFD700',D:'#B8860B',g:'#C41E3A',G:'#8B0000',v:'#C0C0C0',V:'#888',
      f:'#EEBB88',n:'#C08050','0':'#000',
    },
    head: [
      '...hhhhhhhhhhhhhhhhhhh.....',
      '...hCCCCCCCCCCCCCCCCCh.....',
      '...hCCCCCCCCCCCCCCCCCCh....',
      '...gggggggggggggggggggg....',
      '.hhhhhhhhhhhhhhhhhhhhhhhh..',
      '.hhhhhhhhhhhhhhhhhhhhhhhhh.',
      '......sssssssssssssssss....',
      '......ssssssssssssssssS....',
      '......sssessssssessssS.....',
      '......ssseppsssseepsSS.....',
      '......sssssssssssssssS.....',
      '......ffssssnnssssffS......',
      '......fssssssssssssfs......',
      '......fsuuuuuuuuuusfS......',
      '......ssssmmmmmmssssS......',
      '.......SssssssssssSS.......',
      '........SsssssssS..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
      '.........ssssssss..........',
    ],
    torso: [
      '....WwwwWwwwWwwwWwwwWW.....',
      '...WWwwwwwwwwwwwwwwwwWW....',
      '...WwwwWwwwWwwwWwwwwwWW....',
      '...wwwwwwwwwwwwwwwwwwwW....',
      '...WwwwWwwwWwwwWwwwwwWW....',
      '...wwwwwwwwwwwwwwwwwwwW....',
      '...WwwwwwwwwwwwwwwwwwWW....',
      '...WwwwwwwwwwwwwwwwwWWW....',
      '...WWwwwwwwwwwwwwwwWWW.....',
      '....bbbbbbbbBBbbbbbbbb.....',
      '....tttttttttttttttttt.....',
      '....ttttTtttttttTttttt.....',
      '....ttttttttttttttttttt....',
      '....ttttttt....ttttttttt...',
      '....kkkkkkvk...kkkkkkvkk..',
      '....kkkkkvvk...kkkkkvvkk..',
      '....kkkkkkk....kkkkkkkkk..',
      '....kkkkkkk....kkkkkkkkk..',
    ],
    fist: ['..ssSs..','.ssssss.','SsSsSsSS','SssSsSSS','SSSSSSSS','.SSSSSS.','..SSSS..','..SSSS..'],
  },
  PERSEFONE: {
    palette: {
      s:'#FFCCAA',S:'#DDAA88',h:'#FF1493',H:'#CC0066',w:'#000',W:'#222',
      e:'#FFF',p:'#111',m:'#F0A',b:'#111',B:'#000',k:'#FF1493',K:'#CC0066',
      n:'#EEAA88',f:'#FFE0C0',g:'#39FF14',G:'#00CC00',d:'#00FFFF',D:'#0088AA',
      c:'#FF1493',C:'#CC0066',r:'#9B59B6',R:'#7A3D96',t:'#111',T:'#000','0':'#000',
    },
    head: [
      '...hhhh..........hhhh.....',
      '..hHHHhh........hHHHh.....',
      '..hHHHhh........hHHHh.....',
      '...hhhssssssssssshhh......',
      '.....ssssssssssssss.......',
      '.....sssssssssssssss......',
      '.....sssesssssessssS......',
      '.....ssseppsssseepsSS.....',
      '.....sssssssssssssssS.....',
      '.....sssssnnsssssssS......',
      '.....ssssssssssssssS......',
      '.....ssssmmmmmsssssS......',
      '.....dSsssssssssssSS......',
      '......SssssssssssS........',
      '.......ssssssssss.........',
      '.......ssssssssss.........',
      '.......ssssssssss.........',
      '.......ssssssssss.........',
      '.......ssssssssss.........',
      '.......ssssssssss.........',
      '.......ssssssssss.........',
      '.......ssssssssss.........',
      '.......ssssssssss.........',
      '.......ssssssssss.........',
    ],
    torso: [
      '.....wwwwwwwwwwwwwwwWW.....',
      '....WwwwwwwwwwwwwwwwwWW....',
      '...WwwwgwwwwwwwdwwwwwWW....',
      '...wwwwwwwwwwwwwwwwwwwW....',
      '...wwwwwwcwwwwwwwwwwwwW....',
      '...wwwwwwwwwwwwwwwwwwwW....',
      '....WwwwwwwwwwwwwwwwWW.....',
      '....WwwwwwwwwwwwwwwwWW.....',
      '...WWwwwwwwwwwwwwwwWWW.....',
      '.....bbbbbbbbbbbbbbb.......',
      '.....tttttttttttttttt......',
      '.....tttTttttttTttttt......',
      '.....tttttttttttttttt......',
      '.....cccccccccccccccc......',
      '.....cccccc....cccccc......',
      '.....kkkkk.....kkkkkk......',
      '.....kKKkkkkkkkkKKkkk......',
      '.....kkkkkkkkkkkkkkkkk.....',
    ],
    fist: ['..gwwg..','.gwwwwg.','gwwwwwwG','GwwwwwGG','GGGGGGGG','.GGGGGG.','..GGGG..','..GGGG..'],
  },
  DON_ALVARO: {
    palette: {
      s:'#FFCCAA',S:'#DDAA88',h:'#111',H:'#222',w:'#111',W:'#222',
      e:'#FFF',p:'#000',m:'#844',u:'#111',U:'#222',b:'#333',B:'#222',
      k:'#000',K:'#111',t:'#222',T:'#111',g:'#C0C0C0',G:'#888',
      d:'#C41E3A',D:'#FFF',c:'#444',C:'#333',f:'#FFE0C0',n:'#EEAA88','0':'#000',
    },
    head: [
      '...hhhhhhhhhhhhhhhhh.......',
      '...hhhhhhhhhhhhhhhhhh......',
      '..hhhssssssssssssshhhhh....',
      '..hhssssssssssssssshhhhh...',
      '..hhsssssssssssssssShhh....',
      '..hhsssessssssesssShhhh....',
      '..hhssseppsssseepsShhh.....',
      '..hhsssssssssssssssShhh....',
      '..hhsssssnnsssssssShh......',
      '..hhsuuuuuuuuuuuuuSh.......',
      '..hhsuusssssssssuusH.......',
      '..hhsuusssmmmssuusH........',
      '...hhSuuuuuuuuuuSH.........',
      '....hhSSsssssssSShh.........',
      '....hh..sssssss..hh........',
      '....hh..sssssss..hh........',
      '....hh..sssssss..hh........',
      '....hh..sssssss..hh........',
      '....hh..sssssss..hh........',
      '....hh..sssssss..hh........',
      '....hh..sssssss..hh........',
      '....hh..sssssss..hh........',
      '....hh..sssssss..hh........',
      '....hh..sssssss..hh........',
    ],
    torso: [
      '.....wwwwwwwwwwwwwwwWW.....',
      '...CwwwwdwwwwwDwwwwwwWC....',
      '...CwwwwwwwwwwwwwwwwwWC....',
      '...CwwwwwwwwwwwwwwwwwWC....',
      '...CwwwwdwwwwDwwwwwwwWC....',
      '...CwwwwwwwwwwwwwwwwwWC....',
      '...CwwwwwwwwwwwwwwwwwWC....',
      '...CwwwwwwwwwwwwwwwwwWC....',
      '...CCgwwwwwwwwwwwwwgWCC....',
      '...CC.wwwwwwwwwwwww.WC.....',
      '...CC.wwwwwwwwwwwww.CC.....',
      '...CC.WwwwwwwwwwwwW.CC.....',
      '....g.bbbbbbbBBbbbb.g......',
      '......ttttttttttttttt......',
      '......tttTtttttTttttt......',
      '......tttttt..tttttt.......',
      '......kkkkkk..kkkkkk.......',
      '......kKkkkk..kKkkkk.......',
      '......kkkkkk..kkkkkk.......',
    ],
    fist: ['..ssSs..','.ssssss.','SsSsSsSS','SssSsSSS','SSSSSSSS','.SSSSSS.','..SSSS..','..SSSS..'],
  },
  ANAI: {
    palette: {
      s:'#4A2C0A',S:'#3A1C00',h:'#222',H:'#333',w:'#2F4F2F',W:'#1A3A1A',
      e:'#FFF',p:'#311',m:'#622',b:'#556B2F',B:'#445520',k:'#4A2C0A',K:'#3A1C00',
      n:'#3F220A',f:'#5A3C1A',g:'#CC0000',G:'#006400',d:'#FFD700',D:'#CC9900',
      c:'#006400',C:'#004400',t:'#556B2F',T:'#445520','0':'#000',
    },
    head: [
      '......gggddddddGGG........',
      '.....ggddddddddddGG.......',
      '.....gddddddddddddG.......',
      '....gddssssssssssddG.......',
      '...hhssssssssssssssShh.....',
      '...hhsssssssssssssssShh....',
      '...hhsssssssssssssssshh....',
      '...hhsssesssssesssssSh.....',
      '...hhssseppsssseepsSS......',
      '...hhsssssssssssssssS......',
      '...hhsssssnnsssssssS.......',
      '...hhsssssssssssssS........',
      '...hhsssssmmmmssssSS.......',
      '...hhSssssssssssssS........',
      '...hh.SsssssssssSS.hh......',
      '...hh..ssssssssss..hh......',
      '...hh..ssssssssss..hh......',
      '...hh..ssssssssss..hh......',
      '...hh..ssssssssss..hh......',
      '...hh..ssssssssss..hh......',
      '...hh..ssssssssss..hh......',
      '...hh..ssssssssss..hh......',
      '...hh..ssssssssss..hh......',
      '...hh..ssssssssss..hh......',
    ],
    torso: [
      '.....wwwwwwwwwwwwwwwWW.....',
      '....WwwwwwwwwwwwwwwwwWW....',
      '...WwwwwwwwwwwwwwwwwwwW....',
      '...wwwwwwwwwwwwwwwwwwwW....',
      '...wwwwwwwwwwwwwwwwwwwW....',
      '...wwwwwwwwwwwwwwwwwwW.....',
      '....WwwwwwwwwwwwwwwWWW.....',
      '....WwwwwwwwwwwwwwWWW......',
      '.....WwwwwwwwwwwwWW........',
      '.....bbbbbbbBBbbbbb........',
      '.....bbbbbbbBBbbbbb........',
      '.....bbbbBbbBBbbBbb........',
      '.....bbbbbbbbbbbbbbb.......',
      '.....bbbbbb....bbbbb.......',
      '.....kkkkk......kkkkk......',
      '.....kkkkk......kkkkk......',
    ],
    fist: ['..ssSs..','.ssssss.','SsSsSsSS','SssSsSSS','SSSSSSSS','.SSSSSS.','..SSSS..','..SSSS..'],
  },
  SKIN: {
    palette: {
      s:'#EEBB99',S:'#CCAA80',h:'#DDD',H:'#BBB',w:'#333',W:'#222',
      e:'#FFF',p:'#000',m:'#844',b:'#222',B:'#111',k:'#111',K:'#000',
      n:'#DDAA88',f:'#FFCCAA',g:'#445',G:'#334',d:'#446',D:'#335',
      c:'#556',C:'#445',t:'#222',T:'#111','0':'#000',
    },
    head: [
      '.......sssssssssss.........',
      '......sssssssssssss........',
      '.....SssssssssssssssS......',
      '.....ssdssssssssssdsS......',
      '.....ssssssssssssssssS.....',
      '.....ssssssssssssssssS.....',
      '.....sssepssssssepssS......',
      '.....sssepssssssepssS......',
      '.....ssssssssssssssssS.....',
      '.....ssssssnnsssssssS......',
      '.....ssssssssssssssS.......',
      '.....sssssmmmmmsssS........',
      '......SssssssssssS.........',
      '.......SsssssssS...........',
      '........sdsdsdss...........',
      '........ssssssss...........',
      '........ssssssss...........',
      '........ssssssss...........',
      '........ssssssss...........',
      '........ssssssss...........',
      '........ssssssss...........',
      '........ssssssss...........',
      '........ssssssss...........',
      '........ssssssss...........',
    ],
    torso: [
      '.....wwwwwwwwwwwwwwwWW.....',
      '....WwwwwwwwwwwwwwwwwWW....',
      '...WwwgwwwwwwwwgwwwwwWW....',
      '...wwwwwwwwwwwwwwwwwwwW....',
      '...wwgwwwwwwwwwgwwwwwwW....',
      '...wwwwwwwwwwwwwwwwwwwW....',
      '...WwwwgwwwgwwwwwwwWWW.....',
      '...WwwwwwwwwwwwwwwwWW......',
      '...WWwwwwwwwwwwwwwWWW......',
      '....WwwwwwwwwwwwwwWW.......',
      '....bbbbbbbBBbbbbbbb.......',
      '....tttttttttttttttt........',
      '....ttttttttttttttttt.......',
      '....ttttttt....ttttttt......',
      '....kkkkkkk....kkkkkkk.....',
      '....kKkKkkk....kKkKkkk.....',
      '....kkkkkkk....kkkkkkk.....',
    ],
    fist: ['..dgDg..','.dssddss.','DgssDgDg','DgsDgDDD','DDDDDDDD','.DDDDDD.','..DDDD..','..DDDD..'],
  },
  EL_INDIO: {
    palette: {
      s:'#8D5524',S:'#6B3F1A',h:'#111',H:'#222',w:'#8D5524',W:'#6B3F1A',
      e:'#FFF',p:'#000',m:'#622',b:'#654321',B:'#543210',k:'#8D5524',K:'#6B3F1A',
      n:'#7A4820',f:'#A06830',g:'#C41E3A',G:'#FFD700',d:'#0A5',D:'#073',
      c:'#C41E3A',C:'#8B0000',r:'#F00',R:'#CC0000',t:'#654321',T:'#543210','0':'#000',
    },
    head: [
      '...g...c...G..................',
      '..hhg..c..Ghh.................',
      '..hhhhhsssssssshhhh............',
      '..hhssssssssssssshhhh..........',
      '..hhsssssssssssssShh...........',
      '..hhssgssssssgssSShh...........',
      '..hhssGesssssseGsSShh..........',
      '..hhssseppsssseepsSS...........',
      '..hhssssssssssssssssS..........',
      '..hhsssssnnssssssssS...........',
      '..hhssrrssssssrrssssS..........',
      '..hhssrrssssssrrssssS..........',
      '..hhsssssmmmmmssssS............',
      '...hSssssssssssssSS............',
      '...hhSsssssssssSShh............',
      '...hh..sssssssss..hh...........',
      '...hh.ddddddddddd.hh..........',
      '...hh..sssssssss..hh...........',
      '...hh..sssssssss..hh...........',
      '...hh..sssssssss..hh...........',
      '...hh..sssssssss..hh...........',
      '...hh..sssssssss..hh...........',
      '...hh..sssssssss..hh...........',
      '...hh..sssssssss..hh...........',
    ],
    torso: [
      '.....ddwwwwwwwwwwddWW......',
      '....dsssssssssssssssdW.....',
      '...WssssssssssssssssssW....',
      '...sssssssdssssssssssssW...',
      '...sssssssddssssssssssss...',
      '...ssssssssssssssssssssS...',
      '...SssssssssssssssssssssS..',
      '...SsssssssssssssssssssS...',
      '...SSsssssssssssssssssSS...',
      '....SssssssssssssssssS.....',
      '....bbbbbbbBBBbbbbbbb......',
      '....tttttttttttttttttt.....',
      '....ttttTtttttttTttttt.....',
      '....ttttttttttttttttttt....',
      '....ttttttt....ttttttt.....',
      '....kkkkkkk....kkkkkkk.....',
      '....kkkkkkk....kkkkkkk.....',
    ],
    fist: ['..ssSs..','.ssssss.','SsSsSsSS','SssSsSSS','SSSSSSSS','.SSSSSS.','..SSSS..','..SSSS..'],
  },
};

const BULL_SPRITE = {
  palette: {
    s:'#4A3728',S:'#3A271A',h:'#FFFDD0',H:'#DDD',w:'#C41E3A',W:'#0047AB',
    e:'#FFF',p:'#000',m:'#6B4F3A',M:'#5A3E2A',n:'#222',b:'#C4A47A',B:'#A08060',
    g:'#FFD700',G:'#B8860B',d:'#EAA221',D:'#228B22',r:'#FF0000',R:'#CC0000','0':'#000',
  },
  head: [
    '..wHHHhhhh..........hhhhHHHw..',
    '..wHhhhhhh..........hhhhhHw...',
    '..WHhhh................hhhhHW.',
    '....hssssssssssssssssssssh....',
    '...ssssssssssssssssssssssss...',
    '..ssssssssssssssssssssssssss..',
    '..ssssseppsssssssssppessssssS.',
    '..ssssseppsssssssssppessssssS.',
    '..ssssssssssssssssssssssssss..',
    '..sssssssssssbbbbsssssssssS...',
    '..sssssssssbbbbbbbbbssssssS...',
    '...SsssmmmmmmmmmmmmmmmmmsssS..',
    '....SmmmnnnmmmmmmmnnnmmmmSS...',
    '.....mmmmmmmmmmmmmmmmmmmmm....',
    '......mmmmmmmmmmmmmmmmmm......',
    '........ggggggggggggg.........',
  ],
  body: [
    '...SssssssssssssssssssssssssS..',
    '..SssssssssssssssssssssssssssS.',
    '..sssssssssssssssssssssssssssss',
    '..sssssssSSSssSSSssssssssssssss',
    '..ssssssSSSSSSSSSssssssssssssS.',
    '..sssssssssssssssssssssssssssS.',
    '..SssssssssssssssssssssssssS...',
    '..SsssssssssssssssssssssssS....',
    '..Sssss.sssss..sssss.sssS.....',
    '..Sssss.sssss..sssss.sssS.....',
    '..nnnnn.nnnnn..nnnnn.nnnn.....',
  ],
};

const PLAYER_SPRITE = {
  palette: {
    s:'#C68642',S:'#A06830',h:'#222',H:'#111',v:'#6B3F1A',V:'#5A3010',
    l:'#8B5E3C',L:'#704A2E',b:'#333',B:'#222',k:'#543',K:'#432',
    g:'#228B22',G:'#1A6B1A',n:'#2AAF2A',N:'#186018',e:'#FFF',p:'#000',
    m:'#A06830',f:'#DDA866',d:'#444',D:'#333','0':'#000',
    w:'#FFD700',W:'#B8860B',c:'#C41E3A',C:'#8B0000',
  },
  head: [
    '......hhhhhhhhhhh.......',
    '.....hHHHHHHHHHHHh......',
    '....hHHHHHHHHHHHHHh.....',
    '....hHHHHHHHHHHHHHh.....',
    '....hHhhhhhhhhhhhHh.....',
    '....hhhhhhhhhhhhhhhh....',
    '.....sssssssssssssss....',
    '.....ssssssssssssssS....',
    '.....ssSsssssssSsssSS...',
    '.....ssssssssssssssS....',
    '.....ssssssnnsssssS.....',
    '.....sssssnnnnssssS.....',
    '.....ssssSSSSSssssS.....',
    '......SsssssssssSS......',
    '.......SsssssssS........',
    '........ssssssss........',
  ],
  torso: [
    '......vvvvvvvvvvvvvv.....',
    '.....VvvvvvvvvvvvvvV.....',
    '....VvvvVvvvvvvVvvvvV....',
    '....vvvvvvvvvvvvvvvvV....',
    '....vvvlvvvvvvvlvvvvV....',
    '....vvvllvvvvvllvvvvV....',
    '....VvvvlllllllvvvvVV....',
    '....VvvvvvvvvvvvvvvVV....',
    '....VvvvvVVVVVvvvvvVV....',
    '....VVvvvvvvvvvvvvVVV....',
    '.....VvvvvvvvvvvvvVV.....',
    '.....VvvvvvvvvvvvvVV.....',
    '......bbbbbbbbbbbbbb.....',
    '......bBbBbbBBbBbBbb.....',
    '......bbbbbbbbbbbbb......',
    '......bbbbb..bbbbb.......',
    '......bbbbb..bbbbb.......',
    '......bbbbb..bbbbb.......',
    '.......kkkk..kkkk........',
    '.......kKkk..kKkk........',
    '.......kkkk..kkkk........',
  ],
  fist: [
    '..gggg..',
    '.gGGGGg.',
    '.gGnnGg.',
    '.gGnGGg.',
    '.gGGGGg.',
    '.GgGgGg.',
    '..GGGG..',
    '..GGGG..',
  ],
};

class SpriteSystem {
  static POSE_MAP = {
    'idle': 'idle', 'idle2': 'idle',
    'punch_left': 'punch_left', 'punch_right': 'punch_right',
    'windup_left': 'idle', 'windup_right': 'idle',
    'hurt': 'hurt', 'block': 'block', 'ko': 'ko',
    'recovery': 'idle', 'taunt': 'taunt', 'charge': 'sig_attack',
    'special': 'sig_attack', 'victory': 'victory',
    'sig_swing': 'sig_attack', 'sig_rush': 'sig_attack',
    'sig_throw': 'sig_attack', 'sig_grab': 'sig_attack',
    'sig_ground': 'sig_attack', 'sig_combo': 'sig_attack',
    'sig_counter': 'sig_attack',
  };

  static POSE_OFFSETS = {
    punch_left:  { dx: -6, dy: -2, scaleBoost: 0.06 },
    punch_right: { dx:  6, dy: -2, scaleBoost: 0.06 },
    windup:      { dx:  0, dy:  2, scaleBoost: 0.03 },
    hurt:        { dx:  0, dy:  3, scaleBoost: -0.04 },
    ko:          { dx:  0, dy:  8, scaleBoost: -0.08 },
    block:       { dx:  0, dy:  1, scaleBoost: 0.02 },
    taunt:       { dx:  0, dy: -1, scaleBoost: 0.04 },
    sig_attack:  { dx: -4, dy: -3, scaleBoost: 0.08 },
    victory:     { dx:  0, dy: -2, scaleBoost: 0.05 },
    idle:        { dx:  0, dy:  0, scaleBoost: 0 },
  };

  static PLAYER_POSE_OFFSETS = {
    punch_left:  { dx: -3, dy: -8, scaleBoost: 0.05 },
    punch_right: { dx:  3, dy: -8, scaleBoost: 0.05 },
    windup:      { dx:  0, dy:  2, scaleBoost: 0.03 },
    hurt:        { dx:  0, dy:  4, scaleBoost: -0.04 },
    ko:          { dx:  0, dy:  6, scaleBoost: -0.06 },
    block:       { dx:  0, dy:  1, scaleBoost: 0.02 },
    taunt:       { dx:  0, dy: -1, scaleBoost: 0.04 },
    sig_attack:  { dx:  0, dy: -10, scaleBoost: 0.08 },
    victory:     { dx:  0, dy: -3, scaleBoost: 0.05 },
    idle:        { dx:  0, dy:  0, scaleBoost: 0 },
  };

  static TRANSITION_FRAMES = 24;

  constructor(assets) {
    this._cache = {};
    this._assets = assets || null;
    this._poseState = {};
    this._bottomPadCache = {};
  }

  static KNOWN_BOTTOM_PAD = {
    'player': 0.234, 'don_carlos': 0.223, 'michiquito': 0.229,
    'bull': 0.072, 'gringo': 0.057, 'panzaeperra': 0.059,
    'anai': 0.031, 'hitmena': 0.010, 'don_alvaro': 0.010,
    'persefone': 0.006, 'clarisa': 0, 'karen': 0,
    'carretastar': 0, 'skin': 0, 'el_indio': 0,
  };

  _getBottomPad(img, cacheKey) {
    if (this._bottomPadCache[cacheKey] != null) return this._bottomPadCache[cacheKey];
    try {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      const w = c.width, h = c.height;
      for (let row = h - 1; row >= 0; row--) {
        for (let x = 0; x < w; x++) {
          if (data[(row * w + x) * 4 + 3] > 0) {
            this._bottomPadCache[cacheKey] = (h - 1 - row) / h;
            return this._bottomPadCache[cacheKey];
          }
        }
      }
    } catch (e) {
      for (const [slug, pad] of Object.entries(SpriteSystem.KNOWN_BOTTOM_PAD)) {
        if (cacheKey.includes(slug)) {
          this._bottomPadCache[cacheKey] = pad;
          return pad;
        }
      }
    }
    this._bottomPadCache[cacheKey] = 0;
    return 0;
  }

  static ANIM = {
    idle:        [[0,0, 0,0, -1,0, 1,0, 0,0], [0,-1, 0,-1, -1,-1, 1,-1, 0,0]],
    idle2:       [[0,-1, 0,0, 0,0, 0,0, 0,0], [0,0, 0,0, -1,0, 1,0, 0,0]],
    windup_left: [[-1,1, -1,1, -6,4, 2,0, -2,0], [-2,2, -2,2, -8,6, 3,0, -4,0]],
    windup_right:[[1,1, 1,1, -2,0, 6,4, 0,-2], [2,2, 2,2, -3,0, 8,6, 0,-4]],
    punch_left:  [[2,-1, 2,0, 8,-10, 0,0, 22,0], [1,0, 1,0, 6,-8, 0,0, 18,0]],
    punch_right: [[-2,-1, -2,0, 0,0, -8,-10, 0,22], [-1,0, -1,0, 0,0, -6,-8, 0,18]],
    recovery:    [[0,1, 0,1, -2,2, 2,2, 0,0], [0,0, 0,0, -1,1, 1,1, 0,0]],
    hurt:        [[0,3, 0,2, 2,3, -2,3, 0,0], [0,5, 0,4, 3,5, -3,5, 0,0]],
    block:       [[0,2, 0,1, 10,-14, -10,-14, 14,14], [0,1, 0,1, 9,-13, -9,-13, 13,13]],
    special:     [[0,-2, 0,-1, 0,-10, 0,-10, 10,10], [2,0, 1,0, 4,-8, -4,-8, 14,14]],
    ko:          [[0,8, 0,6, 4,10, -4,10, 0,0], [0,14, 0,10, 6,16, -6,16, 0,0], [0,20, 0,16, 8,22, -8,22, 0,0]],
    taunt:       [[0,0, 0,0, -4,-4, 6,-8, 0,6], [0,-2, 0,0, -4,-2, 6,-6, 0,8]],
    charge:      [[0,-4, 0,-2, -2,-2, 2,-2, 0,0], [0,-2, 0,0, -1,0, 1,0, 0,0]],
    sig_swing:   [[2,-1, 1,0, 10,-6, -8,-4, 20,6], [-2,1, -1,0, -8,-4, 10,-6, 6,20]],
    sig_rush:    [[0,-6, 0,-4, -3,-4, 3,-4, 8,8], [0,-3, 0,-2, -2,-2, 2,-2, 6,6]],
    sig_throw:   [[0,-3, 0,-2, 2,-12, 6,-10, 14,18], [0,-1, 0,0, 0,-8, 4,-6, 10,14]],
    sig_grab:    [[0,-2, 0,-1, 8,-10, -8,-10, 16,16], [0,0, 0,0, 6,-8, -6,-8, 12,12]],
    sig_ground:  [[0,2, 0,3, -4,6, 4,6, 0,0], [0,4, 0,5, -6,8, 6,8, 0,0]],
    sig_combo:   [[1,0, 0,0, 6,-6, -2,0, 16,4], [-1,0, 0,0, -2,0, -6,-6, 4,16], [0,-1, 0,0, 4,-8, -4,-8, 14,14]],
    sig_counter: [[0,-2, 0,-1, 6,-4, -6,-4, 8,8], [0,0, 0,0, -4,-6, 4,-6, 6,6]],
  };

  _getSpriteKey(name) { return name.replace(/\s+/g, '_').toUpperCase(); }

  _getCached(key, pixels, palette, pixelSize) {
    const ck = key + '_' + pixelSize;
    if (this._cache[ck]) return this._cache[ck];
    const h = pixels.length;
    const w = Math.max(...pixels.map(r => r.length));
    const ol = 1;
    const cvs = document.createElement('canvas');
    cvs.width = w * pixelSize + ol * 2;
    cvs.height = h * pixelSize + ol * 2;
    const c = cvs.getContext('2d');

    c.fillStyle = '#0A0A14';
    for (let row = 0; row < h; row++) {
      const line = pixels[row];
      for (let col = 0; col < line.length; col++) {
        const ch = line[col];
        if (ch === '.' || !palette[ch]) continue;
        const px = col * pixelSize + ol;
        const py = row * pixelSize + ol;
        c.fillRect(px - ol, py, pixelSize, pixelSize);
        c.fillRect(px + ol, py, pixelSize, pixelSize);
        c.fillRect(px, py - ol, pixelSize, pixelSize);
        c.fillRect(px, py + ol, pixelSize, pixelSize);
      }
    }

    for (let row = 0; row < h; row++) {
      const line = pixels[row];
      for (let col = 0; col < line.length; col++) {
        const ch = line[col];
        if (ch === '.') continue;
        const color = palette[ch];
        if (!color) continue;
        c.fillStyle = color;
        c.fillRect(col * pixelSize + ol, row * pixelSize + ol, pixelSize, pixelSize);
      }
    }

    for (let row = 0; row < h; row++) {
      const line = pixels[row];
      const vt = row / h;
      for (let col = 0; col < line.length; col++) {
        const ch = line[col];
        if (ch === '.' || !palette[ch]) continue;
        const px = col * pixelSize + ol;
        const py = row * pixelSize + ol;
        const above = (row > 0 && col < pixels[row - 1].length) ? pixels[row - 1][col] : '.';
        if (above === '.' || !palette[above]) {
          c.fillStyle = 'rgba(255,255,255,0.18)';
          c.fillRect(px, py, pixelSize, 1);
        }
        const below = (row < h - 1 && col < pixels[row + 1].length) ? pixels[row + 1][col] : '.';
        if (below === '.' || !palette[below]) {
          c.fillStyle = 'rgba(0,0,0,0.18)';
          c.fillRect(px, py + pixelSize - 1, pixelSize, 1);
        }
        if (vt > 0.7) {
          c.fillStyle = `rgba(0,0,0,${(vt - 0.7) * 0.18})`;
          c.fillRect(px, py, pixelSize, pixelSize);
        } else if (vt < 0.15) {
          c.fillStyle = `rgba(255,255,255,${(0.15 - vt) * 0.12})`;
          c.fillRect(px, py, pixelSize, pixelSize);
        }
      }
    }

    this._cache[ck] = cvs;
    return cvs;
  }

  _drawPixels(ctx, key, pixels, palette, x, y, pixelSize) {
    const sprite = this._getCached(key, pixels, palette, pixelSize);
    ctx.drawImage(sprite, Math.floor(x) - 1, Math.floor(y) - 1);
  }

  _getPoseTransition(charName, poseKey) {
    if (!this._poseState[charName]) {
      this._poseState[charName] = { current: poseKey, prev: null, t: 1 };
    }
    const ps = this._poseState[charName];
    if (ps.current !== poseKey) {
      ps.prev = ps.current;
      ps.current = poseKey;
      ps.t = 0;
    }
    if (ps.t < 1) {
      ps.t = Math.min(1, ps.t + 1 / SpriteSystem.TRANSITION_FRAMES);
    }
    return ps;
  }

  _advanceTick() {
    if (!this._tick) this._tick = 0;
    const now = Date.now();
    if (this._lastTickFrame === now) return;
    this._lastTickFrame = now;
    if (!this._lastTickTime || now - this._lastTickTime >= 16) {
      this._tick++;
      this._lastTickTime = now;
    }
  }

  _getBottomPadForSrc(src) {
    for (const [slug, pad] of Object.entries(SpriteSystem.KNOWN_BOTTOM_PAD)) {
      if (src.includes(slug)) return pad;
    }
    return 0;
  }

  _drawPoseImage(ctx, img, x, y, scale, poseKey, alpha, t) {
    const off = SpriteSystem.POSE_OFFSETS[poseKey] || SpriteSystem.POSE_OFFSETS.idle;
    const eased = t * t * (3 - 2 * t);
    const dx = off.dx * eased;
    const dy = off.dy * eased;
    const sBoost = 1 + off.scaleBoost * eased;

    let breatheY = 0;
    let breatheScale = 1;
    if (poseKey === 'idle' && t >= 1) {
      breatheY = Math.sin((this._tick || 0) * 0.04) * 1.5;
      breatheScale = 1 + Math.sin((this._tick || 0) * 0.04) * 0.01;
    }

    const drawH = 110 * (scale / 3) * sBoost * breatheScale;
    const aspect = img.naturalWidth / img.naturalHeight;
    const drawW = drawH * aspect;
    const bPad = this._getBottomPadForSrc(img.src);
    const drawX = x + dx - drawW / 2;
    const drawY = y + dy + breatheY - drawH * (1 - bPad) + 8;
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowColor = 'rgba(0,0,0,0.65)';
    ctx.shadowBlur = 1.5;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  drawOpponent(ctx, charData, anim, frame, x, y, scale) {
    this._advanceTick();
    if (this._assets && this._assets.hasPoses(charData.name)) {
      const poseKey = SpriteSystem.POSE_MAP[anim] || 'idle';
      const ps = this._getPoseTransition(charData.name, poseKey);
      const frameCount = this._assets.getPoseFrameCount(charData.name, ps.current);
      const poseFrame = frameCount > 1 ? Math.floor((this._tick || 0) / 60) % frameCount : 0;
      const curImg = this._assets.getPoseImage(charData.name, ps.current, poseFrame);

      if (curImg) {
        this._drawPoseImage(ctx, curImg, x, y, scale, ps.current, 1, ps.t);
        return;
      }
    }
    if (charData.build === 'bull') { this._drawBull(ctx, charData, anim, frame, x, y, scale); return; }
    const spriteKey = this._getSpriteKey(charData.name);
    const sd = SPRITE_DATA[spriteKey];
    const frames = SpriteSystem.ANIM[anim] || SpriteSystem.ANIM.idle;
    const f = frames[frame % frames.length];
    const pxSz = Math.max(1, Math.floor(scale * 1.2));
    if (sd) this._drawDetailed(ctx, charData, sd, f, x, y, pxSz, anim);
    else this._drawFallback(ctx, charData, f, x, y, scale);
  }

  drawOpponentHead(ctx, charData, frame, x, y, scale) {
    const ps = Math.max(1, Math.floor(scale * 1.2));
    if (charData.build === 'bull') {
      const head = BULL_SPRITE.head;
      const pal = BULL_SPRITE.palette;
      const headW = Math.max(...head.map(r=>r.length)) * ps;
      const headH = head.length * ps;
      this._drawPixels(ctx, 'bull_head_av', head, pal, x - headW/2, y - headH/2, ps);
      return;
    }
    const spriteKey = this._getSpriteKey(charData.name);
    const sd = SPRITE_DATA[spriteKey];
    if (!sd) {
      ctx.fillStyle = charData.skinColor || '#C68642';
      ctx.fillRect(x - 8*scale, y - 8*scale, 16*scale, 14*scale);
      return;
    }
    const head = sd.head;
    const pal = sd.palette;
    const headW = Math.max(...head.map(r=>r.length)) * ps;
    const headH = head.length * ps;
    this._drawPixels(ctx, charData.name+'_head_av', head, pal, x - headW/2, y - headH/2, ps);
  }

  _drawDetailed(ctx, charData, sd, f, cx, baseY, ps, anim) {
    const [hx,hy, tx,ty, lax,lay, rax,ray, lfist,rfist] = f;
    const breathe = (anim === 'idle' || anim === 'block') ? Math.sin(Date.now() * 0.003) * ps * 0.5 : 0;
    const pal = sd.palette;
    const torso = sd.torso;
    const tw = Math.max(...torso.map(r=>r.length)) * ps;
    const th = torso.length * ps;
    const torsoX = cx - tw/2 + tx * ps;
    const torsoY = baseY + ty * ps + breathe;
    this._drawPixels(ctx, charData.name+'_torso', torso, pal, torsoX, torsoY, ps);

    this._addBodyShading(ctx, torsoX, torsoY, tw, th, cx);

    const skinColor = charData.skinColor || '#C68642';
    const skinShadow = this._darken(skinColor, 0.75);
    const skinHi = this._darken(skinColor, 1.15);
    const armW = 5*ps, armH = 16*ps;
    const isBlocking = anim === 'block';

    if (!isBlocking) {
      this._drawTaperedArm(ctx, torsoX - armW + lax*ps, torsoY + 2*ps + lay*ps, armW, armH, ps, skinColor, skinShadow, skinHi, true);
      if (sd.fist) {
        const lfX = torsoX - armW - ps + lax*ps - (lfist||0)*ps*0.3;
        const lfY = torsoY + 2*ps + lay*ps + armH - (lfist||0)*ps;
        this._drawPixels(ctx, charData.name+'_lfist', sd.fist, pal, lfX, lfY, ps);
      }

      this._drawTaperedArm(ctx, torsoX + tw + rax*ps, torsoY + 2*ps + ray*ps, armW, armH, ps, skinColor, skinShadow, skinHi, false);
      if (sd.fist) {
        const rfX = torsoX + tw + rax*ps + (rfist||0)*ps*0.3;
        const rfY = torsoY + 2*ps + ray*ps + armH - (rfist||0)*ps;
        this._drawPixels(ctx, charData.name+'_rfist', sd.fist, pal, rfX, rfY, ps);
      }
    }

    const head = sd.head;
    const headW = Math.max(...head.map(r=>r.length)) * ps;
    const headH = head.length * ps;
    const headX = cx - headW/2 + hx*ps;
    const headY = torsoY - headH + hy*ps + 2*ps;
    const headKey = charData.name+'_head'+(anim==='hurt'||anim==='ko'?'_hurt':'');
    if (anim === 'hurt' || anim === 'ko') {
      const hh = this._makeHurtHead(head, pal);
      this._drawPixels(ctx, headKey, hh.pixels, hh.palette, headX, headY, ps);
    } else {
      this._drawPixels(ctx, headKey, head, pal, headX, headY, ps);
    }

    this._addBodyShading(ctx, headX, headY, headW, headH, cx, true);

    if (isBlocking) {
      this._drawTaperedArm(ctx, torsoX - armW + lax*ps, torsoY + 2*ps + lay*ps, armW, armH, ps, skinColor, skinShadow, skinHi, true);
      this._drawTaperedArm(ctx, torsoX + tw + rax*ps, torsoY + 2*ps + ray*ps, armW, armH, ps, skinColor, skinShadow, skinHi, false);
      if (sd.fist) {
        const lfX = torsoX - armW - ps + lax*ps - (lfist||0)*ps*0.3;
        const lfY = torsoY + 2*ps + lay*ps + armH - (lfist||0)*ps;
        this._drawPixels(ctx, charData.name+'_lfist', sd.fist, pal, lfX, lfY, ps);
        const rfX = torsoX + tw + rax*ps + (rfist||0)*ps*0.3;
        const rfY = torsoY + 2*ps + ray*ps + armH - (rfist||0)*ps;
        this._drawPixels(ctx, charData.name+'_rfist', sd.fist, pal, rfX, rfY, ps);
      }
    }

    this._drawAccessories(ctx, charData, sd, cx, baseY, f, ps, anim);
  }

  _makeHurtHead(pixels, palette) {
    return { pixels: pixels.map(r => r.replace(/e/g, 'S').replace(/p/g, 's')), palette };
  }

  _drawAccessories(ctx, cd, sd, cx, by, f, ps, anim) {
    const [hx,hy,tx,ty,lax,lay,rax,ray] = f;
    const tw = Math.max(...sd.torso.map(r=>r.length)) * ps;
    if (cd.name === 'DON CARLOS') {
      ctx.fillStyle = '#888';
      ctx.fillRect(cx+tw/2+rax*ps+2*ps, by+ty*ps+ray*ps+10*ps, ps, 10*ps);
      ctx.fillStyle = '#666';
      ctx.fillRect(cx+tw/2+rax*ps+ps, by+ty*ps+ray*ps+6*ps, 3*ps, 4*ps);
    }
    if (cd.name === 'GRINGO') {
      ctx.fillStyle = '#DAA520';
      ctx.fillRect(cx-6*ps, by+ty*ps+6*ps, 12*ps, 3*ps);
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(cx+4*ps, by+ty*ps+6*ps, 2*ps, 2*ps);
    }
    if (cd.name === 'CLARISA') {
      ctx.fillStyle = '#222';
      ctx.fillRect(cx+tw/2+rax*ps+ps, by+ty*ps+ray*ps+4*ps, 3*ps, 5*ps);
      ctx.fillStyle = '#4AF';
      ctx.fillRect(cx+tw/2+rax*ps+1.5*ps, by+ty*ps+ray*ps+5*ps, 2*ps, 3*ps);
    }
    if (cd.name === 'HITMENA') {
      const t = Date.now()*0.003;
      ctx.fillStyle='#D44'; ctx.fillRect(cx-16*ps+Math.sin(t)*3*ps, by-10*ps+Math.cos(t)*2*ps, 2*ps, 8*ps);
      ctx.fillStyle='#44D'; ctx.fillRect(cx+14*ps+Math.cos(t)*3*ps, by-8*ps+Math.sin(t)*2*ps, 2*ps, 8*ps);
      ctx.fillStyle='#4D4'; ctx.fillRect(cx+Math.sin(t+2)*4*ps, by-14*ps+Math.cos(t+1)*2*ps, 2*ps, 8*ps);
    }
    if (cd.name === 'PERSEFONE') {
      const t = Date.now()*0.005; const glow = Math.sin(t)*0.3+0.4;
      ctx.fillStyle = `rgba(57,255,20,${glow})`;
      ctx.fillRect(cx-tw/2-6*ps+lax*ps, by+lay*ps+14*ps, 4*ps, 2*ps);
      ctx.fillStyle = `rgba(0,255,255,${glow})`;
      ctx.fillRect(cx+tw/2+2*ps+rax*ps, by+ray*ps+14*ps, 4*ps, 2*ps);
    }
    if (cd.name === 'DON ALVARO') {
      ctx.fillStyle='#C0C0C0';
      for(let i=0;i<3;i++) ctx.fillRect(cx-4*ps+i*3*ps+tx*ps, by+ty*ps+17*ps, ps, 3*ps);
    }
    if (cd.name === 'SKIN') {
      ctx.fillStyle='#445';
      const tpw = tw; const laX=cx-tpw/2-5*ps+lax*ps; const laY=by+ty*ps+2*ps+lay*ps;
      ctx.fillRect(laX+ps,laY+3*ps,3*ps,ps);ctx.fillRect(laX+2*ps,laY+5*ps,ps,3*ps);
      const raX=cx+tpw/2+rax*ps; const raY=by+ty*ps+2*ps+ray*ps;
      ctx.fillRect(raX+ps,raY+2*ps,3*ps,ps);ctx.fillRect(raX+ps,raY+5*ps,2*ps,2*ps);
    }
    if (cd.name === 'EL INDIO') {
      const headY = by+hy*ps-sd.head.length*ps;
      ctx.fillStyle='#C41E3A'; ctx.fillRect(cx+hx*ps-2*ps, headY-4*ps, ps, 5*ps);
      ctx.fillStyle='#228B22'; ctx.fillRect(cx+hx*ps+ps, headY-6*ps, ps, 7*ps);
      ctx.fillStyle='#FFD700'; ctx.fillRect(cx+hx*ps+3*ps, headY-3*ps, ps, 4*ps);
      ctx.fillStyle='#0A5'; ctx.fillRect(cx-4*ps+tx*ps, by+ty*ps-ps, 8*ps, ps);
    }
  }

  _drawFallback(ctx, cd, f, x, y, s) {
    const [hx,hy,tx,ty] = f;
    ctx.fillStyle = cd.shirtColor||'#FFF';
    ctx.fillRect(x-12*s+tx, y+ty, 24*s, 26*s);
    ctx.fillStyle = cd.skinColor||'#C68642';
    ctx.fillRect(x-10*s+hx, y+ty-18*s+hy, 20*s, 18*s);
  }

  _drawBull(ctx, c, anim, frame, x, y, s) {
    const frames = SpriteSystem.ANIM[anim] || SpriteSystem.ANIM.idle;
    const f = frames[frame % frames.length];
    const [hx,hy,tx,ty] = f;
    const ps = Math.max(1, Math.floor(s*1.1));
    const pal = BULL_SPRITE.palette;
    const body = BULL_SPRITE.body;
    const bodyW = Math.max(...body.map(r=>r.length))*ps;
    this._drawPixels(ctx, 'bull_body', body, pal, x-bodyW/2+tx*ps, y+ty*ps+4*ps, ps);
    const head = BULL_SPRITE.head;
    const headW = Math.max(...head.map(r=>r.length))*ps;
    const headH = head.length*ps;
    const isAngry = anim==='charge'||anim==='special'||anim==='sig_rush';
    if (isAngry) {
      this._drawPixels(ctx, 'bull_head_angry', head, {...pal,e:'#F00'}, x-headW/2+hx*ps, y-headH+hy*ps+6*ps, ps);
      ctx.fillStyle='rgba(200,200,200,0.6)';
      for(let i=0;i<4;i++) ctx.fillRect(x+(Math.random()-0.5)*10*ps+hx*ps, y+hy*ps+8*ps+Math.random()*4*ps, 2*ps, ps);
    } else {
      this._drawPixels(ctx, 'bull_head', head, pal, x-headW/2+hx*ps, y-headH+hy*ps+6*ps, ps);
    }
    ctx.fillStyle = CONST.COLORS.GOLD;
    ctx.fillRect(x-ps+hx*ps, y+hy*ps+6*ps, 2*ps, 3*ps);
  }

  drawPlayer(ctx, anim, frame, x, y, s) {
    this._advanceTick();
    if (this._assets && this._assets.hasPoses('PLAYER')) {
      const poseKey = SpriteSystem.POSE_MAP[anim] || 'idle';
      const ps = this._getPoseTransition('__PLAYER__', poseKey);
      const frameCount = this._assets.getPoseFrameCount('PLAYER', poseKey);
      const poseFrame = frameCount > 1 ? Math.floor((this._tick || 0) / 60) % frameCount : 0;
      const curImg = this._assets.getPoseImage('PLAYER', poseKey, poseFrame);
      if (curImg) {
        const poseOff = SpriteSystem.PLAYER_POSE_OFFSETS[ps.current] || SpriteSystem.PLAYER_POSE_OFFSETS.idle;
        const pEased = ps.t < 1 ? ps.t * ps.t * (3 - 2 * ps.t) : 1;
        const pDx = poseOff.dx * pEased;
        const pDy = poseOff.dy * pEased;
        const drawH = 110 * (s / 2);
        const aspect = curImg.naturalWidth / curImg.naturalHeight;
        const drawW = drawH * aspect;
        const bPad = this._getBottomPadForSrc(curImg.src);
        const drawX = x + pDx - drawW / 2;
        const drawY = y + pDy - drawH * (1 - bPad) + 10;
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowColor = 'rgba(0,0,0,0.65)';
        ctx.shadowBlur = 1.5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.drawImage(curImg, drawX, drawY, drawW, drawH);
        ctx.restore();
        return;
      }
    }
    const frames = SpriteSystem.ANIM[anim] || SpriteSystem.ANIM.idle;
    const f = frames[frame % frames.length];
    const [hx,hy,tx,ty,lax,lay,rax,ray,lfist,rfist] = f;
    const ps = Math.max(1, Math.round(s));
    const breathe = (anim === 'idle' || anim === 'block') ? Math.sin(Date.now() * 0.003 + 1.5) * ps * 0.5 : 0;
    const pal = PLAYER_SPRITE.palette;
    const torso = PLAYER_SPRITE.torso;
    const tw = Math.max(...torso.map(r=>r.length)) * ps;
    const torsoX = x - tw/2 + tx*ps;
    const torsoY = y + ty*ps + breathe;
    this._drawPixels(ctx, 'player_torso', torso, pal, torsoX, torsoY, ps);
    this._addBodyShading(ctx, torsoX, torsoY, tw, torso.length * ps, x);

    const skinColor = CONST.COLORS.SKIN_MEDIUM;
    const skinShadow = this._darken(skinColor, 0.75);
    const skinHi = this._darken(skinColor, 1.15);
    const armW = 4*ps, armH = 12*ps;

    this._drawTaperedArm(ctx, torsoX - armW + lax*ps, torsoY + 2*ps + lay*ps, armW, armH, ps, skinColor, skinShadow, skinHi, true);

    const lfX = torsoX - armW - 2*ps + lax*ps - (lfist||0)*ps*0.3;
    const lfY = torsoY + 2*ps + lay*ps + armH - (lfist||0)*ps;
    this._drawPixels(ctx, 'player_lfist', PLAYER_SPRITE.fist, pal, lfX, lfY, ps);

    this._drawTaperedArm(ctx, torsoX + tw + rax*ps, torsoY + 2*ps + ray*ps, armW, armH, ps, skinColor, skinShadow, skinHi, false);

    const rfX = torsoX + tw + rax*ps + (rfist||0)*ps*0.3;
    const rfY = torsoY + 2*ps + ray*ps + armH - (rfist||0)*ps;
    this._drawPixels(ctx, 'player_rfist', PLAYER_SPRITE.fist, pal, rfX, rfY, ps);

    const head = PLAYER_SPRITE.head;
    const headW = Math.max(...head.map(r=>r.length)) * ps;
    const headH = head.length * ps;
    const headX = x - headW/2 + hx*ps;
    const headY = torsoY - headH + hy*ps + 2*ps;
    if (anim === 'hurt' || anim === 'ko') {
      const hh = this._makeHurtHead(head, pal);
      this._drawPixels(ctx, 'player_head_hurt', hh.pixels, hh.palette, headX, headY, ps);
    } else {
      this._drawPixels(ctx, 'player_head', head, pal, headX, headY, ps);
    }
    this._addBodyShading(ctx, headX, headY, headW, headH, x, true);
  }

  _drawTaperedArm(ctx, x, y, w, h, ps, skin, shadow, highlight, isLeft) {
    const segments = Math.floor(h / ps);
    ctx.fillStyle = '#0A0A14';
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const taper = Math.floor(w * (1 - t * 0.25));
      const sx = isLeft ? x + (w - taper) : x;
      const sy = y + i * ps;
      ctx.fillRect(sx - 1, sy, taper + 2, ps);
      if (i === 0) ctx.fillRect(sx, sy - 1, taper, 1);
      if (i === segments - 1) ctx.fillRect(sx, sy + ps, taper, 1);
    }
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const taper = Math.floor(w * (1 - t * 0.25));
      const sx = isLeft ? x + (w - taper) : x;
      const sy = y + i * ps;
      ctx.fillStyle = skin;
      ctx.fillRect(sx, sy, taper, ps);
      ctx.fillStyle = shadow;
      ctx.fillRect(isLeft ? sx : sx + taper - ps, sy, ps, ps);
      if (i < segments * 0.55) {
        ctx.fillStyle = highlight;
        ctx.fillRect(isLeft ? sx + taper - ps : sx + ps, sy, ps, ps);
      }
      if (i === Math.floor(segments * 0.5)) {
        ctx.fillStyle = shadow;
        ctx.fillRect(sx + ps, sy, taper - 2 * ps, ps);
      }
      if (i === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(sx, sy, taper, 1);
      }
      if (i === segments - 1) {
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(sx, sy + ps - 1, taper, 1);
      }
    }
  }

  _addBodyShading(ctx, x, y, w, h, centerX, isHead) {
    const cx = centerX - x;
    const hw = w / 2;

    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';

    const edgeGrad = ctx.createRadialGradient(x + cx, y + h * 0.4, hw * 0.3, x + cx, y + h * 0.4, hw * 1.1);
    edgeGrad.addColorStop(0, 'rgba(0,0,0,0)');
    edgeGrad.addColorStop(0.6, 'rgba(0,0,0,0)');
    edgeGrad.addColorStop(1, 'rgba(0,0,0,0.15)');
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(x, y, w, h);

    const topLight = ctx.createLinearGradient(x, y, x, y + h);
    topLight.addColorStop(0, 'rgba(255,255,255,0.08)');
    topLight.addColorStop(0.25, 'rgba(255,255,255,0)');
    topLight.addColorStop(0.75, 'rgba(0,0,0,0)');
    topLight.addColorStop(1, 'rgba(0,0,0,0.1)');
    ctx.fillStyle = topLight;
    ctx.fillRect(x, y, w, h);

    if (isHead) {
      const specGrad = ctx.createRadialGradient(x + cx - hw * 0.2, y + h * 0.3, 1, x + cx - hw * 0.2, y + h * 0.3, hw * 0.4);
      specGrad.addColorStop(0, 'rgba(255,255,255,0.1)');
      specGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = specGrad;
      ctx.fillRect(x, y, w, h);
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  }

  _darken(hex, factor) {
    const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    return '#'+[r,g,b].map(c=>Math.min(255,Math.max(0,Math.floor(c*factor))).toString(16).padStart(2,'0')).join('');
  }
}
