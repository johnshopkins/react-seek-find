import { FindableObject } from '../../../src/js/main';

import thumbnail from '../../images/football.png';

const create = () => {

  const path = new Path2D();

  path.moveTo(691.4, 916.1);
  path.lineTo(688.6, 916.1);
  path.bezierCurveTo(688.1, 913.7, 685.0, 910.1, 685.0, 910.1);
  path.bezierCurveTo(686.4, 908.1, 691.4, 905.5, 691.4, 905.5);
  path.bezierCurveTo(689.2, 899.2, 681.5, 870.7, 687.3, 859.0);
  path.bezierCurveTo(678.6, 864.1, 676.0, 858.4, 671.6, 846.7);
  path.bezierCurveTo(664.6, 846.8, 661.7, 843.4, 661.1, 842.7);
  path.bezierCurveTo(661.7, 832.4, 672.3, 821.4, 686.4, 830.4);
  path.bezierCurveTo(686.8, 835.0, 684.3, 839.6, 682.5, 842.1);
  path.lineTo(684.4, 845.1);
  path.bezierCurveTo(685.8, 842.1, 692.7, 836.1, 692.7, 836.1);
  path.lineTo(691.8, 835.7);
  path.bezierCurveTo(690.3, 836.0, 689.2, 834.1, 689.2, 834.1);
  path.bezierCurveTo(688.0, 834.1, 687.9, 832.6, 687.9, 832.6);
  path.bezierCurveTo(691.7, 831.3, 684.3, 805.2, 707.4, 805.2);
  path.bezierCurveTo(707.4, 805.2, 722.1, 804.3, 714.5, 827.9);
  path.bezierCurveTo(726.2, 839.0, 739.7, 839.4, 721.4, 861.4);
  path.bezierCurveTo(721.8, 865.8, 719.9, 869.6, 718.6, 870.8);
  path.bezierCurveTo(719.6, 872.3, 720.2, 877.9, 720.2, 877.9);
  path.bezierCurveTo(719.6, 880.6, 716.0, 883.8, 715.5, 886.0);
  path.bezierCurveTo(714.6, 889.8, 712.7, 892.9, 712.8, 894.2);
  path.bezierCurveTo(711.1, 894.0, 708.2, 894.5, 708.2, 894.5);
  path.bezierCurveTo(707.1, 889.4, 702.4, 875.4, 697.8, 877.1);
  path.bezierCurveTo(693.2, 878.8, 692.3, 896.2, 696.6, 903.3);
  path.bezierCurveTo(693.5, 905.1, 690.5, 911.9, 691.4, 916.1);
  path.closePath();

  return path;
}

export default new FindableObject('football', 'Woman with football', thumbnail, create, { x: 410, y: 594 });
