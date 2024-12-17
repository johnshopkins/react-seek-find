import { FindableObject } from '../../../../src/js/main';

const create = () => {
  const ctx = new Path2D();

  ctx.moveTo(1077.6, 741.5);
  ctx.bezierCurveTo(1075.5, 736.4, 1074.1, 731.9, 1072.9, 726.4);
  ctx.bezierCurveTo(1072.1, 720.7, 1072.3, 713.8, 1067.3, 710.0);
  ctx.bezierCurveTo(1064.3, 708.1, 1059.9, 707.9, 1056.6, 709.2);
  ctx.bezierCurveTo(1054.9, 711.7, 1058.0, 715.3, 1058.7, 716.9);
  ctx.bezierCurveTo(1051.7, 723.0, 1051.3, 737.3, 1059.5, 743.0);
  ctx.bezierCurveTo(1059.5, 746.2, 1059.5, 749.3, 1059.5, 752.5);
  ctx.bezierCurveTo(1057.6, 753.8, 1058.6, 757.0, 1061.1, 756.5);
  ctx.bezierCurveTo(1065.0, 756.3, 1068.9, 757.0, 1072.8, 756.5);
  ctx.bezierCurveTo(1075.9, 755.4, 1074.4, 752.2, 1072.4, 751.8);
  ctx.bezierCurveTo(1071.4, 751.6, 1069.7, 751.7, 1068.7, 751.8);
  ctx.bezierCurveTo(1068.7, 749.7, 1068.8, 747.6, 1068.8, 745.4);
  ctx.bezierCurveTo(1071.7, 747.3, 1072.6, 746.1, 1075.0, 746.0);
  ctx.bezierCurveTo(1078.2, 746.9, 1078.9, 745.3, 1077.6, 741.5);
  ctx.closePath();

  // bird4/object/Compound Path/Path
  ctx.moveTo(1065.5, 751.7);
  ctx.lineTo(1062.9, 752.0);
  ctx.lineTo(1063.0, 744.5);
  ctx.lineTo(1065.5, 745.4);
  ctx.lineTo(1065.5, 751.7);
  ctx.closePath();

  return ctx;
}

export default new FindableObject('bird4', 'Bird 4', null, create, { x: 475, y: 490 }, 'fun');
