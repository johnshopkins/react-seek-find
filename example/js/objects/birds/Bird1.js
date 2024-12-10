import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const path = new Path2D();

  path.moveTo(407.9, 1236.1);
  path.bezierCurveTo(402.2, 1236.0, 392.1, 1240.9, 390.8, 1250.0);
  path.bezierCurveTo(390.8, 1250.0, 354.2, 1294.1, 352.3, 1300.2);
  path.bezierCurveTo(354.6, 1309.2, 372.2, 1310.9, 381.8, 1310.2);
  path.lineTo(381.8, 1319.0);
  path.bezierCurveTo(381.8, 1319.0, 380.5, 1319.0, 377.7, 1319.0);
  path.bezierCurveTo(374.8, 1319.0, 373.2, 1329.2, 378.3, 1329.2);
  path.lineTo(415.5, 1329.2);
  path.bezierCurveTo(418.7, 1329.0, 417.5, 1318.8, 414.5, 1318.8);
  path.lineTo(400.8, 1318.8);
  path.lineTo(400.8, 1305.9);
  path.bezierCurveTo(420.9, 1297.0, 424.8, 1271.5, 419.2, 1258.5);
  path.bezierCurveTo(419.2, 1258.5, 427.9, 1255.3, 427.8, 1250.2);
  path.bezierCurveTo(428.5, 1243.8, 415.2, 1236.2, 407.9, 1236.1);
  path.closePath();

  path.moveTo(395.0, 1318.7);
  path.lineTo(387.9, 1318.7);
  path.bezierCurveTo(387.9, 1318.7, 387.9, 1309.1, 387.9, 1309.2);
  path.bezierCurveTo(389.5, 1308.8, 395.0, 1307.2, 395.0, 1307.2);
  path.lineTo(395.0, 1318.7);
  path.closePath();

  return path;
}

export default new FindableObject('bird1', 'Bird 1', null, create, { x: 0, y: 792 });
