import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(2015.0, 1379.7);
  ctx.bezierCurveTo(2012.6, 1379.7, 2003.7, 1379.9, 2003.2, 1379.9);
  ctx.bezierCurveTo(2003.2, 1379.9, 2003.0, 1375.9, 2003.0, 1375.9);
  ctx.bezierCurveTo(2012.1, 1374.0, 2019.5, 1370.1, 2009.8, 1362.0);
  ctx.bezierCurveTo(2003.5, 1354.4, 1999.4, 1343.8, 1990.1, 1339.4);
  ctx.bezierCurveTo(1982.5, 1336.6, 1966.2, 1347.5, 1978.9, 1352.9);
  ctx.bezierCurveTo(1979.2, 1361.6, 1984.1, 1370.7, 1992.1, 1374.4);
  ctx.bezierCurveTo(1992.1, 1375.6, 1992.3, 1379.0, 1992.3, 1380.0);
  ctx.bezierCurveTo(1989.4, 1379.9, 1989.2, 1383.4, 1991.3, 1384.7);
  ctx.bezierCurveTo(1996.9, 1384.9, 2005.2, 1384.9, 2011.3, 1385.1);
  ctx.bezierCurveTo(2013.3, 1384.9, 2015.7, 1385.8, 2016.9, 1384.2);
  ctx.bezierCurveTo(2017.8, 1382.6, 2017.0, 1379.5, 2015.0, 1379.7);
  ctx.closePath();

  // bird20/object/Compound Path/Path
  ctx.moveTo(1999.4, 1380.0);
  ctx.lineTo(1996.0, 1380.0);
  ctx.bezierCurveTo(1996.0, 1380.0, 1996.0, 1375.6, 1996.1, 1375.6);
  ctx.bezierCurveTo(1996.1, 1375.6, 1999.8, 1375.9, 1999.8, 1375.8);
  ctx.bezierCurveTo(1999.8, 1375.9, 1999.4, 1380.0, 1999.4, 1380.0);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird20', 'Bird 20', null, create, { x: 1500, y: 1280 }, 'fun');
